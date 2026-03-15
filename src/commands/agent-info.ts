import * as fs from "fs";

import { match } from "ts-pattern";

import { getAgentState, getAgentPorts } from "../agent";
import type { AgentState } from "../agent";
import type { AgentName, RepoPath } from "../git";
import { getAgentsDirPaths, parseAgentName, listWorktrees } from "../git";
import type { AllocatedPort } from "../k8s";
import { isTmuxInstalled, sessionExists, sanitizeSessionName } from "../tmux";

const NO_PORTS: readonly AllocatedPort[] = [];

export interface AgentInfo {
    readonly name: string;
    readonly agentName: AgentName | null;
    readonly branch: string;
    readonly path: string;
    readonly containerState: AgentState;
    readonly hasTmuxSession: boolean;
    readonly ports: readonly AllocatedPort[];
}

/**
 * Pure function that builds a human-readable status hint for an agent.
 * Used in interactive pickers (select / multiselect) to annotate each agent option.
 */
export function agentStatusHint(agent: AgentInfo): string {
    const stateLabel = match(agent.containerState)
        .with({ kind: "running" }, () => "running" as const)
        .with({ kind: "stopped" }, () => "stopped" as const)
        .with({ kind: "not-found" }, () => null)
        .exhaustive();
    const parts = [stateLabel, agent.hasTmuxSession ? "tmux" : null].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : agent.branch;
}

export async function listAgentsWithState(repoPath: RepoPath): Promise<readonly AgentInfo[]> {
    const paths = getAgentsDirPaths(repoPath);

    if (!fs.existsSync(paths.bareRepo)) return [];

    const worktrees = await listWorktrees(paths.bareRepo);
    if (worktrees.length === 0) return [];

    const tmuxAvailable = await isTmuxInstalled();

    return Promise.all(
        worktrees.map(async (wt): Promise<AgentInfo> => {
            const parsed = parseAgentName(wt.name);
            const agentName = parsed.ok ? parsed.value : null;

            const containerState: AgentState =
                agentName != null ? await getAgentState(agentName) : { kind: "not-found" };

            const [hasTmuxSession, ports] = await Promise.all([
                tmuxAvailable && agentName != null
                    ? sessionExists(sanitizeSessionName(agentName))
                    : Promise.resolve(false),
                containerState.kind === "running" && agentName != null
                    ? getAgentPorts(agentName)
                    : Promise.resolve(NO_PORTS),
            ]);

            return {
                name: wt.name,
                agentName,
                branch: wt.branch,
                path: wt.path,
                containerState,
                hasTmuxSession,
                ports,
            };
        })
    );
}
