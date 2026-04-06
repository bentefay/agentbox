import * as fs from "fs";
import * as path from "path";

import { AgentboxConfigSchema } from "./config";
import type { AgentboxConfig } from "./config";
import { exec, errorMessage } from "./exec";
import type { BareRepoPath } from "./git/paths";
import { Ok, Err } from "./result";
import type { Result } from "./result";

export type RepoPath = string & { readonly __brand: "RepoPath" };

export type GitContext =
    | { readonly kind: "repo"; readonly root: RepoPath }
    | {
          readonly kind: "bare-worktree";
          readonly root: RepoPath;
          readonly bareRepo: BareRepoPath;
          readonly agentsDir: string;
      };

const CONFIG_FILENAMES = ["agentbox.config.ts", "agentbox.config.js"];

export async function loadConfig(repoPath: RepoPath): Promise<Result<AgentboxConfig, string>> {
    const configPath = findConfigFile(repoPath);
    if (configPath == null) {
        return Err(
            `No agentbox config found in ${repoPath}\nCreate ${CONFIG_FILENAMES[0]} in your repo root.`
        );
    }

    let mod: unknown;
    try {
        mod = await import(configPath);
    } catch (err) {
        const message = errorMessage(err);
        return Err(`Failed to load ${path.basename(configPath)}: ${message}`);
    }

    const raw: unknown = isModuleWithDefault(mod) ? mod.default : mod;

    const result = AgentboxConfigSchema.safeParse(raw);
    if (!result.success) {
        const filename = path.basename(configPath);
        const issues = result.error.issues
            .map((i) => `  ${i.path.join(".")}: ${i.message}`)
            .join("\n");
        return Err(
            `${filename} has invalid config:\n${issues}\nUse defineConfig() for type checking.`
        );
    }

    return Ok(result.data);
}

function isModuleWithDefault(mod: unknown): mod is { readonly default: unknown } {
    return mod != null && typeof mod === "object" && "default" in mod;
}

function findConfigFile(repoPath: RepoPath): string | null {
    for (const filename of CONFIG_FILENAMES) {
        const configPath = path.join(repoPath, filename);
        if (fs.existsSync(configPath)) return configPath;
    }
    return null;
}

export async function getRepoPath(): Promise<Result<RepoPath, string>> {
    const result = await exec("git rev-parse --show-toplevel", {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (result.code === 0 && result.stdout.trim()) {
        // This is the ONE allowed cast — the branded type smart constructor pattern
        return Ok(result.stdout.trim() as RepoPath);
    }
    return Err("Not inside a git repository. Run agentbox from your project root.");
}

export async function detectGitContext(): Promise<Result<GitContext, string>> {
    const repoPathResult = await getRepoPath();
    if (!repoPathResult.ok) return repoPathResult;
    const root = repoPathResult.value;

    const gitPath = path.join(root, ".git");
    let stat: fs.Stats;
    try {
        stat = fs.statSync(gitPath);
    } catch {
        return Err("Cannot stat .git in repository root.");
    }

    if (stat.isDirectory()) {
        return Ok({ kind: "repo", root });
    }

    // .git is a file → this is a worktree
    const commonDirResult = await exec(`git -C ${root} rev-parse --git-common-dir`, {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (commonDirResult.code !== 0 || !commonDirResult.stdout.trim()) {
        return Err("Failed to determine git common dir for worktree.");
    }
    const commonDir = path.resolve(root, commonDirResult.stdout.trim());

    const isBareResult = await exec(`git -C ${commonDir} rev-parse --is-bare-repository`, {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (isBareResult.code !== 0) {
        return Err("Failed to determine if parent repository is bare.");
    }

    if (isBareResult.stdout.trim() === "true") {
        return Ok({
            kind: "bare-worktree",
            root,
            bareRepo: commonDir as BareRepoPath,
            agentsDir: path.dirname(commonDir)
        });
    }

    return Err("agentbox cannot run from a git worktree. Run from the project root instead.");
}
