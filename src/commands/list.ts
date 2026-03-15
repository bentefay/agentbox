import * as p from "@clack/prompts";
import chalk from "chalk";
import { match } from "ts-pattern";

import { listAgentsWithState } from "./agent-info";
import { withRepoPath } from "./resolve-agent";

export async function cmdList(): Promise<number> {
    return withRepoPath(async (repoPath) => {
        const agents = await listAgentsWithState(repoPath);

        if (agents.length === 0) {
            p.log.info("No agents found");
            return 0;
        }

        const nameW = Math.max(6, ...agents.map((a) => a.name.length)) + 2;
        const branchW = Math.max(8, ...agents.map((a) => a.branch.length)) + 2;
        const statusW = 14;
        const tmuxW = 6;

        console.log(
            chalk.bold("NAME".padEnd(nameW)) +
                chalk.bold("BRANCH".padEnd(branchW)) +
                chalk.bold("STATUS".padEnd(statusW)) +
                chalk.bold("TMUX".padEnd(tmuxW)) +
                chalk.bold("PATH")
        );

        for (const a of agents) {
            const statusStyled = match(a.containerState)
                .with({ kind: "running" }, () => chalk.green("running".padEnd(statusW)))
                .with({ kind: "stopped" }, () => chalk.yellow("stopped".padEnd(statusW)))
                .with({ kind: "not-found" }, () => chalk.dim("no container".padEnd(statusW)))
                .exhaustive();
            const tmuxStyled = a.hasTmuxSession
                ? chalk.green("\u2713".padEnd(tmuxW))
                : " ".padEnd(tmuxW);
            console.log(
                chalk.cyan(a.name.padEnd(nameW)) +
                    a.branch.padEnd(branchW) +
                    statusStyled +
                    tmuxStyled +
                    chalk.dim(a.path)
            );
            for (const port of a.ports) {
                console.log(chalk.dim(`  ${port.name}: localhost:${port.nodePort}`));
            }
        }
        return 0;
    });
}
