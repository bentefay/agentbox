import * as fs from "fs";
import * as path from "path";

import { AgentboxConfigSchema } from "./config";
import type { AgentboxConfig } from "./config";
import { exec, errorMessage } from "./exec";
import { Ok, Err } from "./result";
import type { Result } from "./result";

export type RepoPath = string & { readonly __brand: "RepoPath" };

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
        rejectOnNonZeroExit: false,
    });
    if (result.code === 0 && result.stdout.trim()) {
        // This is the ONE allowed cast — the branded type smart constructor pattern
        return Ok(result.stdout.trim() as RepoPath);
    }
    return Err("Not inside a git repository. Run agentbox from your project root.");
}
