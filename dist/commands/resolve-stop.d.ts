import type { AgentState } from "../lib/agent";
import type { AgentName } from "../lib/git";
/**
 * Pre-fetched state gathered by the orchestrator before calling the pure decision function.
 * Separates I/O from logic so `determineStopAction` is fully testable.
 */
export interface StopState {
    readonly agentName: AgentName;
    readonly agentState: AgentState;
    readonly hasSession: boolean;
    readonly hasWorktree: boolean;
}
export type ResolvedStopAction = {
    readonly kind: "not-found";
} | {
    readonly kind: "stop-container";
    readonly agentName: AgentName;
    readonly hasSession: boolean;
    readonly hasWorktree: boolean;
} | {
    readonly kind: "already-stopped";
    readonly agentName: AgentName;
    readonly hasSession: boolean;
    readonly hasWorktree: boolean;
} | {
    readonly kind: "no-container";
    readonly agentName: AgentName;
    readonly hasSession: boolean;
    readonly hasWorktree: boolean;
};
/**
 * Pure decision function: given fully-resolved state, determine the stop action.
 * No I/O — all side-effects are handled by the orchestrator that builds StopState.
 */
export declare function determineStopAction(state: StopState): ResolvedStopAction;
