import type { ContainerBackend } from "./backend";
import type { AgentState } from "./backend";
import type { AgentboxConfig, TmuxMode } from "./config";
import type { AllocatedPort } from "./k8s";
export type { AgentState } from "./backend";
import type { BackendLogsOptions } from "./backend";
import type { AgentName, AgentPaths, RepoPath } from "./git";
import type { Result } from "./result";
import type { SessionName } from "./tmux";
export interface AgentContext {
    readonly name: AgentName;
    readonly paths: AgentPaths;
    readonly config: AgentboxConfig;
    readonly backend: ContainerBackend;
}
export declare const isK3sAvailable: () => Promise<boolean>;
export declare function selectBackendKind(k3sAvailable: boolean): "k3s" | "docker";
export declare function logBackendFallback(): Promise<void>;
export declare function createAgentContext(name: AgentName, repoPath: RepoPath, config: AgentboxConfig): Promise<AgentContext>;
export declare function getAgentState(nameOrCtx: AgentName | AgentContext): Promise<AgentState>;
export declare function isAgentRunning(nameOrCtx: AgentName | AgentContext): Promise<boolean>;
export declare function getAgentPorts(nameOrCtx: AgentName | AgentContext): Promise<readonly AllocatedPort[]>;
export declare function getAgentLogs(agentName: AgentName, options?: BackendLogsOptions): Promise<Result<string, string>>;
export declare function stopAgent(agentName: AgentName): Promise<Result<void, string>>;
export interface ExecInAgentOptions {
    readonly interactive?: boolean;
}
export declare function execInAgent(agentName: AgentName, command: string | undefined, options?: ExecInAgentOptions): Promise<Result<number, string>>;
export declare function ensureAgentPod(ctx: AgentContext): Promise<Result<void, string>>;
export declare function setupAgentTmux(ctx: AgentContext, mode: TmuxMode | undefined): Promise<Result<SessionName, string>>;
/** Compose ensureAgentPod + setupAgentTmux into a single step. */
export declare function startAndSetupAgent(ctx: AgentContext, mode: TmuxMode | undefined): Promise<Result<SessionName, string>>;
/** Log a lifecycle error with VM diagnostic hint. Returns exit code 1. */
export declare function handleLifecycleError(error: string): number;
export interface RemoveAgentOptions {
    readonly force: boolean;
}
export interface AgentPresence {
    readonly hasSession: boolean;
    readonly agentState: AgentState;
    readonly hasWorktree: boolean;
}
/** Detect what resources exist for a given agent. Pure discovery, no UI. */
export declare function detectAgentPresence(agentName: AgentName, paths: AgentPaths): Promise<AgentPresence>;
/**
 * Remove an agent's resources: stop/remove container, remove worktree, kill tmux session.
 *
 * Pure lifecycle orchestration — no UI (no spinners, no clack output).
 * When `force` is true, continues through failures collecting warnings.
 * When `force` is false, aborts on first failure.
 *
 * Tmux session is killed last so `rm` can be run from inside the session.
 */
export declare function removeAgent(agentName: AgentName, paths: AgentPaths, presence: AgentPresence, options: RemoveAgentOptions): Promise<Result<{
    readonly warnings: readonly string[];
}, string>>;
