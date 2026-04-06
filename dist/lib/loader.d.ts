import type { AgentboxConfig } from "./config";
import type { BareRepoPath } from "./git/paths";
import type { Result } from "./result";
export type RepoPath = string & {
    readonly __brand: "RepoPath";
};
export type GitContext = {
    readonly kind: "repo";
    readonly root: RepoPath;
} | {
    readonly kind: "bare-worktree";
    readonly root: RepoPath;
    readonly bareRepo: BareRepoPath;
    readonly agentsDir: string;
};
export declare function loadConfig(repoPath: RepoPath): Promise<Result<AgentboxConfig, string>>;
export declare function getRepoPath(): Promise<Result<RepoPath, string>>;
export declare function detectGitContext(): Promise<Result<GitContext, string>>;
