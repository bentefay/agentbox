import * as childProcess from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import type { DependencyStrategy, HostPrepareContext, VolumeMount } from "./config";
import { tryExec, shellEscape } from "./exec";
import type { Result } from "./result";
import { Ok, Err } from "./result";

function fileExists(repoRoot: string, filename: string): boolean {
    return fs.existsSync(path.join(repoRoot, filename));
}

// ============================================================================
// Nix
// ============================================================================

/** Options for {@link nixStrategy}. */
export interface NixStrategyOptions {
    /** Path to the host nix store. Defaults to `/nix`. */
    readonly nixPath?: string;
}

/** Detect `flake.nix` and mount the nix store. Runs `nix print-dev-env` on the host (trusted or untrusted with `--offline`). */
export function nixStrategy(opts?: NixStrategyOptions): DependencyStrategy {
    const nixPath = opts?.nixPath ?? "/nix";

    return {
        name: "nix",

        detect: async (repoRoot) => fileExists(repoRoot, "flake.nix"),

        // nix daemon socket doesn't work through Kata's virtio-fs, so
        // pre-compute the dev env on the host and source it in the container.
        // Trusted mode: full eval. Untrusted mode: --offline only (safe — no
        // shellHook execution, no fetching; requires cached derivations).
        hostPrepare: async (ctx, _repoRoot, worktreePath) => {
            const offline = ctx.trusted ? "" : " --offline";
            const outputPath = path.join(worktreePath, ".nix-dev-env.sh");
            const result = await tryExec(
                `nix print-dev-env${offline} ${shellEscape(worktreePath)} > ${shellEscape(outputPath)}`,
                "nix print-dev-env failed",
                { timeout: 120_000 }
            );
            if (!result.ok) return Err(result.error);
            return Ok(undefined);
        },

        shellInit: () => ["[ -f /workspace/.nix-dev-env.sh ] && source /workspace/.nix-dev-env.sh"],

        volumes: () =>
            fs.existsSync(nixPath)
                ? [{ hostPath: nixPath, containerPath: "/nix", readOnly: true }]
                : [],
    };
}

// ============================================================================
// direnv
// ============================================================================

/** Detect `.envrc` and run `direnv allow` on the host when trusted. */
export function direnvStrategy(): DependencyStrategy {
    return {
        name: "direnv",

        detect: async (repoRoot) => fileExists(repoRoot, ".envrc"),

        hostPrepare: async (ctx, _repoRoot, worktreePath) => {
            if (!ctx.trusted) return Ok(undefined);
            const result = await tryExec(
                `direnv allow ${shellEscape(worktreePath)}`,
                "direnv allow failed"
            );
            if (!result.ok) return Err(result.error);
            return Ok(undefined);
        },
    };
}

// ============================================================================
// Claude
// ============================================================================

let cachedClaudeCliPath: string | null | undefined;

function resolveClaudeCliPathSync(): string | null {
    if (cachedClaudeCliPath !== undefined) return cachedClaudeCliPath;
    try {
        const out = childProcess.execFileSync("which", ["claude"], { encoding: "utf-8" }).trim();
        // Resolve symlinks so Kata HostPath mounts point to the real file
        cachedClaudeCliPath = out ? fs.realpathSync(out) : null;
    } catch {
        cachedClaudeCliPath = null;
    }
    return cachedClaudeCliPath;
}

async function resolveClaudeCliPath(): Promise<string | null> {
    if (cachedClaudeCliPath !== undefined) return cachedClaudeCliPath;
    return resolveClaudeCliPathSync();
}

/** Detect the `claude` CLI on the host and mount its binary, config, and settings into the container. */
export function claudeStrategy(): DependencyStrategy {
    const hostHome = os.homedir();

    return {
        name: "claude",

        detect: async () => {
            const cliPath = await resolveClaudeCliPath();
            return cliPath != null;
        },

        volumes: () => {
            const vols: VolumeMount[] = [
                { hostPath: path.join(hostHome, ".claude"), containerPath: "/home/agent/.claude" },
            ];

            // CLI binary — resolve eagerly if not yet cached
            const cliPath = resolveClaudeCliPathSync();
            if (cliPath != null) {
                vols.push({
                    hostPath: cliPath,
                    containerPath: "/usr/local/bin/claude",
                    readOnly: true,
                });
            }

            // Settings file
            const claudeJsonPath = path.join(hostHome, ".claude.json");
            if (fs.existsSync(claudeJsonPath)) {
                vols.push({
                    hostPath: claudeJsonPath,
                    containerPath: "/home/agent/.claude.json",
                });
            }

            return vols;
        },
    };
}

// ============================================================================
// Package managers
// ============================================================================

/** Options for {@link bunStrategy}. */
export interface BunStrategyOptions {
    /** Host path to the bun install cache. Mounted into the container when set. */
    readonly cachePath?: string;
}

/** Detect `bun.lock` / `bun.lockb` and run `bun install --frozen-lockfile` in the container. */
export function bunStrategy(opts?: BunStrategyOptions): DependencyStrategy {
    return {
        name: "bun",

        detect: async (repoRoot) =>
            fileExists(repoRoot, "bun.lock") || fileExists(repoRoot, "bun.lockb"),

        containerInstall: async () => ["bun install --frozen-lockfile"],

        ...(opts?.cachePath && {
            volumes: () => [
                { hostPath: opts.cachePath!, containerPath: "/home/agent/.bun/install/cache" },
            ],
        }),
    };
}

/** Options for {@link yarnStrategy}. */
export interface YarnStrategyOptions {
    /** Host path to the yarn cache. Mounted into the container when set. */
    readonly cachePath?: string;
}

/** Detect `yarn.lock` and run `yarn install --frozen-lockfile` in the container. */
export function yarnStrategy(opts?: YarnStrategyOptions): DependencyStrategy {
    return {
        name: "yarn",

        detect: async (repoRoot) => fileExists(repoRoot, "yarn.lock"),

        containerInstall: async () => ["yarn install --frozen-lockfile"],

        ...(opts?.cachePath && {
            volumes: () => [{ hostPath: opts.cachePath!, containerPath: "/home/agent/.yarn" }],
        }),
    };
}

/** Options for {@link pnpmStrategy}. */
export interface PnpmStrategyOptions {
    /** Host path to the pnpm content-addressable store. Mounted into the container when set. */
    readonly storePath?: string;
}

/** Detect `pnpm-lock.yaml` and run `pnpm install --frozen-lockfile` in the container. */
export function pnpmStrategy(opts?: PnpmStrategyOptions): DependencyStrategy {
    return {
        name: "pnpm",

        detect: async (repoRoot) => fileExists(repoRoot, "pnpm-lock.yaml"),

        containerInstall: async () => ["pnpm install --frozen-lockfile"],

        ...(opts?.storePath && {
            volumes: () => [
                { hostPath: opts.storePath!, containerPath: "/home/agent/.local/share/pnpm/store" },
            ],
        }),
    };
}

/** Options for {@link npmStrategy}. */
export interface NpmStrategyOptions {
    /** Host path to the npm cache. Mounted into the container when set. */
    readonly cachePath?: string;
}

/** Detect `package-lock.json` and run `npm ci` in the container. */
export function npmStrategy(opts?: NpmStrategyOptions): DependencyStrategy {
    return {
        name: "npm",

        detect: async (repoRoot) => fileExists(repoRoot, "package-lock.json"),

        containerInstall: async () => ["npm ci"],

        ...(opts?.cachePath && {
            volumes: () => [{ hostPath: opts.cachePath!, containerPath: "/home/agent/.npm" }],
        }),
    };
}

// ============================================================================
// Built-in defaults and utilities
// ============================================================================

/**
 * Default strategy list used when `dependencyStrategies` is empty.
 * Strategies are tried in order; all that match are applied.
 */
export const builtInStrategies: readonly DependencyStrategy[] = [
    nixStrategy(),
    direnvStrategy(),
    claudeStrategy(),
    bunStrategy(),
    yarnStrategy(),
    pnpmStrategy(),
    npmStrategy(),
];

export async function detectStrategies(
    repoRoot: string,
    strategies: readonly DependencyStrategy[] = builtInStrategies
): Promise<readonly DependencyStrategy[]> {
    const results = await Promise.all(
        strategies.map(async (s) => ({ strategy: s, detected: await s.detect(repoRoot) }))
    );
    return results.filter((r) => r.detected).map((r) => r.strategy);
}

export async function runHostPrepare(
    ctx: HostPrepareContext,
    strategies: readonly DependencyStrategy[],
    repoRoot: string,
    worktreePath: string
): Promise<Result<void, string>> {
    for (const strategy of strategies) {
        if (strategy.hostPrepare) {
            const result = await strategy.hostPrepare(ctx, repoRoot, worktreePath);
            if (!result.ok) return result;
        }
    }
    return Ok(undefined);
}

/** Collect all volumes declared by detected strategies. */
export function collectStrategyVolumes(
    strategies: readonly DependencyStrategy[]
): readonly VolumeMount[] {
    return strategies.flatMap((s) => s.volumes?.() ?? []);
}
