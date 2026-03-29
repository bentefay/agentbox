import type { BareRepoPath, RepoPath } from "../lib/git";
export interface BranchSelection {
    readonly branch: string;
    readonly isExisting: boolean;
}
export type PromptOption = {
    readonly value: string;
    readonly label: string;
    readonly hint?: string;
};
export declare const OTHER = "__other__";
/**
 * Autocomplete prompt for selecting a branch from local/remote branches and existing agents.
 * User can type a new branch name or select an existing one.
 */
export declare function promptForAgentBranch(message: string, repoPath: RepoPath, bareRepoPath: BareRepoPath | null): Promise<BranchSelection | symbol>;
/**
 * Prompt for a base branch when creating a new branch.
 * Prioritizes main/master at the top of the list.
 */
export declare function promptForBaseBranch(repoPath: RepoPath): Promise<string | null>;
