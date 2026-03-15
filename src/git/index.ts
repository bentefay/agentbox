export { type RepoPath } from "../loader";
export { type AgentName, parseAgentName } from "./agent-name";
export {
    type BareRepoPath,
    type AgentPaths,
    type AgentsDirPaths,
    getAgentPaths,
    getAgentsDirPaths,
} from "./paths";
export {
    type BranchInfo,
    type AnnotatedBranch,
    listLocalBranches,
    listRemoteBranches,
    mergeBranches,
    branchHint,
    getRepoOriginUrl,
    getMainBranch,
    branchExists,
    fetchLatestRefs,
} from "./branches";
export {
    type ResolveOptions,
    type BranchSource,
    type BranchSourceGroup,
    type BranchShas,
    type ResolutionOutcome,
    CANCELLED,
    classifyBranchSources,
    hasUncommittedChanges,
    resolveTargetBranch,
    groupSourcesBySha,
} from "./resolve";
export {
    type CheckoutError,
    type SyncResult,
    type WorktreeInfo,
    ensureBareRepo,
    syncBareRepo,
    setUpstreamTracking,
    createWorktree,
    removeWorktree,
    listWorktrees,
    checkoutAgentBranch,
} from "./worktree";
