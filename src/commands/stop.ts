import * as p from "@clack/prompts";
import { match } from "ts-pattern";

import { detectAgentPresence, stopAgent } from "../agent";
import { getAgentPaths } from "../git";
import { gracefullyKillSession, sanitizeSessionName } from "../tmux";
import { withResolvedAgent } from "./resolve-agent";
import { determineStopAction } from "./resolve-stop";

export async function cmdStop(name?: string): Promise<number> {
    return withResolvedAgent(name, "Select agent to stop", async (agentName, repoPath) => {
        const paths = getAgentPaths(repoPath, agentName);
        const presence = await detectAgentPresence(agentName, paths);
        const action = determineStopAction({ agentName, ...presence });

        if (action.kind === "not-found") {
            p.log.error(`Agent ${agentName} does not exist`);
            return 1;
        }

        p.intro(`agent · stop · ${agentName}`);

        // Perform the kind-specific action; bail on failure
        const failed = await match(action)
            .with({ kind: "stop-container" }, async () => {
                const stopSpinner = p.spinner();
                stopSpinner.start("Stopping agent container...");
                const stopResult = await stopAgent(agentName);
                if (!stopResult.ok) {
                    stopSpinner.stop("Failed");
                    p.log.error(stopResult.error);
                    p.log.info("Run `agentbox check-vm` to diagnose VM issues");
                    p.outro("Aborted");
                    return true;
                }
                stopSpinner.stop("Agent container stopped");
                return false;
            })
            .with({ kind: "already-stopped" }, () => {
                p.log.warn("Container already stopped");
                return false;
            })
            .with({ kind: "no-container" }, () => {
                p.log.warn("No container found");
                return false;
            })
            .exhaustive();

        if (failed) {
            return 1;
        }

        // Shared cleanup
        if (action.hasSession) {
            await gracefullyKillSession(sanitizeSessionName(agentName));
            p.log.step("Tmux session killed");
        }
        if (action.hasWorktree) {
            p.log.info(`Worktree preserved (use agentbox rm ${agentName} to remove)`);
        }

        p.log.success(`Stopped agent ${agentName}`);
        p.outro("Done");
        return 0;
    });
}
