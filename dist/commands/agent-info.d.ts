import type { AgentState } from "../lib/agent";
import type { AgentName, RepoPath } from "../lib/git";
import type { AllocatedPort } from "../lib/k8s";
export interface AgentInfo {
    readonly name: string;
    readonly agentName: AgentName | null;
    readonly branch: string;
    readonly path: string;
    readonly containerState: AgentState;
    readonly hasTmuxSession: boolean;
    readonly ports: readonly AllocatedPort[];
}
/**
 * Pure function that builds a human-readable status hint for an agent.
 * Used in interactive pickers (select / multiselect) to annotate each agent option.
 */
export declare function agentStatusHint(agent: AgentInfo): string;
export declare function listAgentsWithState(repoPath: RepoPath): Promise<readonly AgentInfo[]>;
