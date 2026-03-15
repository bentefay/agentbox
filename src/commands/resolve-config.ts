import * as p from "@clack/prompts";

import type { AgentboxConfig } from "../config";
import type { RepoPath } from "../loader";
import { loadConfig, getRepoPath } from "../loader";

export async function resolveConfig(): Promise<{
    readonly config: AgentboxConfig;
    readonly repoPath: RepoPath;
} | null> {
    const repoPathResult = await getRepoPath();
    if (!repoPathResult.ok) {
        p.log.error(repoPathResult.error);
        return null;
    }
    const repoPath = repoPathResult.value;
    const result = await loadConfig(repoPath);
    if (!result.ok) {
        p.log.error(result.error);
        return null;
    }
    return { config: result.value, repoPath };
}
