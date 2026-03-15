import { exec, shellEscape } from "../exec";
import type { RepoPath } from "../loader";
import type { BareRepoPath } from "./paths";

/**
 * Fetch latest refs from origin in both the main repo and bare repo (if present) in parallel.
 * Failures are silently ignored (network may be unavailable).
 */
export async function fetchLatestRefs(
    repoPath: RepoPath,
    bareRepoPath: BareRepoPath | null
): Promise<void> {
    const fetchBareRepo = async () => {
        if (!bareRepoPath) return;
        await exec(`git -C ${shellEscape(bareRepoPath)} fetch --quiet origin`, {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        });
    };
    await Promise.all([
        exec(`git -C ${shellEscape(repoPath)} fetch --quiet`, {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        }),
        fetchBareRepo(),
    ]);
}

export interface BranchInfo {
    readonly name: string;
    readonly sha: string;
    readonly author: string;
    readonly lastEdit: string;
    readonly lastEditUnix: number;
}

// Use %(refname:lstrip=2) instead of %(refname:short) to avoid ambiguity.
// When refs/heads/origin/main and refs/remotes/origin/main both exist,
// %(refname:short) outputs heads/origin/main and remotes/origin/main.
// lstrip=2 always strips exactly refs/heads/ or refs/remotes/.
const BRANCH_FORMAT =
    "'--format=%(refname:lstrip=2)%09%(objectname:short)%09%(authorname)%09%(committerdate:relative)%09%(committerdate:unix)'";

function parseBranchLine(line: string): BranchInfo | null {
    const [name, sha, author, lastEdit, unix] = line.split("\t");
    if (!name || !sha || !author || !lastEdit || !unix) return null;
    return { name, sha, author, lastEdit, lastEditUnix: parseInt(unix, 10) || 0 };
}

/**
 * List all local branches in a repo, sorted by most recently edited.
 */
export async function listLocalBranches(repoPath: RepoPath): Promise<readonly BranchInfo[]> {
    const result = await exec(
        `git -C ${shellEscape(repoPath)} branch --list --sort=-committerdate ${BRANCH_FORMAT}`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        }
    );
    if (result.code !== 0 || !result.stdout.trim()) return [];
    return result.stdout
        .trim()
        .split("\n")
        .filter(Boolean)
        .map(parseBranchLine)
        .filter((b): b is BranchInfo => b != null);
}

/**
 * List all remote branches, sorted by most recently edited.
 * Excludes HEAD pointer. Retains origin/ prefix.
 */
export async function listRemoteBranches(repoPath: RepoPath): Promise<readonly BranchInfo[]> {
    const result = await exec(
        `git -C ${shellEscape(repoPath)} branch -r --sort=-committerdate ${BRANCH_FORMAT}`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        }
    );
    if (result.code !== 0 || !result.stdout.trim()) return [];
    return result.stdout
        .trim()
        .split("\n")
        .filter(Boolean)
        .map(parseBranchLine)
        .filter((b): b is BranchInfo => b != null && b.name !== "origin/HEAD");
}

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
export function mergeBranches(
    local: readonly BranchInfo[],
    remote: readonly BranchInfo[]
): readonly AnnotatedBranch[] {
    const localMap = new Map(local.map((b) => [b.name, b]));
    const remoteMap = new Map(remote.map((b) => [b.name.replace(/^origin\//, ""), b]));
    const allBareNames = [
        ...new Set([
            ...local.map((b) => b.name),
            ...remote.map((b) => b.name.replace(/^origin\//, "")),
        ]),
    ];

    return allBareNames
        .flatMap((name): readonly AnnotatedBranch[] => {
            const l = localMap.get(name);
            const r = remoteMap.get(name);

            if (l && r) {
                return l.sha === r.sha
                    ? [{ ...l, location: "local + remote" }]
                    : [
                          { ...l, location: "local" },
                          { ...r, location: "remote" },
                      ];
            }
            if (l) return [{ ...l, location: "local" }];
            if (r) return [{ ...r, location: "remote" }];
            return [];
        })
        .toSorted((a, b) => b.lastEditUnix - a.lastEditUnix);
}

/** Format a branch hint: "local + remote, Author, 2 days ago" */
export function branchHint(b: AnnotatedBranch): string {
    return [b.location, b.author, b.lastEdit].join(", ");
}

export async function getRepoOriginUrl(repoPath: RepoPath): Promise<string> {
    const result = await exec(`git -C ${shellEscape(repoPath)} remote get-url origin`, {
        captureOutput: true,
    });
    return result.stdout.trim();
}

export async function getMainBranch(repoPath: RepoPath | BareRepoPath): Promise<string> {
    for (const candidate of ["main", "master"]) {
        const result = await exec(
            `git -C ${shellEscape(repoPath)} rev-parse --verify refs/heads/${candidate}`,
            {
                captureOutput: true,
                rejectOnNonZeroExit: false,
            }
        );
        if (result.code === 0) return candidate;
    }
    return "main";
}

export async function branchExists(bareRepoPath: BareRepoPath, branch: string): Promise<boolean> {
    const result = await exec(
        `git -C ${shellEscape(bareRepoPath)} show-ref --verify --quiet ${shellEscape(`refs/heads/${branch}`)}`,
        { captureOutput: true, rejectOnNonZeroExit: false }
    );
    return result.code === 0;
}
