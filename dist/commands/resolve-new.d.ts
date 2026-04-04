import type { AgentboxConfig, TmuxMode } from "../lib/config";
import type { AgentName, BareRepoPath, RepoPath } from "../lib/git";
import type { Result } from "../lib/result";
/**
 * Resolve a tmux mode name to a TmuxMode from config.
 * Returns undefined when no mode name is given, or an error for unknown modes.
 */
export declare function resolveMode(modeName: string | undefined, config: AgentboxConfig): Result<TmuxMode | undefined, string>;
export type ResolvedNewArgs = {
    readonly kind: "resolved";
    readonly agentName: AgentName;
    readonly baseBranch: string | undefined;
    readonly tmuxMode: TmuxMode | undefined;
} | {
    readonly kind: "cancelled";
} | {
    readonly kind: "error";
    readonly message: string;
};
/**
 * Handles all interactive prompts and validation for the `new` command:
 * git fetch, branch selection, base branch selection, mode selection.
 * Returns a discriminated union so the caller can match exhaustively.
 */
export declare function resolveNewArgs(opts: {
    readonly branch?: string;
    readonly base?: string;
    readonly mode?: string;
    readonly noTmux: boolean;
}, config: AgentboxConfig, repoPath: RepoPath, bareRepoPath: BareRepoPath | null): Promise<ResolvedNewArgs>;
/**
 * Pure function to build the reinvoke command arguments for tmux re-entry.
 * Uses both the runtime (argv[0]) and script path (argv[1]) so the command
 * works regardless of how the CLI was invoked (e.g. `bun src/cli.ts` or
 * the installed `agentbox` bin).
 */
export declare function buildReinvokeArgs(selfCommand: readonly string[], agentName: AgentName, baseBranch: string | undefined, tmuxMode: TmuxMode | undefined, useLocalBranch: boolean, trusted: boolean): readonly string[];
/**
 * Resolve the `--trust` / `--untrusted` flags into a `trusted` boolean.
 * When neither flag is set, prompts the user; declining yields `false` (untrusted mode).
 */
export declare function resolveTrust(trust: boolean, untrusted: boolean): Promise<boolean>;
/**
 * Shared trust confirmation and host-side dependency preparation.
 * Resolves trust from flags, detects strategies if none are configured,
 * and runs host-side preparation for each strategy.
 *
 * Returns Ok with the resolved `trusted` boolean on success.
 */
export declare function ensureHostPreparation(config: AgentboxConfig, repoPath: RepoPath, worktreePath: string, trust: boolean, untrusted: boolean): Promise<Result<boolean, string>>;
