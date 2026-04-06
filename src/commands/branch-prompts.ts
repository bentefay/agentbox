import * as p from "@clack/prompts";

import { getAgentState } from "../lib/agent";
import type { AnnotatedBranch, BareRepoPath, RepoPath } from "../lib/git";
import {
    parseAgentName,
    listWorktrees,
    listLocalBranches,
    listRemoteBranches,
    mergeBranches,
    getMainBranch,
    branchHint
} from "../lib/git";

export interface BranchSelection {
    readonly branch: string;
    readonly isExisting: boolean;
}

export type PromptOption = {
    readonly value: string;
    readonly label: string;
    readonly hint?: string;
};
export const OTHER = "__other__";

/**
 * Autocomplete prompt for selecting a branch from local/remote branches and existing agents.
 * User can type a new branch name or select an existing one.
 */
export async function promptForAgentBranch(
    message: string,
    repoPath: RepoPath,
    bareRepoPath: BareRepoPath | null
): Promise<BranchSelection | symbol> {
    // Fetch branches and worktrees in parallel
    const [localBranches, remoteBranches, existingWorktrees] = await Promise.all([
        listLocalBranches(repoPath),
        listRemoteBranches(repoPath),
        bareRepoPath ? listWorktrees(bareRepoPath) : Promise.resolve([])
    ]);

    const allBranches = mergeBranches(localBranches, remoteBranches);
    const agentSet = new Set(existingWorktrees.map((w) => w.name));
    const nameSet = new Set(allBranches.map((b) => b.name));

    // Build agent status map in parallel
    const agentStateMap = new Map(
        await Promise.all(
            existingWorktrees.map(async (w) => {
                const parsed = parseAgentName(w.name);
                const state = parsed.ok
                    ? await getAgentState(parsed.value)
                    : { kind: "not-found" as const };
                return [w.name, state.kind === "not-found" ? "unknown" : state.kind] as const;
            })
        )
    );

    // Build unified list: branches annotated with agent info, sorted by last edit
    const branchEntries = allBranches.map((b: AnnotatedBranch) => {
        const agentState = agentStateMap.get(b.name);
        const hint = [
            agentState != null ? `agent: ${agentState}` : null,
            b.location,
            b.author,
            b.lastEdit
        ]
            .filter(Boolean)
            .join(", ");
        return { value: b.name, label: `${b.name} (${hint})`, sortKey: b.lastEditUnix };
    });

    // Add agents that don't appear in branch list (orphaned worktrees)
    const orphanedAgents = existingWorktrees
        .filter((w) => !nameSet.has(w.name))
        .map((w) => {
            const state = agentStateMap.get(w.name);
            return { value: w.name, label: `${w.name} (agent: ${state ?? "unknown"})`, sortKey: 0 };
        });

    const entries = [...branchEntries, ...orphanedAgents].toSorted((a, b) => b.sortKey - a.sortKey);

    const result = await p.autocomplete<string>({
        message,
        placeholder: "Type to search or enter a branch name...",
        maxItems: 20,
        options() {
            const input = this.userInput;
            const base: readonly PromptOption[] = entries.map((e) => ({
                value: e.value,
                label: e.label
            }));
            const custom: readonly PromptOption[] =
                input && !nameSet.has(input) && !agentSet.has(input)
                    ? [{ value: input, label: `${input} (new branch)` }]
                    : [];

            return [...base, ...custom];
        }
    });

    if (p.isCancel(result)) return result;

    const isExisting = agentSet.has(result) || nameSet.has(result);
    return { branch: result, isExisting };
}

/**
 * Prompt for a base branch when creating a new branch.
 * Prioritizes main/master at the top of the list.
 */
export async function promptForBaseBranch(repoPath: RepoPath): Promise<string | null> {
    const [localBranches, remoteBranches, mainBranch] = await Promise.all([
        listLocalBranches(repoPath),
        listRemoteBranches(repoPath),
        getMainBranch(repoPath)
    ]);

    const allBranches = mergeBranches(localBranches, remoteBranches);
    const nameSet = new Set(allBranches.map((b) => b.name));

    // Reorder so main branch appears first
    const prioritize = [mainBranch, `origin/${mainBranch}`].filter((n) => nameSet.has(n));
    const prioritySet = new Set(prioritize);
    const ordered =
        prioritize.length > 0
            ? [
                  ...allBranches.filter((b) => prioritySet.has(b.name)),
                  ...allBranches.filter((b) => !prioritySet.has(b.name))
              ]
            : allBranches;

    const result = await p.autocomplete<string>({
        message: "Base branch for your new branch",
        placeholder: "Type to search...",
        options() {
            return ordered.map((b) => ({ value: b.name, label: `${b.name} (${branchHint(b)})` }));
        },
        initialValue: mainBranch,
        validate: (value: string | readonly string[] | undefined) =>
            typeof value !== "string" || !nameSet.has(value)
                ? "Select an existing branch"
                : undefined
    });

    if (p.isCancel(result)) return null;
    return result;
}
