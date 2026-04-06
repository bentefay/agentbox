import type { AgentName, GitContext } from "../lib/git";
import type { Result } from "../lib/result";
import type { AgentInfo } from "./agent-info";
export type ResolveError = {
    readonly kind: "no-agents";
} | {
    readonly kind: "cancelled";
} | {
    readonly kind: "error";
    readonly message: string;
};
export type ResolveResult = Result<AgentName, ResolveError>;
export type ResolveNamesResult = Result<readonly AgentName[], ResolveError>;
export declare function parseAgentNames(rawNames: readonly string[]): ResolveNamesResult;
export type PickAgentError = {
    readonly kind: "no-agents";
} | {
    readonly kind: "cancelled";
};
export type PickAgentResult = Result<AgentName, PickAgentError>;
/** Filter agents to only those with a valid parsed AgentName. */
export declare function agentsWithValidNames(agents: readonly AgentInfo[]): readonly (AgentInfo & {
    readonly agentName: AgentName;
})[];
export declare function pickAgent(gitContext: GitContext, message: string): Promise<PickAgentResult>;
/**
 * Resolve an agent name from a raw CLI argument or interactive picker.
 * Returns a discriminated union so callers can exhaustively handle each case.
 */
export declare function resolveAgentName(rawName: string | undefined, gitContext: GitContext, promptMessage: string): Promise<ResolveResult>;
/**
 * Resolve multiple agent names from CLI arguments or interactive multi-select.
 * Returns a discriminated union so callers can exhaustively handle each case.
 */
export declare function resolveAgentNames(rawNames: readonly string[], gitContext: GitContext): Promise<ResolveNamesResult>;
/**
 * Handle a ResolveError by displaying the appropriate message and returning an exit code.
 * Shared by `withResolvedAgent` and `withResolvedAgentNames` to avoid duplicating the match block.
 */
export declare function handleResolveError(error: ResolveError, noAgentsMessage: string): number;
/**
 * Resolve the git context, displaying an error and returning exit code 1 on failure.
 * Convenience wrapper for commands that only need the git context (e.g. list, cache).
 */
export declare function withGitContext(onOk: (gitContext: GitContext) => Promise<number>): Promise<number>;
/**
 * Higher-order helper that resolves a single agent name (from CLI arg or interactive picker),
 * handles the common error/cancel/no-agents cases, and delegates the `ok` branch to the caller.
 * Internally resolves the git context so callers don't need to.
 */
export declare function withResolvedAgent(rawName: string | undefined, promptMessage: string, onOk: (name: AgentName, gitContext: GitContext) => Promise<number>, noAgentsMessage?: string): Promise<number>;
/**
 * Higher-order helper that resolves multiple agent names (from CLI args or interactive multi-select),
 * handles the common error/cancel/no-agents cases, and delegates the `ok` branch to the caller.
 * Internally resolves the git context so callers don't need to.
 */
export declare function withResolvedAgentNames(rawNames: readonly string[], onOk: (names: readonly AgentName[], gitContext: GitContext) => Promise<number>, noAgentsMessage?: string): Promise<number>;
