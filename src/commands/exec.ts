import * as p from "@clack/prompts";

import { execInAgent, getAgentState } from "../agent";
import { withResolvedAgent } from "./resolve-agent";

export async function cmdExec(name?: string, command?: readonly string[]): Promise<number> {
    return withResolvedAgent(name, "Select agent to exec into", async (agentName) => {
        const state = await getAgentState(agentName);

        if (state.kind !== "running") {
            p.log.error(`Agent ${agentName} is not running`);
            return 1;
        }

        const hasCommand = command != null && command.length > 0;
        const fullCommand = hasCommand ? command.join(" ") : undefined;
        const interactive = !hasCommand;

        const result = await execInAgent(agentName, fullCommand, { interactive });

        if (!result.ok) {
            p.log.error(result.error);
            return 1;
        }

        return result.value;
    });
}
