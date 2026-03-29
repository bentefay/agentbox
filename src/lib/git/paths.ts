import * as path from "path";

import type { RepoPath } from "../loader";
import type { AgentName } from "./agent-name";

export type BareRepoPath = string & { readonly __brand: "BareRepoPath" };

const BARE_REPO_DIR = ".bare";

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
export function getAgentsDirPaths(repoPath: RepoPath): AgentsDirPaths {
    const repoName = path.basename(repoPath);
    const agentsDir = path.resolve(repoPath, "..", `${repoName}-agents`);
    return {
        agentsDir,
        // This is the ONE allowed cast — the branded type smart constructor pattern
        bareRepo: path.join(agentsDir, BARE_REPO_DIR) as BareRepoPath,
    };
}

export function getAgentPaths(repoPath: RepoPath, agentName: AgentName): AgentPaths {
    const { agentsDir, bareRepo } = getAgentsDirPaths(repoPath);
    return {
        agentsDir,
        bareRepo,
        worktree: path.join(agentsDir, agentName),
    };
}
