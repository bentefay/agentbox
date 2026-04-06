import * as p from "@clack/prompts";

import type { AgentboxConfig } from "../lib/config";
import type { GitContext } from "../lib/loader";
import { loadConfig, detectGitContext } from "../lib/loader";

export async function resolveConfig(): Promise<{
    readonly config: AgentboxConfig;
    readonly gitContext: GitContext;
} | null> {
    const ctxResult = await detectGitContext();
    if (!ctxResult.ok) {
        p.log.error(ctxResult.error);
        return null;
    }
    const gitContext = ctxResult.value;
    const result = await loadConfig(gitContext.root);
    if (!result.ok) {
        p.log.error(result.error);
        return null;
    }
    return { config: result.value, gitContext };
}
