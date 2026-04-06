import * as fs from "fs";
import * as path from "path";

import { exec, tryExec, shellEscape } from "../exec";
import type { RepoPath } from "../loader";
import type { Result } from "../result";
import { Ok, Err } from "../result";
import type { AgentName } from "./agent-name";
import { getRepoOriginUrl, getMainBranch, branchExists } from "./branches";
import type { BareRepoPath } from "./paths";
import { getAgentsDirPaths } from "./paths";
import type { ResolveOptions } from "./resolve";
import { resolveTargetBranch } from "./resolve";

export interface SyncResult {
    readonly warnings: readonly string[];
}

export async function ensureBareRepo(repoPath: RepoPath): Promise<Result<BareRepoPath, string>> {
    const { agentsDir, bareRepo } = getAgentsDirPaths({ kind: "repo", root: repoPath });

    const checkResult = await exec(
        `git -C ${shellEscape(bareRepo)} rev-parse --is-bare-repository`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        }
    );
    if (checkResult.code === 0) return Ok(bareRepo);

    fs.mkdirSync(agentsDir, { recursive: true });

    const cloneResult = await tryExec(
        `git clone --bare ${shellEscape(repoPath)} ${shellEscape(bareRepo)}`,
        "Failed to clone bare repo"
    );
    if (!cloneResult.ok) return cloneResult;

    const originUrl = await getRepoOriginUrl(repoPath);

    const setUrlResult = await tryExec(
        `git -C ${shellEscape(bareRepo)} remote set-url origin ${shellEscape(originUrl)}`,
        "Failed to set origin URL"
    );
    if (!setUrlResult.ok) return setUrlResult;

    const configFetchResult = await tryExec(
        `git -C ${shellEscape(bareRepo)} config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'`,
        "Failed to configure origin fetch"
    );
    if (!configFetchResult.ok) return configFetchResult;

    const addLocalResult = await tryExec(
        `git -C ${shellEscape(bareRepo)} remote add local ${shellEscape(repoPath)}`,
        "Failed to add local remote"
    );
    if (!addLocalResult.ok) return addLocalResult;

    const configLocalResult = await tryExec(
        `git -C ${shellEscape(bareRepo)} config remote.local.fetch '+refs/heads/*:refs/remotes/local/*'`,
        "Failed to configure local fetch"
    );
    if (!configLocalResult.ok) return configLocalResult;

    return Ok(bareRepo);
}

export async function syncBareRepo(
    bareRepoPath: BareRepoPath,
    repoPath: RepoPath
): Promise<Result<SyncResult, string>> {
    const originUrl = await getRepoOriginUrl(repoPath);
    const currentOrigin = await exec(`git -C ${shellEscape(bareRepoPath)} remote get-url origin`, {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });
    if (currentOrigin.stdout.trim() !== originUrl) {
        const setUrl = await tryExec(
            `git -C ${shellEscape(bareRepoPath)} remote set-url origin ${shellEscape(originUrl)}`,
            "Failed to set origin URL on bare repo"
        );
        if (!setUrl.ok) return setUrl;
    }

    const localRemote = await exec(`git -C ${shellEscape(bareRepoPath)} remote get-url local`, {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });
    if (localRemote.code !== 0) {
        const addLocal = await tryExec(
            `git -C ${shellEscape(bareRepoPath)} remote add local ${shellEscape(repoPath)}`,
            "Failed to add local remote to bare repo"
        );
        if (!addLocal.ok) return addLocal;
    } else if (localRemote.stdout.trim() !== repoPath) {
        const setLocal = await tryExec(
            `git -C ${shellEscape(bareRepoPath)} remote set-url local ${shellEscape(repoPath)}`,
            "Failed to set local remote URL on bare repo"
        );
        if (!setLocal.ok) return setLocal;
    }

    // Re-set local fetch refspec for resilience (may have been corrupted or missing)
    await exec(
        `git -C ${shellEscape(bareRepoPath)} config remote.local.fetch '+refs/heads/*:refs/remotes/local/*'`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        }
    );

    // Fetch sequentially to avoid packed-refs.lock contention
    const originResult = await exec(`git -C ${shellEscape(bareRepoPath)} fetch origin`, {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });

    const originWarnings: readonly string[] =
        originResult.code !== 0
            ? [
                  `origin: Failed to fetch from origin: ${
                      (originResult.stderr ?? "")
                          .split("\n")
                          .find((l) => l.trim() !== "")
                          ?.trim() ?? "unknown error"
                  }`,
              ]
            : [];

    const localResult = await exec(
        `git -C ${shellEscape(bareRepoPath)} fetch local 'refs/heads/*:refs/heads/*'`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        }
    );

    const localLines = (localResult.stderr ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");

    // Fatal errors are genuine failures
    const fatalWarnings: readonly string[] = localLines
        .filter((line) => line.includes("fatal:"))
        .map((line) => `local: ${line}`);

    // Non-fast-forward rejections are expected divergence (informational)
    const divergenceWarnings: readonly string[] = localLines.filter(
        (line) =>
            (line.includes("rejected") || line.includes("non-fast-forward")) &&
            !line.includes("fatal:")
    );

    return Ok({ warnings: [...originWarnings, ...fatalWarnings, ...divergenceWarnings] });
}

/**
 * Sets upstream tracking on a branch so git push/pull work inside the worktree
 * without explicit remote arguments.
 */
export async function setUpstreamTracking(
    bareRepoPath: BareRepoPath,
    branch: string
): Promise<void> {
    await exec(
        `git -C ${shellEscape(bareRepoPath)} config ${shellEscape(`branch.${branch}.remote`)} origin`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        }
    );
    await exec(
        `git -C ${shellEscape(bareRepoPath)} config ${shellEscape(`branch.${branch}.merge`)} ${shellEscape(`refs/heads/${branch}`)}`,
        { captureOutput: true, rejectOnNonZeroExit: false }
    );
}

export async function createWorktree(
    bareRepoPath: BareRepoPath,
    worktreePath: string,
    branch: string,
    repoPath: RepoPath,
    baseBranch?: string,
    resolveOptions?: ResolveOptions
): Promise<Result<string, string>> {
    fs.mkdirSync(path.dirname(worktreePath), { recursive: true });

    const hasBranch = await branchExists(bareRepoPath, branch);

    // When the branch already exists, resolve version conflicts across sources
    if (hasBranch) {
        const resolved = await resolveTargetBranch(bareRepoPath, repoPath, branch, resolveOptions);
        if (!resolved.ok) return resolved;

        const addResult = await tryExec(
            `git -C ${shellEscape(bareRepoPath)} worktree add ${shellEscape(worktreePath)} ${shellEscape(branch)}`,
            "Failed to add worktree"
        );
        if (!addResult.ok) return addResult;
    } else {
        const base = baseBranch ?? (await getMainBranch(bareRepoPath));
        const addResult = await tryExec(
            `git -C ${shellEscape(bareRepoPath)} worktree add -b ${shellEscape(branch)} ${shellEscape(worktreePath)} ${shellEscape(base)}`,
            "Failed to add worktree"
        );
        if (!addResult.ok) return addResult;
    }

    // Set upstream tracking so git push/pull work inside the worktree
    await setUpstreamTracking(bareRepoPath, branch);

    return Ok(worktreePath);
}

export async function removeWorktree(
    bareRepoPath: BareRepoPath,
    worktreePath: string,
    force = false
): Promise<Result<void, string>> {
    const forceFlag = force ? " --force" : "";

    const result = await exec(
        `git -C ${shellEscape(bareRepoPath)} worktree remove${forceFlag} ${shellEscape(worktreePath)}`,
        { captureOutput: true, rejectOnNonZeroExit: false }
    );

    if (result.code === 0) return Ok(undefined);

    const stderr = (result.stderr ?? "").trim();
    return Err(stderr || `git worktree remove exited with code ${result.code}`);
}

export interface WorktreeInfo {
    readonly name: string;
    readonly path: string;
    readonly branch: string;
}

export async function listWorktrees(bareRepoPath: BareRepoPath): Promise<readonly WorktreeInfo[]> {
    const result = await exec(`git -C ${shellEscape(bareRepoPath)} worktree list --porcelain`, {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });

    if (result.code !== 0 || !result.stdout.trim()) return [];

    return result.stdout
        .trim()
        .split("\n\n")
        .flatMap((block): readonly WorktreeInfo[] => {
            const lines = block.split("\n");
            const wtPath =
                lines.find((l) => l.startsWith("worktree "))?.substring("worktree ".length) ?? "";
            const branch =
                lines
                    .find((l) => l.startsWith("branch "))
                    ?.substring("branch ".length)
                    .replace("refs/heads/", "") ?? "";

            if (!wtPath || wtPath === bareRepoPath) return [];
            return [{ name: path.basename(wtPath), path: wtPath, branch: branch || "(detached)" }];
        });
}

export type CheckoutError =
    | { readonly kind: "not-found"; readonly name: string }
    | { readonly kind: "fetch-failed"; readonly branch: string; readonly detail: string }
    | { readonly kind: "checkout-failed"; readonly branch: string; readonly detail: string };

export async function checkoutAgentBranch(
    bareRepoPath: BareRepoPath,
    repoPath: RepoPath,
    agentName: AgentName
): Promise<Result<void, CheckoutError>> {
    const worktrees = await listWorktrees(bareRepoPath);
    const agent = worktrees.find((w) => w.name === agentName);
    if (!agent) return Err({ kind: "not-found", name: agentName });

    const branch = agent.branch;

    // Fetch from bare repo — try normal first, fall back to force-update if diverged
    const fetchResult = await tryExec(
        `git -C ${shellEscape(repoPath)} fetch ${shellEscape(bareRepoPath)} ${shellEscape(branch)}:${shellEscape(branch)}`,
        `Failed to fetch branch '${branch}' from bare repo`
    );
    if (!fetchResult.ok) {
        const forceFetch = await tryExec(
            `git -C ${shellEscape(repoPath)} fetch ${shellEscape(bareRepoPath)} +${shellEscape(branch)}:${shellEscape(branch)}`,
            `Failed to fetch branch '${branch}' from bare repo`
        );
        if (!forceFetch.ok) return Err({ kind: "fetch-failed", branch, detail: forceFetch.error });
    }

    // Actually check out the branch
    const checkoutResult = await tryExec(
        `git -C ${shellEscape(repoPath)} checkout ${shellEscape(branch)}`,
        `Failed to checkout branch '${branch}'`
    );
    if (!checkoutResult.ok)
        return Err({ kind: "checkout-failed", branch, detail: checkoutResult.error });

    return Ok(undefined);
}
