import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { z } from "zod";

import type { ContainerBackend } from "./backend";
import type { AgentState } from "./backend";
import type { AgentboxConfig, TmuxMode } from "./config";
import { resolveCacheImages } from "./config";
import { exec, shellEscape, once } from "./exec";
import type { AllocatedPort } from "./k8s";
export type { AgentState } from "./backend";
import * as p from "@clack/prompts";

import {
    createBackend,
    getBackendState,
    isBackendRunning,
    startBackend,
    stopBackend,
    buildExecCommand,
    getBackendServicePorts,
    getBackendLogs,
} from "./backend";
import type { BackendLogsOptions } from "./backend";
import { ensureImageCache } from "./cache";
import type { AgentName, AgentPaths, RepoPath } from "./git";
import { getAgentPaths, removeWorktree } from "./git";
import { buildAgentImage } from "./image";
import { Ok, Err } from "./result";
import type { Result } from "./result";
import type { SessionName } from "./tmux";
import {
    ensureSession,
    setupMode,
    windowExists,
    sendKeys,
    createWindow,
    isTmuxInstalled,
    sessionExists,
    gracefullyKillSession,
    sanitizeSessionName,
} from "./tmux";
import { checkVm } from "./vm";

// ============================================================================
// AgentContext — single object replacing fragmented parameter passing
// ============================================================================

export interface AgentContext {
    readonly name: AgentName;
    readonly paths: AgentPaths;
    readonly config: AgentboxConfig;
    readonly backend: ContainerBackend;
}

// ============================================================================
// k3s detection (cached)
// ============================================================================

export const isK3sAvailable: () => Promise<boolean> = once(async () => {
    const result = await exec("which k3s", { captureOutput: true, rejectOnNonZeroExit: false });
    return result.code === 0;
});

// ============================================================================
// Backend kind selection (pure)
// ============================================================================

export function selectBackendKind(k3sAvailable: boolean): "k3s" | "docker" {
    return k3sAvailable ? "k3s" : "docker";
}

// ============================================================================
// Backend resolution
// ============================================================================

async function resolveBackend(agentName: AgentName): Promise<ContainerBackend> {
    const kind = selectBackendKind(await isK3sAvailable());
    return createBackend(agentName, kind);
}

// ============================================================================
// One-shot backend fallback log
// ============================================================================

const logFallbackOnce = once(async () => {
    p.log.step("k3s not found — falling back to plain Docker (less secure)");
});

export async function logBackendFallback(): Promise<void> {
    if (await isK3sAvailable()) return;
    await logFallbackOnce();
}

// ============================================================================
// Context factory
// ============================================================================

export async function createAgentContext(
    name: AgentName,
    repoPath: RepoPath,
    config: AgentboxConfig
): Promise<AgentContext> {
    const paths = getAgentPaths(repoPath, name);
    const backend = await resolveBackend(name);
    return { name, paths, config, backend };
}

// ============================================================================
// Pre-flight VM readiness check
// ============================================================================

async function preflightVmCheck(): Promise<Result<void, string>> {
    const diagnosis = await checkVm();
    if (diagnosis.allGood) return Ok(undefined);

    for (const check of diagnosis.checks) {
        if (!check.ok) {
            p.log.error(`${check.name}`);
        }
    }

    if (diagnosis.fixScript != null) {
        const fixPath = path.join(os.tmpdir(), "agentbox-fix-vm.sh");
        fs.writeFileSync(fixPath, diagnosis.fixScript, { mode: 0o755 });
        p.note(`bash ${fixPath}`, "Run the fix script to resolve:");
    }

    return Err("VM not ready — run `agentbox check-vm` for details");
}

// ============================================================================
// Claude bypass permissions
// ============================================================================

const ClaudeJsonSchema = z
    .object({ bypassPermissionsModeAccepted: z.boolean().optional() })
    .passthrough();

function ensureClaudeBypassPermissions(hostHome: string): void {
    const claudeJsonPath = path.join(hostHome, ".claude.json");
    try {
        if (!fs.existsSync(claudeJsonPath)) return;

        const raw = fs.readFileSync(claudeJsonPath, "utf-8");
        const parsed: unknown = JSON.parse(raw);
        const result = ClaudeJsonSchema.safeParse(parsed);
        if (!result.success) return;
        if (result.data.bypassPermissionsModeAccepted === true) return;

        const updated = { ...result.data, bypassPermissionsModeAccepted: true as const };
        fs.writeFileSync(claudeJsonPath, JSON.stringify(updated, null, 2) + "\n");
    } catch {
        // File may be missing, malformed, or unwritable — skip silently
    }
}

// ============================================================================
// Agent lifecycle
// ============================================================================

async function readGitIdentity(): Promise<
    { readonly name: string; readonly email: string } | undefined
> {
    const gitName = (
        await exec("git config --global user.name", {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        })
    ).stdout.trim();
    const gitEmail = (
        await exec("git config --global user.email", {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        })
    ).stdout.trim();
    return gitName && gitEmail ? { name: gitName, email: gitEmail } : undefined;
}

async function runContainerInstall(config: AgentboxConfig, execPrefix: string): Promise<void> {
    const installFns = config.dependencyStrategies
        .map((s) => s.containerInstall)
        .filter((fn): fn is NonNullable<typeof fn> => fn != null);

    for (const install of installFns) {
        const commands = await install("/workspace");
        for (const cmd of commands) {
            p.log.step(`Installing: ${cmd}`);
            await exec(`${execPrefix} ${shellEscape(cmd)}`, { rejectOnNonZeroExit: false });
        }
    }
}

async function loadCachedImages(
    backend: ContainerBackend,
    imageCachePath: string | undefined
): Promise<void> {
    if (!imageCachePath) return;

    const cacheSpinner = p.spinner();
    cacheSpinner.start("Loading cached docker images...");
    await exec(
        `${buildExecCommand(backend, "bash -c")} ${shellEscape("until docker info >/dev/null 2>&1; do sleep 1; done && docker load -i /cache/docker-images.tar")}`,
        { rejectOnNonZeroExit: false }
    );
    cacheSpinner.stop("Cached docker images loaded");
}

export async function getAgentState(nameOrCtx: AgentName | AgentContext): Promise<AgentState> {
    if (typeof nameOrCtx === "string") {
        const backend = await resolveBackend(nameOrCtx);
        return getBackendState(backend);
    }
    return getBackendState(nameOrCtx.backend);
}

export async function isAgentRunning(nameOrCtx: AgentName | AgentContext): Promise<boolean> {
    return (await getAgentState(nameOrCtx)).kind === "running";
}

export async function getAgentPorts(
    nameOrCtx: AgentName | AgentContext
): Promise<readonly AllocatedPort[]> {
    if (typeof nameOrCtx === "string") {
        const backend = await resolveBackend(nameOrCtx);
        return getBackendServicePorts(backend);
    }
    return getBackendServicePorts(nameOrCtx.backend);
}

export async function getAgentLogs(
    agentName: AgentName,
    options: BackendLogsOptions = {}
): Promise<Result<string, string>> {
    const backend = await resolveBackend(agentName);
    return getBackendLogs(backend, options);
}

export async function stopAgent(agentName: AgentName): Promise<Result<void, string>> {
    const backend = await resolveBackend(agentName);
    return stopBackend(backend);
}

export interface ExecInAgentOptions {
    readonly interactive?: boolean;
}

export async function execInAgent(
    agentName: AgentName,
    command: string | undefined,
    options: ExecInAgentOptions = {}
): Promise<Result<number, string>> {
    const { interactive = true } = options;
    const backend = await resolveBackend(agentName);
    const execCmd = buildExecCommand(backend, command, { interactive });
    const result = await exec(execCmd, { captureOutput: !interactive, rejectOnNonZeroExit: false });

    if (!interactive && result.stdout.length > 0) {
        process.stdout.write(result.stdout);
    }
    if (!interactive && result.stderr.length > 0) {
        process.stderr.write(result.stderr);
    }

    return Ok(result.code ?? 1);
}

export async function ensureAgentPod(ctx: AgentContext): Promise<Result<void, string>> {
    const { name, paths, config, backend } = ctx;

    // Already running — nothing to do
    if (await isBackendRunning(backend)) {
        p.log.step(backend.kind === "k3s" ? "Pod already running" : "Container already running");
        return Ok(undefined);
    }

    // Pre-flight VM check (k3s only)
    if (backend.kind === "k3s") {
        const vmResult = await preflightVmCheck();
        if (!vmResult.ok) return vmResult;
    }

    // Build image
    const buildSpinner = p.spinner();
    buildSpinner.start("Building agent image...");
    const imageResult = await buildAgentImage(config.containerImage, backend.kind);
    if (!imageResult.ok) {
        buildSpinner.stop("Failed");
        return imageResult;
    }
    buildSpinner.stop("Agent image built");
    const imageName = imageResult.value;

    // Prepare image cache
    const cacheResult = config.cacheImages
        ? await ensureImageCache(paths.agentsDir, await resolveCacheImages(config.cacheImages))
        : Ok(null);
    if (!cacheResult.ok) return cacheResult;
    const imageCachePath = cacheResult.value ?? undefined;

    // Read git identity
    const gitUser = await readGitIdentity();

    // Ensure Claude bypass permissions are set before mounting .claude.json
    ensureClaudeBypassPermissions(os.homedir());

    // Collect strategy volumes
    const { collectStrategyVolumes } = await import("./strategies");
    const strategyVolumes = collectStrategyVolumes(config.dependencyStrategies);

    // Start container
    const startSpinner = p.spinner();
    startSpinner.start(
        backend.kind === "k3s" ? "Starting agent pod..." : "Starting Docker container..."
    );
    const startResult = await startBackend(backend, {
        agentName: name,
        worktreePath: paths.worktree,
        bareRepoPath: paths.bareRepo,
        config,
        imageName,
        imageCachePath,
        gitUser,
        strategyVolumes,
    });
    if (!startResult.ok) {
        startSpinner.stop("Failed");
        return startResult;
    }
    startSpinner.stop(backend.kind === "k3s" ? "Agent pod started" : "Docker container started");

    // Load cached docker images (non-fatal)
    await loadCachedImages(backend, imageCachePath);

    // Run container install (non-fatal)
    await runContainerInstall(config, buildExecCommand(backend, "bash -c"));

    return Ok(undefined);
}

export async function setupAgentTmux(
    ctx: AgentContext,
    mode: TmuxMode | undefined
): Promise<Result<SessionName, string>> {
    const { name, paths, config, backend } = ctx;

    const sessionResult = await ensureSession(name, paths.worktree);
    if (!sessionResult.ok) return sessionResult;
    const session = sessionResult.value;

    if (!(await windowExists(session, "main"))) {
        const windowResult = await createWindow(session, "main");
        if (!windowResult.ok) return windowResult;
        const mainTarget = windowResult.value;

        const execResult = await sendKeys(mainTarget, buildExecCommand(backend));
        if (!execResult.ok) return execResult;
    }

    if (mode) {
        const initLines = config.dependencyStrategies.flatMap((s) => s.shellInit?.() ?? []);
        const initPrefix = initLines.length > 0 ? initLines.join(" && ") + " && " : "";

        const wrapCommand = (cmd: string) =>
            buildExecCommand(backend, `bash -c ${shellEscape(`${initPrefix}${cmd}`)}`);
        const modeResult = await setupMode(session, mode, wrapCommand);
        if (!modeResult.ok) return modeResult;
    }

    return Ok(session);
}

// ============================================================================
// Shared lifecycle orchestration
// ============================================================================

/** Compose ensureAgentPod + setupAgentTmux into a single step. */
export async function startAndSetupAgent(
    ctx: AgentContext,
    mode: TmuxMode | undefined
): Promise<Result<SessionName, string>> {
    const podResult = await ensureAgentPod(ctx);
    if (!podResult.ok) return podResult;

    return setupAgentTmux(ctx, mode);
}

/** Log a lifecycle error with VM diagnostic hint. Returns exit code 1. */
export function handleLifecycleError(error: string): number {
    p.log.error(error);
    p.log.info("Run `agentbox check-vm` to diagnose VM issues");
    p.outro("Aborted");
    return 1;
}

// ============================================================================
// Agent removal lifecycle
// ============================================================================

export interface RemoveAgentOptions {
    readonly force: boolean;
}

export interface AgentPresence {
    readonly hasSession: boolean;
    readonly agentState: AgentState;
    readonly hasWorktree: boolean;
}

/** Detect what resources exist for a given agent. Pure discovery, no UI. */
export async function detectAgentPresence(
    agentName: AgentName,
    paths: AgentPaths
): Promise<AgentPresence> {
    const tmuxAvailable = await isTmuxInstalled();
    const hasSession = tmuxAvailable && (await sessionExists(sanitizeSessionName(agentName)));
    const agentState = await getAgentState(agentName);
    const hasWorktree = fs.existsSync(paths.worktree);
    return { hasSession, agentState, hasWorktree };
}

/**
 * Remove an agent's resources: stop/remove container, remove worktree, kill tmux session.
 *
 * Pure lifecycle orchestration — no UI (no spinners, no clack output).
 * When `force` is true, continues through failures collecting warnings.
 * When `force` is false, aborts on first failure.
 *
 * Tmux session is killed last so `rm` can be run from inside the session.
 */
export async function removeAgent(
    agentName: AgentName,
    paths: AgentPaths,
    presence: AgentPresence,
    options: RemoveAgentOptions
): Promise<Result<{ readonly warnings: readonly string[] }, string>> {
    const { force } = options;
    const { hasSession, agentState, hasWorktree } = presence;

    // 1. Stop/remove container
    const containerWarning = await (async (): Promise<Result<string | undefined, string>> => {
        if (agentState.kind === "not-found") return Ok(undefined);
        const stopResult = await stopAgent(agentName);
        if (stopResult.ok) return Ok(undefined);
        if (!force) return Err(stopResult.error);
        return Ok(
            `Container ${agentState.kind === "running" ? "stop" : "removal"} failed: ${stopResult.error}`
        );
    })();
    if (!containerWarning.ok) return containerWarning;

    // 2. Remove worktree
    const worktreeWarning = await (async (): Promise<Result<string | undefined, string>> => {
        if (!hasWorktree) return Ok(undefined);
        if (!fs.existsSync(paths.bareRepo)) {
            fs.rmSync(paths.worktree, { recursive: true, force: true });
            return Ok(undefined);
        }
        const removeResult = await removeWorktree(paths.bareRepo, paths.worktree, true);
        if (removeResult.ok) return Ok(undefined);
        if (!force) return Err(removeResult.error);
        // Fallback: git worktree remove failed, delete directory directly
        fs.rmSync(paths.worktree, { recursive: true, force: true });
        return Ok("Worktree removal failed, falling back to direct deletion");
    })();
    if (!worktreeWarning.ok) return worktreeWarning;

    // 3. Kill tmux session last — allows `agent rm` to be run from inside the session
    if (hasSession) {
        await gracefullyKillSession(sanitizeSessionName(agentName));
    }

    return Ok({
        warnings: [containerWarning.value, worktreeWarning.value].filter(
            (w): w is string => w != null
        ),
    });
}
