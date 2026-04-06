import * as fs from "fs";
import * as path from "path";

import * as p from "@clack/prompts";
import { match } from "ts-pattern";

import {
    createAgentContext,
    startAndSetupAgent,
    handleLifecycleError,
    getAgentPorts,
    logBackendFallback
} from "../lib/agent";
import {
    getAgentPaths,
    getAgentsDirPaths,
    ensureBareRepo,
    syncBareRepo,
    createWorktree,
    branchExists,
    getMainBranch,
    CANCELLED
} from "../lib/git";
import type { AgentName, BareRepoPath, GitContext } from "../lib/git";
import {
    isInsideTmux,
    isTmuxInstalled,
    sessionExists,
    sendKeys,
    ensureSession,
    switchOrAttach,
    createWindow,
    getCurrentSessionName,
    sanitizeSessionName
} from "../lib/tmux";
import { resolveConfig } from "./resolve-config";
import { resolveNewArgs, buildReinvokeArgs, ensureHostPreparation } from "./resolve-new";
import type { ResolvedNewArgs } from "./resolve-new";

export async function cmdNew(opts: {
    readonly branch?: string;
    readonly base?: string;
    readonly mode?: string;
    readonly noTmux: boolean;
    readonly trust: boolean;
    readonly untrusted: boolean;
    readonly useLocalBranch: boolean;
    readonly noFocus: boolean;
}): Promise<number> {
    const resolved = await resolveConfig();
    if (resolved == null) return 1;
    const { config, gitContext } = resolved;
    const dirPaths = getAgentsDirPaths(gitContext);
    const bareRepoPath = fs.existsSync(dirPaths.bareRepo) ? dirPaths.bareRepo : null;

    const resolution = await resolveNewArgs(
        { branch: opts.branch, base: opts.base, mode: opts.mode, noTmux: opts.noTmux },
        config,
        gitContext,
        bareRepoPath
    );

    return match(resolution)
        .with({ kind: "cancelled" }, () => 1)
        .with({ kind: "error" }, (r) => {
            p.log.error(r.message);
            return 1;
        })
        .with({ kind: "resolved" }, (r) => executeNew(r, opts, config, gitContext))
        .exhaustive();
}

async function executeNew(
    resolved: Extract<ResolvedNewArgs, { readonly kind: "resolved" }>,
    opts: {
        readonly trust: boolean;
        readonly untrusted: boolean;
        readonly noTmux: boolean;
        readonly useLocalBranch: boolean;
        readonly noFocus: boolean;
    },
    config: import("../lib/config").AgentboxConfig,
    gitContext: GitContext
): Promise<number> {
    const { agentName, baseBranch, tmuxMode } = resolved;
    const paths = getAgentPaths(gitContext, agentName);
    const inTargetSession =
        isInsideTmux() && (await getCurrentSessionName()) === sanitizeSessionName(agentName);

    if (inTargetSession) {
        return executeInsideSession(agentName, gitContext, config, tmuxMode);
    }

    // Phase 1 operations (ensureBareRepo, syncBareRepo, createWorktree) assume repo context.
    // Running from a bare-worktree would compute wrong paths.
    if (gitContext.kind !== "repo") {
        p.log.error("Cannot create a new agent from inside a worktree. Run from the project root.");
        p.outro("Aborted");
        return 1;
    }

    const repoPath = gitContext.root;

    p.intro(`agent \u00b7 new \u00b7 ${agentName}`);

    const syncSpinner = p.spinner();
    syncSpinner.start("Syncing bare repo...");
    const bareRepoResult = await ensureBareRepo(repoPath);
    if (!bareRepoResult.ok) {
        syncSpinner.stop("Failed");
        p.log.error(bareRepoResult.error);
        p.outro("Aborted");
        return 1;
    }
    const bareRepo = bareRepoResult.value;
    const syncResult = await syncBareRepo(bareRepo, repoPath);
    if (!syncResult.ok) {
        syncSpinner.stop("Failed");
        p.log.error(syncResult.error);
        p.outro("Aborted");
        return 1;
    }
    syncSpinner.stop("Bare repo synced");
    for (const w of syncResult.value.warnings) {
        if (w.startsWith("origin:") || w.startsWith("local:")) {
            p.log.warn(w);
        } else {
            p.log.info(w);
        }
    }

    if (fs.existsSync(paths.worktree)) {
        p.log.step("Reusing existing worktree");
    } else {
        const resolvedBase = await resolveBaseBranch(baseBranch, bareRepo, agentName);
        if (resolvedBase) {
            p.log.info(`Creating new branch from ${resolvedBase}`);
        }

        p.log.step(`Creating worktree for ${agentName}...`);
        const resolveOptions = opts.useLocalBranch ? { useLocalBranch: true } : undefined;
        const worktreeResult = await createWorktree(
            bareRepo,
            paths.worktree,
            agentName,
            repoPath,
            resolvedBase ?? baseBranch,
            resolveOptions
        );
        if (!worktreeResult.ok) {
            if (worktreeResult.error === CANCELLED) {
                p.outro("Aborted");
            } else {
                p.log.error(worktreeResult.error);
                p.outro("Aborted");
            }
            return 1;
        }
    }

    const prepResult = await ensureHostPreparation(
        config,
        repoPath,
        paths.worktree,
        opts.trust,
        opts.untrusted
    );
    if (!prepResult.ok) {
        p.outro("Aborted");
        return 1;
    }
    const resolvedTrusted = prepResult.value;

    if (opts.noTmux) {
        p.log.success(`Agent ${agentName} ready`);
        p.log.info(paths.worktree);
        p.log.info(`To start: agentbox attach ${agentName}`);
        p.outro("Ready");
        return 0;
    }

    if (!(await isTmuxInstalled())) {
        p.log.error("tmux not found. Install tmux or use --no-tmux.");
        p.outro("Aborted");
        return 1;
    }

    const isNew = !(await sessionExists(sanitizeSessionName(agentName)));
    const sessionResult = await ensureSession(agentName, paths.worktree);
    if (!sessionResult.ok) {
        p.log.error(sessionResult.error);
        p.outro("Aborted");
        return 1;
    }
    const session = sessionResult.value;
    const selfCommand = [process.argv[0], path.resolve(process.argv[1])];
    const reinvokeArgs = buildReinvokeArgs(
        selfCommand,
        agentName,
        baseBranch,
        tmuxMode,
        opts.useLocalBranch,
        resolvedTrusted
    );

    if (isNew) {
        const keysResult = await sendKeys(`${session}:`, reinvokeArgs.join(" "));
        if (!keysResult.ok) {
            p.log.error(keysResult.error);
            p.outro("Aborted");
            return 1;
        }
    } else {
        const windowResult = await createWindow(session, "setup");
        if (!windowResult.ok) {
            p.log.error(windowResult.error);
            p.outro("Aborted");
            return 1;
        }
        const keysResult = await sendKeys(windowResult.value, reinvokeArgs.join(" "));
        if (!keysResult.ok) {
            p.log.error(keysResult.error);
            p.outro("Aborted");
            return 1;
        }
    }
    if (opts.noFocus) {
        p.log.success("Session ready (--no-focus)");
        return 0;
    }
    p.log.step("Attaching to session \u2014 setup continues inside");
    const attachResult = await switchOrAttach(session);
    if (!attachResult.ok) {
        p.log.error(attachResult.error);
        p.outro("Aborted");
        return 1;
    }
    return 0;
}

async function executeInsideSession(
    agentName: AgentName,
    gitContext: GitContext,
    config: import("../lib/config").AgentboxConfig,
    tmuxMode: import("../lib/config").TmuxMode | undefined
): Promise<number> {
    p.intro(`agent \u00b7 new \u00b7 ${agentName}`);
    await logBackendFallback();
    const ctx = await createAgentContext(agentName, gitContext, config);

    const result = await startAndSetupAgent(ctx, tmuxMode);
    if (!result.ok) return handleLifecycleError(result.error);
    // No switchOrAttach — we're already inside the target session

    const ports = await getAgentPorts(ctx);
    for (const port of ports) {
        p.log.info(`${port.name}: localhost:${port.nodePort}`);
    }
    return 0;
}

/**
 * Resolve the base branch: if not explicitly provided, check if the branch already exists
 * in the bare repo. If not, default to main.
 */
async function resolveBaseBranch(
    baseBranch: string | undefined,
    bareRepo: BareRepoPath,
    agentName: AgentName
): Promise<string | undefined> {
    if (baseBranch) return baseBranch;
    const hasBranch = await branchExists(bareRepo, agentName);
    if (!hasBranch) {
        return await getMainBranch(bareRepo);
    }
    return undefined;
}
