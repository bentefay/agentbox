import type { RepoPath } from "../loader";
import type { AgentName } from "./agent-name";
export type BareRepoPath = string & {
    readonly __brand: "BareRepoPath";
};
export interface AgentPaths {
    readonly agentsDir: string;
    readonly bareRepo: BareRepoPath;
    readonly worktree: string;
}
export interface AgentsDirPaths {
    readonly agentsDir: string;
    readonly bareRepo: BareRepoPath;
}
/** Get the agents directory and bare repo paths (for listing/discovery, no specific agent). */
export declare function getAgentsDirPaths(repoPath: RepoPath): AgentsDirPaths;
export declare function getAgentPaths(repoPath: RepoPath, agentName: AgentName): AgentPaths;
