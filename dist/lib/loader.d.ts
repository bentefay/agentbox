import type { AgentboxConfig } from "./config";
import type { Result } from "./result";
export type RepoPath = string & {
    readonly __brand: "RepoPath";
};
export declare function loadConfig(repoPath: RepoPath): Promise<Result<AgentboxConfig, string>>;
export declare function getRepoPath(): Promise<Result<RepoPath, string>>;
