import type { RepoPath } from "../loader";
import type { Result } from "../result";
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
export type ResolutionOutcome = {
    readonly kind: "new-branch";
} | {
    readonly kind: "agreed";
    readonly localSha: string | null;
} | {
    readonly kind: "conflict";
    readonly localSha: string | null;
};
export declare const CANCELLED: "cancelled";
/**
 * Pure classifier: given the three nullable SHAs from origin, local repo, and bare repo,
 * determines whether the branch is new, all sources agree, or there is a conflict.
 */
export declare function classifyBranchSources(shas: BranchShas): ResolutionOutcome;
/**
 * Groups branch sources by SHA, merging labels for sources that point to the same commit.
 * Pure function — no mutation.
 */
export declare function groupSourcesBySha(sources: readonly BranchSource[]): readonly BranchSourceGroup[];
/**
 * Checks if the main repo is currently on the target branch AND has uncommitted changes.
 * Returns false if the repo is on a different branch (changes wouldn't affect the agent).
 */
export declare function hasUncommittedChanges(repoPath: RepoPath, branch: string): Promise<boolean>;
/**
 * When a branch exists in multiple sources (origin, local repo, bare repo) with
 * different commits, prompt the user to pick which version the agent should use.
 * Force-updates the bare repo branch to the selected SHA.
 *
 * Returns Ok(branch) on success, Err("cancelled") if user cancels, or Err(message) on failure.
 */
export declare function resolveTargetBranch(bareRepoPath: BareRepoPath, repoPath: RepoPath, branch: string, options?: ResolveOptions): Promise<Result<string, string>>;
