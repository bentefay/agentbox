import * as fs from "fs";

import * as p from "@clack/prompts";
import { match } from "ts-pattern";

import { getAgentPaths, checkoutAgentBranch } from "../lib/git";
import type { CheckoutError } from "../lib/git";
import { withResolvedAgent } from "./resolve-agent";

export async function cmdCheckout(name?: string): Promise<number> {
    return withResolvedAgent(name, "Select agent to checkout", async (agentName, repoPath) => {
        const paths = getAgentPaths(repoPath, agentName);

        if (!fs.existsSync(paths.bareRepo)) {
            p.log.error("No agents directory found");
            return 1;
        }

        p.intro(`agent · checkout · ${agentName}`);

        const fetchSpinner = p.spinner();
        fetchSpinner.start("Fetching agent branch...");
        const result = await checkoutAgentBranch(paths.bareRepo, repoPath, agentName);

        if (!result.ok) {
            fetchSpinner.stop("Failed");
            return showCheckoutError(result.error);
        }

        fetchSpinner.stop("Branch checked out");
        p.log.success(`Checked out branch ${agentName}`);
        p.log.info(`Push with: git push -u origin ${agentName}`);
        p.outro("Done");
        return 0;
    });
}

function showCheckoutError(error: CheckoutError): number {
    match(error)
        .with({ kind: "not-found" }, ({ name }) => {
            p.log.error(`Agent '${name}' not found`);
        })
        .with({ kind: "fetch-failed" }, ({ detail }) => {
            p.log.error(`Failed to fetch branch: ${detail}`);
        })
        .with({ kind: "checkout-failed" }, ({ detail }) => {
            p.log.error(`Failed to checkout branch: ${detail}`);
            p.log.info("You may have uncommitted changes. Commit or stash them first.");
        })
        .exhaustive();

    p.outro("Aborted");
    return 1;
}
