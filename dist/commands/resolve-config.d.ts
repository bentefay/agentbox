import type { AgentboxConfig } from "../lib/config";
import type { RepoPath } from "../lib/loader";
export declare function resolveConfig(): Promise<{
    readonly config: AgentboxConfig;
    readonly repoPath: RepoPath;
} | null>;
