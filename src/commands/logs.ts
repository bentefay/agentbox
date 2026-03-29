import * as p from "@clack/prompts";

import { getAgentLogs, getAgentState } from "../lib/agent";
import { withResolvedAgent } from "./resolve-agent";

export async function cmdLogs(name?: string, follow?: boolean, init?: boolean): Promise<number> {
    return withResolvedAgent(name, "Select agent to view logs", async (agentName) => {
        const state = await getAgentState(agentName);

        if (state.kind === "not-found") {
            p.log.error(`No container found for agent ${agentName}`);
            return 1;
        }

        const result = await getAgentLogs(agentName, { follow, init });

        if (!result.ok) {
            p.log.error(result.error);
            return 1;
        }

        // In follow mode, output was streamed directly to stdout
        if (!follow && result.value.length > 0) {
            process.stdout.write(result.value);
        }

        return 0;
    });
}
