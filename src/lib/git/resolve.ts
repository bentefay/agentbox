import * as path from "path";

import * as p from "@clack/prompts";
import { match } from "ts-pattern";

import { exec, tryExec, shellEscape } from "../exec";
import type { RepoPath } from "../loader";
import type { Result } from "../result";
import { Ok, Err } from "../result";
import type { BareRepoPath } from "./paths";

export interface ResolveOptions {
    readonly useLocalBranch?: boolean;
}

export interface BranchSource {
    readonly label: string;
    readonly sha: string;
}

export interface BranchSourceGroup {
    readonly labels: readonly string[];
    readonly sha: string;
    readonly subject?: string;
    readonly date?: string;
    readonly unix: number;
}

/** The three nullable SHAs that represent a branch's state across sources. */
export interface BranchShas {
    readonly originSha: string | null;
    readonly localSha: string | null;
    readonly bareSha: string | null;
}

/** Discriminated union describing what state a branch is in across its sources. */
export type ResolutionOutcome =
    | { readonly kind: "new-branch" }
    | { readonly kind: "agreed"; readonly localSha: string | null }
    | { readonly kind: "conflict"; readonly localSha: string | null };

export const CANCELLED = "cancelled" as const;

/**
 * Pure classifier: given the three nullable SHAs from origin, local repo, and bare repo,
 * determines whether the branch is new, all sources agree, or there is a conflict.
 */
export function classifyBranchSources(shas: BranchShas): ResolutionOutcome {
    const present = [shas.originSha, shas.localSha, shas.bareSha].filter((s) => s != null);

    if (present.length === 0) return { kind: "new-branch" };

    const unique = new Set(present);
    if (unique.size <= 1) return { kind: "agreed", localSha: shas.localSha };

    return { kind: "conflict", localSha: shas.localSha };
}

/**
 * Groups branch sources by SHA, merging labels for sources that point to the same commit.
 * Pure function — no mutation.
 */
export function groupSourcesBySha(sources: readonly BranchSource[]): readonly BranchSourceGroup[] {
    return sources.reduce<readonly BranchSourceGroup[]>((groups, { label, sha }) => {
        const existing = groups.find((g) => g.sha === sha);
        if (existing != null) {
            return groups.map((g) => (g.sha === sha ? { ...g, labels: [...g.labels, label] } : g));
        }
        return [...groups, { labels: [label], sha, unix: 0 }];
    }, []);
}

/**
 * Checks if the main repo is currently on the target branch AND has uncommitted changes.
 * Returns false if the repo is on a different branch (changes wouldn't affect the agent).
 */
export async function hasUncommittedChanges(repoPath: RepoPath, branch: string): Promise<boolean> {
    const currentBranchResult = await exec(
        `git -C ${shellEscape(repoPath)} rev-parse --abbrev-ref HEAD`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false
        }
    );
    if (currentBranchResult.code !== 0 || currentBranchResult.stdout.trim() !== branch)
        return false;
    const statusResult = await exec(`git -C ${shellEscape(repoPath)} status --porcelain`, {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    return statusResult.stdout.trim().length > 0;
}

/**
 * Checks for uncommitted changes and prompts the user to confirm they want to continue.
 * Returns Ok(undefined) if no uncommitted changes or user confirms, Err("cancelled") if user declines.
 */
async function warnUncommittedChanges(
    repoPath: RepoPath,
    branch: string
): Promise<Result<undefined, typeof CANCELLED>> {
    if (!(await hasUncommittedChanges(repoPath, branch))) return Ok(undefined);
    const confirmed = await p.confirm({
        message: `Main repo has uncommitted changes on '${branch}' that won't be in the agent worktree. Continue?`,
        initialValue: true
    });
    if (p.isCancel(confirmed) || !confirmed) return Err(CANCELLED);
    return Ok(undefined);
}

/**
 * When a branch exists in multiple sources (origin, local repo, bare repo) with
 * different commits, prompt the user to pick which version the agent should use.
 * Force-updates the bare repo branch to the selected SHA.
 *
 * Returns Ok(branch) on success, Err("cancelled") if user cancels, or Err(message) on failure.
 */
export async function resolveTargetBranch(
    bareRepoPath: BareRepoPath,
    repoPath: RepoPath,
    branch: string,
    options?: ResolveOptions
): Promise<Result<string, string>> {
    const repoName = path.basename(repoPath);
    const agentsDirName = `${repoName}-agents`;

    const revParse = async (repo: string, ref: string): Promise<string | null> => {
        const result = await exec(
            `git -C ${shellEscape(repo)} rev-parse --verify --quiet ${shellEscape(ref)}`,
            {
                captureOutput: true,
                rejectOnNonZeroExit: false
            }
        );
        return result.code === 0 ? result.stdout.trim() : null;
    };

    const commitInfo = async (
        repo: string,
        sha: string
    ): Promise<{
        readonly subject: string;
        readonly date: string;
        readonly unix: number;
    } | null> => {
        const result = await exec(
            `git -C ${shellEscape(repo)} log -1 --format="%s%x09%cr%x09%ct" ${shellEscape(sha)}`,
            { captureOutput: true, rejectOnNonZeroExit: false }
        );
        const [subject, date, unixStr] = result.stdout.trim().split("\t");
        return subject && date && unixStr
            ? { subject, date, unix: parseInt(unixStr, 10) || 0 }
            : null;
    };

    // Query all three possible locations in parallel
    const [originSha, localSha, bareSha] = await Promise.all([
        revParse(bareRepoPath, `refs/remotes/origin/${branch}`),
        revParse(repoPath, `refs/heads/${branch}`),
        revParse(bareRepoPath, `refs/heads/${branch}`)
    ]);

    const outcome = classifyBranchSources({ originSha, localSha, bareSha });

    return match(outcome)
        .with({ kind: "new-branch" }, () => Ok(branch))
        .with({ kind: "agreed" }, async ({ localSha: local }) => {
            if (local != null) {
                const warning = await warnUncommittedChanges(repoPath, branch);
                if (!warning.ok) return warning;
            }
            return Ok(branch);
        })
        .with({ kind: "conflict" }, async ({ localSha: local }) => {
            // Collect existing sources for display
            const sources: readonly BranchSource[] = [
                ...(local != null ? [{ label: `Local (${repoName})`, sha: local }] : []),
                ...(originSha != null ? [{ label: "GitHub", sha: originSha }] : []),
                ...(bareSha != null
                    ? [{ label: `Bare repo (${agentsDirName}/.bare)`, sha: bareSha }]
                    : [])
            ];

            const rawGroups = groupSourcesBySha(sources);

            // Fetch commit info (try bare repo first, fall back to main repo)
            const enrichedGroups: readonly BranchSourceGroup[] = await Promise.all(
                rawGroups.map(async (group) => {
                    const info =
                        (await commitInfo(bareRepoPath, group.sha)) ??
                        (await commitInfo(repoPath, group.sha));
                    return info != null
                        ? { ...group, subject: info.subject, date: info.date, unix: info.unix }
                        : group;
                })
            );

            const groups: readonly BranchSourceGroup[] = [...enrichedGroups].sort(
                (a, b) => b.unix - a.unix
            );

            p.log.warn(`Branch '${branch}' has different versions:`);
            for (const { labels, sha, subject, date } of groups) {
                p.log.info(
                    `  ${labels.join(" + ")}: ${sha.slice(0, 7)} "${subject}"${date ? ` (${date})` : ""}`
                );
            }

            // Determine which SHA to use
            const selectedSha = await (async (): Promise<Result<string, typeof CANCELLED>> => {
                if (options?.useLocalBranch && local != null) {
                    p.log.step("Using local version (--use-local-branch)");
                    return Ok(local);
                }

                const selectOptions = [
                    ...groups.map((g) => ({
                        value: g.sha,
                        label: `${g.labels.join(" + ")} (${g.sha.slice(0, 7)})`,
                        hint: g.date
                    })),
                    { value: "__cancel__", label: "Cancel", hint: undefined }
                ];

                const selected = await p.select({
                    message: "Which version should the agent use?",
                    options: selectOptions
                });

                if (p.isCancel(selected) || selected === "__cancel__") return Err(CANCELLED);

                // Warn about uncommitted changes when local version is selected
                if (selected === local && local != null) {
                    const warning = await warnUncommittedChanges(repoPath, branch);
                    if (!warning.ok) return warning;
                }

                return Ok(selected);
            })();

            if (!selectedSha.ok) return selectedSha;

            const sha = selectedSha.value;

            // Ensure the selected commit exists in the bare repo
            const commitExists = await exec(
                `git -C ${shellEscape(bareRepoPath)} cat-file -e ${shellEscape(sha)}`,
                {
                    captureOutput: true,
                    rejectOnNonZeroExit: false
                }
            );
            if (commitExists.code !== 0) {
                await exec(`git -C ${shellEscape(bareRepoPath)} fetch local`, {
                    captureOutput: true,
                    rejectOnNonZeroExit: false
                });
            }

            // Force-update the branch in the bare repo to the selected SHA
            const branchResult = await tryExec(
                `git -C ${shellEscape(bareRepoPath)} branch -f ${shellEscape(branch)} ${shellEscape(sha)}`,
                `Failed to update branch '${branch}' to ${sha.slice(0, 7)} in the bare repo`
            );
            if (!branchResult.ok) return branchResult;

            return Ok(branch);
        })
        .exhaustive();
}
