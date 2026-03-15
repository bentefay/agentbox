import * as p from "@clack/prompts";

import type { AgentboxConfig, TmuxMode } from "../config";
import type { AgentName, BareRepoPath, RepoPath } from "../git";
import { parseAgentName, fetchLatestRefs } from "../git";
import type { Result } from "../result";
import { Ok, Err } from "../result";
import { detectStrategies, runHostPrepare } from "../strategies";
import { promptForAgentBranch, promptForBaseBranch } from "./branch-prompts";

/**
 * Resolve a tmux mode name to a TmuxMode from config.
 * Returns undefined when no mode name is given, or an error for unknown modes.
 */
export function resolveMode(
    modeName: string | undefined,
    config: AgentboxConfig
): Result<TmuxMode | undefined, string> {
    if (!modeName) return Ok(undefined);
    const found = config.tmuxModes.find((m) => m.name === modeName);
    if (!found) {
        return Err(
            `Unknown tmux mode: ${modeName}. Available: ${config.tmuxModes.map((m) => m.name).join(", ")}`
        );
    }
    return Ok(found);
}

export type ResolvedNewArgs =
    | {
          readonly kind: "resolved";
          readonly agentName: AgentName;
          readonly baseBranch: string | undefined;
          readonly tmuxMode: TmuxMode | undefined;
      }
    | { readonly kind: "cancelled" }
    | { readonly kind: "error"; readonly message: string };

/**
 * Handles all interactive prompts and validation for the `new` command:
 * git fetch, branch selection, base branch selection, mode selection.
 * Returns a discriminated union so the caller can match exhaustively.
 */
export async function resolveNewArgs(
    opts: {
        readonly branch?: string;
        readonly base?: string;
        readonly mode?: string;
        readonly noTmux: boolean;
    },
    config: AgentboxConfig,
    repoPath: RepoPath,
    bareRepoPath: BareRepoPath | null
): Promise<ResolvedNewArgs> {
    // Step 1: Resolve branch name and base branch (interactive if not provided)
    const branchStep = await resolveBranchAndBase(opts.branch, opts.base, repoPath, bareRepoPath);
    if (branchStep.kind !== "resolved") return branchStep;

    // Step 2: Parse and validate the agent name
    const parseResult = parseAgentName(branchStep.rawAgentName);
    if (!parseResult.ok) {
        return { kind: "error", message: parseResult.error };
    }
    const agentName: AgentName = parseResult.value;

    // Step 3: Resolve tmux mode (interactive if not provided)
    const tmuxStep = await resolveTmuxMode(opts.mode, opts.noTmux, config);
    if (tmuxStep.kind !== "resolved") return tmuxStep;

    return {
        kind: "resolved",
        agentName,
        baseBranch: branchStep.baseBranch,
        tmuxMode: tmuxStep.tmuxMode,
    };
}

type BranchStepResult =
    | {
          readonly kind: "resolved";
          readonly rawAgentName: string;
          readonly baseBranch: string | undefined;
      }
    | { readonly kind: "cancelled" }
    | { readonly kind: "error"; readonly message: string };

async function resolveBranchAndBase(
    branch: string | undefined,
    base: string | undefined,
    repoPath: RepoPath,
    bareRepoPath: BareRepoPath | null
): Promise<BranchStepResult> {
    if (branch) {
        return { kind: "resolved", rawAgentName: branch, baseBranch: base };
    }

    const fetchSpinner = p.spinner();
    fetchSpinner.start("Fetching latest branches...");
    await fetchLatestRefs(repoPath, bareRepoPath);
    fetchSpinner.stop("Branches up to date");

    const branchResult = await promptForAgentBranch(
        "New or existing git branch (determines worktree branch and agent name)",
        repoPath,
        bareRepoPath
    );
    if (p.isCancel(branchResult)) {
        p.outro("Aborted");
        return { kind: "cancelled" };
    }

    // Prompt for base branch when creating a new (non-existing) branch
    if (!base && !branchResult.isExisting) {
        const baseResult = await promptForBaseBranch(repoPath);
        if (baseResult == null) {
            p.outro("Aborted");
            return { kind: "cancelled" };
        }
        return { kind: "resolved", rawAgentName: branchResult.branch, baseBranch: baseResult };
    }

    return { kind: "resolved", rawAgentName: branchResult.branch, baseBranch: base };
}

type TmuxStepResult =
    | { readonly kind: "resolved"; readonly tmuxMode: TmuxMode | undefined }
    | { readonly kind: "cancelled" }
    | { readonly kind: "error"; readonly message: string };

async function resolveTmuxMode(
    mode: string | undefined,
    noTmux: boolean,
    config: AgentboxConfig
): Promise<TmuxStepResult> {
    const modeResult = resolveMode(mode, config);
    if (!modeResult.ok) return { kind: "error", message: modeResult.error };

    if (!mode && !noTmux && config.tmuxModes.length > 0) {
        const selection = await p.select({
            message: "tmux mode",
            options: [
                { value: "__none__", label: "none (shell only)" },
                ...config.tmuxModes.map((m) => ({
                    value: m.name,
                    label: m.name,
                    hint: `${m.windows.length} window${m.windows.length === 1 ? "" : "s"}`,
                })),
            ],
        });
        if (p.isCancel(selection)) {
            p.outro("Aborted");
            return { kind: "cancelled" };
        }
        const selectedMode =
            selection === "__none__"
                ? undefined
                : config.tmuxModes.find((m) => m.name === selection);
        return { kind: "resolved", tmuxMode: selectedMode };
    }

    return { kind: "resolved", tmuxMode: modeResult.value };
}

/**
 * Pure function to build the reinvoke command arguments for tmux re-entry.
 */
export function buildReinvokeArgs(
    selfPath: string,
    agentName: AgentName,
    baseBranch: string | undefined,
    tmuxMode: TmuxMode | undefined,
    useLocalBranch: boolean,
    trusted: boolean
): readonly string[] {
    return [
        selfPath,
        "new",
        agentName,
        ...(baseBranch ? [baseBranch] : []),
        ...(tmuxMode ? ["-m", tmuxMode.name] : []),
        ...(useLocalBranch ? ["--use-local-branch"] : []),
        trusted ? "--trust" : "--untrusted",
    ];
}

/**
 * Resolve the `--trust` / `--untrusted` flags into a `trusted` boolean.
 * When neither flag is set, prompts the user; declining yields `false` (untrusted mode).
 */
export async function resolveTrust(trust: boolean, untrusted: boolean): Promise<boolean> {
    if (trust) return true;
    if (untrusted) return false;

    const trustResult = await p.confirm({
        message:
            "Trust this environment? Untrusted mode skips running unsafe operations on your host computer.",
        initialValue: true,
    });
    if (p.isCancel(trustResult) || !trustResult) {
        return false;
    }
    return true;
}

/**
 * Shared trust confirmation and host-side dependency preparation.
 * Resolves trust from flags, detects strategies if none are configured,
 * and runs host-side preparation for each strategy.
 *
 * Returns Ok with the resolved `trusted` boolean on success.
 */
export async function ensureHostPreparation(
    config: AgentboxConfig,
    repoPath: RepoPath,
    worktreePath: string,
    trust: boolean,
    untrusted: boolean
): Promise<Result<boolean, string>> {
    const trusted = await resolveTrust(trust, untrusted);

    const strategies =
        config.dependencyStrategies.length > 0
            ? config.dependencyStrategies
            : await detectStrategies(repoPath);
    const prepareResult = await runHostPrepare(
        { trusted, logWarning: (msg) => p.log.warn(msg) },
        strategies,
        repoPath,
        worktreePath
    );
    if (!prepareResult.ok) return Err(prepareResult.error);
    return Ok(trusted);
}
