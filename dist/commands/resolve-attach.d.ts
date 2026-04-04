import type { AgentboxConfig, TmuxMode } from "../lib/config";
import type { AgentName, RepoPath } from "../lib/git";
import type { Result } from "../lib/result";
export type ResolvedAttachArgs = {
    readonly kind: "reattach";
    readonly agentName: AgentName;
    readonly mode: TmuxMode | undefined;
    readonly config: AgentboxConfig | undefined;
    readonly repoPath: RepoPath;
} | {
    readonly kind: "restore";
    readonly agentName: AgentName;
    readonly config: AgentboxConfig;
    readonly repoPath: RepoPath;
    readonly mode: TmuxMode | undefined;
    readonly trust: boolean;
    readonly untrusted: boolean;
} | {
    readonly kind: "cancelled";
} | {
    readonly kind: "no-agents";
    readonly message: string;
} | {
    readonly kind: "error";
    readonly message: string;
};
/**
 * Pre-fetched state gathered by the orchestrator before calling the pure decision function.
 * Separates I/O from logic so `determineAttachAction` is fully testable.
 */
export interface AttachState {
    readonly tmuxAvailable: boolean;
    readonly hasSession: boolean;
    readonly worktreeExists: boolean;
    readonly configResult: AgentboxConfig | null;
    readonly modeResult: Result<TmuxMode | undefined, string>;
    readonly agentName: AgentName;
    readonly repoPath: RepoPath;
    readonly trust: boolean;
    readonly untrusted: boolean;
    readonly modeName: string | undefined;
}
/**
 * Pure decision function: given fully-resolved state, determine the attach action.
 * No I/O — all side-effects are handled by the orchestrator that builds AttachState.
 */
export declare function determineAttachAction(state: AttachState): ResolvedAttachArgs;
/**
 * Resolve all arguments and state needed for the `attach` command.
 * Gathers I/O into AttachState, then delegates to the pure `determineAttachAction`.
 */
export declare function resolveAttachArgs(name: string | undefined, modeName: string | undefined, trust: boolean, untrusted: boolean): Promise<ResolvedAttachArgs>;
