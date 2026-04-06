import * as path from "path";

import { match } from "ts-pattern";

import type { GitContext } from "../loader";
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
export function getAgentsDirPaths(ctx: GitContext): AgentsDirPaths {
    return match(ctx)
        .with({ kind: "repo" }, ({ root }) => {
            const repoName = path.basename(root);
            const agentsDir = path.resolve(root, "..", `${repoName}-agents`);
            return {
                agentsDir,
                // This is the ONE allowed cast — the branded type smart constructor pattern
                bareRepo: path.join(agentsDir, BARE_REPO_DIR) as BareRepoPath
            };
        })
        .with({ kind: "bare-worktree" }, ({ agentsDir, bareRepo }) => ({
            agentsDir,
            bareRepo
        }))
        .exhaustive();
}

export function getAgentPaths(ctx: GitContext, agentName: AgentName): AgentPaths {
    const { agentsDir, bareRepo } = getAgentsDirPaths(ctx);
    return {
        agentsDir,
        bareRepo,
        worktree: path.join(agentsDir, agentName)
    };
}
