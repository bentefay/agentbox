import * as p from "@clack/prompts";

import { detectAgentPresence, removeAgent } from "../lib/agent";
import { getAgentPaths } from "../lib/git";
import { withResolvedAgentNames } from "./resolve-agent";

export async function cmdRm(names: readonly string[], force: boolean): Promise<number> {
    return withResolvedAgentNames(names, async (agentNames, gitContext) => {
        for (const agentName of agentNames) {
            const paths = getAgentPaths(gitContext, agentName);
            const presence = await detectAgentPresence(agentName, paths);

            if (
                !presence.hasSession &&
                presence.agentState.kind === "not-found" &&
                !presence.hasWorktree
            ) {
                p.log.error(`Agent ${agentName} not found`);
                return 1;
            }

            p.intro(`agent · rm · ${agentName}`);

            if (!force) {
                p.log.warn("This will delete:");
                if (presence.hasSession) p.log.info(`  tmux session ${agentName}`);
                if (presence.agentState.kind !== "not-found")
                    p.log.info(`  agent container (${presence.agentState.kind})`);
                if (presence.hasWorktree) p.log.info(`  worktree at ${paths.worktree}`);

                const confirmed = await p.confirm({
                    message: `Remove agent ${agentName}?`,
                    initialValue: true,
                });
                if (p.isCancel(confirmed) || !confirmed) {
                    p.outro("Aborted");
                    return 0;
                }
            }

            const spinner = p.spinner();
            spinner.start("Removing agent...");
            const result = await removeAgent(agentName, paths, presence, { force });

            if (!result.ok) {
                spinner.stop("Failed");
                p.log.error(result.error);
                p.log.info(`Try \`agentbox rm --force ${agentName}\` to force removal`);
                p.outro("Aborted");
                return 1;
            }

            spinner.stop("Agent removed");

            for (const warning of result.value.warnings) {
                p.log.warn(warning);
            }

            p.log.success(`Removed agent ${agentName}`);
            p.outro("Done");
        }
        return 0;
    });
}
