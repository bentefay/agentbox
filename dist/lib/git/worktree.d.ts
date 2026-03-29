import type { RepoPath } from "../loader";
import type { Result } from "../result";
import type { AgentName } from "./agent-name";
import type { BareRepoPath } from "./paths";
import type { ResolveOptions } from "./resolve";
export interface SyncResult {
    readonly warnings: readonly string[];
}
export declare function ensureBareRepo(repoPath: RepoPath): Promise<Result<BareRepoPath, string>>;
export declare function syncBareRepo(bareRepoPath: BareRepoPath, repoPath: RepoPath): Promise<Result<SyncResult, string>>;
/**
 * Sets upstream tracking on a branch so git push/pull work inside the worktree
 * without explicit remote arguments.
 */
export declare function setUpstreamTracking(bareRepoPath: BareRepoPath, branch: string): Promise<void>;
export declare function createWorktree(bareRepoPath: BareRepoPath, worktreePath: string, branch: string, repoPath: RepoPath, baseBranch?: string, resolveOptions?: ResolveOptions): Promise<Result<string, string>>;
export declare function removeWorktree(bareRepoPath: BareRepoPath, worktreePath: string, force?: boolean): Promise<Result<void, string>>;
export interface WorktreeInfo {
    readonly name: string;
    readonly path: string;
    readonly branch: string;
}
export declare function listWorktrees(bareRepoPath: BareRepoPath): Promise<readonly WorktreeInfo[]>;
export type CheckoutError = {
    readonly kind: "not-found";
    readonly name: string;
} | {
    readonly kind: "fetch-failed";
    readonly branch: string;
    readonly detail: string;
} | {
    readonly kind: "checkout-failed";
    readonly branch: string;
    readonly detail: string;
};
export declare function checkoutAgentBranch(bareRepoPath: BareRepoPath, repoPath: RepoPath, agentName: AgentName): Promise<Result<void, CheckoutError>>;
