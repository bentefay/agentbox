import type { RepoPath } from "../loader";
import type { BareRepoPath } from "./paths";
/**
 * Fetch latest refs from origin in both the main repo and bare repo (if present) in parallel.
 * Failures are silently ignored (network may be unavailable).
 */
export declare function fetchLatestRefs(repoPath: RepoPath, bareRepoPath: BareRepoPath | null): Promise<void>;
export interface BranchInfo {
    readonly name: string;
    readonly sha: string;
    readonly author: string;
    readonly lastEdit: string;
    readonly lastEditUnix: number;
}
/**
 * List all local branches in a repo, sorted by most recently edited.
 */
export declare function listLocalBranches(repoPath: RepoPath): Promise<readonly BranchInfo[]>;
/**
 * List all remote branches, sorted by most recently edited.
 * Excludes HEAD pointer. Retains origin/ prefix.
 */
export declare function listRemoteBranches(repoPath: RepoPath): Promise<readonly BranchInfo[]>;
export interface AnnotatedBranch extends BranchInfo {
    readonly location: "local" | "remote" | "local + remote";
}
/**
 * Merge local and remote branch lists into an annotated list with location hints.
 *
 * - Same SHA -> single entry using the local name, location "local + remote"
 * - Different SHA -> two entries: local name (location "local") and origin/name (location "remote")
 * - Only remote -> single entry as origin/name (location "remote")
 * - Only local -> single entry as name (location "local")
 *
 * Sorted by last edit descending.
 */
export declare function mergeBranches(local: readonly BranchInfo[], remote: readonly BranchInfo[]): readonly AnnotatedBranch[];
/** Format a branch hint: "local + remote, Author, 2 days ago" */
export declare function branchHint(b: AnnotatedBranch): string;
export declare function getRepoOriginUrl(repoPath: RepoPath): Promise<string>;
export declare function getMainBranch(repoPath: RepoPath | BareRepoPath): Promise<string>;
export declare function branchExists(bareRepoPath: BareRepoPath, branch: string): Promise<boolean>;
