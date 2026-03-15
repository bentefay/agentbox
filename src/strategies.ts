import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import type { DependencyStrategy, HostPrepareContext, VolumeMount } from "./config";
import { exec, tryExec, shellEscape } from "./exec";
import type { Result } from "./result";
import { Ok, Err } from "./result";

function fileExists(repoRoot: string, filename: string): boolean {
    return fs.existsSync(path.join(repoRoot, filename));
}

// ============================================================================
// Nix
// ============================================================================

export interface NixStrategyOptions {
    readonly nixPath?: string;
}

export function nixStrategy(opts?: NixStrategyOptions): DependencyStrategy {
    const nixPath = opts?.nixPath ?? "/nix";

    return {
        name: "nix",

        detect: async (repoRoot) => fileExists(repoRoot, "flake.nix"),

        // nix daemon socket doesn't work through Kata's virtio-fs, so
        // pre-compute the dev env on the host and source it in the container.
        // Only runs in trusted mode — evaluating a flake executes arbitrary code.
        hostPrepare: async (ctx, _repoRoot, worktreePath) => {
            if (!ctx.trusted) {
                ctx.logWarning(
                    "Skipping nix build (untrusted). If derivations are already cached, the dev environment will be set up inside the container."
                );
                return Ok(undefined);
            }
            const outputPath = path.join(worktreePath, ".nix-dev-env.sh");
            const result = await tryExec(
                `nix print-dev-env ${shellEscape(worktreePath)} > ${shellEscape(outputPath)}`,
                "nix print-dev-env failed",
                { timeout: 120_000 }
            );
            if (!result.ok) return Err(result.error);
            return Ok(undefined);
        },

        // If hostPrepare was skipped (untrusted), try to capture the env from
        // already-built store paths. --store local bypasses the daemon socket,
        // --offline ensures no network/build activity.
        containerInstall: async () => [
            "[ -f /workspace/.nix-dev-env.sh ] || nix print-dev-env --store local --offline /workspace > /workspace/.nix-dev-env.sh",
        ],

        shellInit: () => ["source /workspace/.nix-dev-env.sh"],

        volumes: () =>
            fs.existsSync(nixPath)
                ? [{ hostPath: nixPath, containerPath: "/nix", readOnly: true }]
                : [],
    };
}

// ============================================================================
// direnv
// ============================================================================

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

async function resolveClaudeCliPath(): Promise<string | null> {
    if (cachedClaudeCliPath !== undefined) return cachedClaudeCliPath;
    try {
        const result = await exec("which claude", {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        });
        cachedClaudeCliPath =
            result.code === 0 && result.stdout.trim() ? result.stdout.trim() : null;
    } catch {
        cachedClaudeCliPath = null;
    }
    return cachedClaudeCliPath;
}

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

            // CLI binary
            if (cachedClaudeCliPath != null) {
                vols.push({
                    hostPath: cachedClaudeCliPath,
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

export interface BunStrategyOptions {
    readonly cachePath?: string;
}

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

export interface YarnStrategyOptions {
    readonly cachePath?: string;
}

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

export interface PnpmStrategyOptions {
    readonly storePath?: string;
}

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

export interface NpmStrategyOptions {
    readonly cachePath?: string;
}

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
