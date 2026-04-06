import type { AgentboxConfig } from "../lib/config";
import type { GitContext } from "../lib/loader";
export declare function resolveConfig(): Promise<{
    readonly config: AgentboxConfig;
    readonly gitContext: GitContext;
} | null>;
