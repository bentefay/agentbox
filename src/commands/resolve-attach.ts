import * as fs from "fs";

import { match } from "ts-pattern";

import type { AgentboxConfig, TmuxMode } from "../lib/config";
import type { AgentName, RepoPath } from "../lib/git";
import { getAgentPaths } from "../lib/git";
import { getRepoPath } from "../lib/loader";
import type { Result } from "../lib/result";
import { isTmuxInstalled, sessionExists, sanitizeSessionName } from "../lib/tmux";
import { resolveAgentName } from "./resolve-agent";
import { resolveConfig } from "./resolve-config";
import { resolveMode } from "./resolve-new";

export type ResolvedAttachArgs =
    | {
          readonly kind: "reattach";
          readonly agentName: AgentName;
          readonly mode: TmuxMode | undefined;
          readonly config: AgentboxConfig | undefined;
          readonly repoPath: RepoPath;
      }
    | {
          readonly kind: "restore";
          readonly agentName: AgentName;
          readonly config: AgentboxConfig;
          readonly repoPath: RepoPath;
          readonly mode: TmuxMode | undefined;
          readonly trust: boolean;
          readonly untrusted: boolean;
      }
    | { readonly kind: "cancelled" }
    | { readonly kind: "no-agents"; readonly message: string }
    | { readonly kind: "error"; readonly message: string };

/**
 * Pre-fetched state gathered by the orchestrator before calling the pure decision function.
 * Separates I/O from logic so `determineAttachAction` is fully testable.
 */
export interface AttachState {
    readonly tmuxAvailable: boolean;
    readonly hasSession: boolean;
    readonly worktreeExists: boolean;
    readonly configResult: AgentboxConfig | null;
    readonly modeResult: Result<TmuxMode | undefined, string>;
    readonly agentName: AgentName;
    readonly repoPath: RepoPath;
    readonly trust: boolean;
    readonly untrusted: boolean;
    readonly modeName: string | undefined;
}

/**
 * Pure decision function: given fully-resolved state, determine the attach action.
 * No I/O — all side-effects are handled by the orchestrator that builds AttachState.
 */
export function determineAttachAction(state: AttachState): ResolvedAttachArgs {
    if (!state.tmuxAvailable) {
        return { kind: "error", message: "tmux not found. Please install tmux first." };
    }

    if (state.hasSession) {
        // Session exists — optionally apply mode windows, then reattach
        if (state.modeName != null) {
            if (state.configResult == null) {
                return { kind: "error", message: "Failed to load config" };
            }
            if (!state.modeResult.ok) {
                return { kind: "error", message: state.modeResult.error };
            }
            return {
                kind: "reattach",
                agentName: state.agentName,
                mode: state.modeResult.value,
                config: state.configResult,
                repoPath: state.repoPath,
            };
        }
        return {
            kind: "reattach",
            agentName: state.agentName,
            mode: undefined,
            config: undefined,
            repoPath: state.repoPath,
        };
    }

    // No session — check worktree exists
    if (!state.worktreeExists) {
        return {
            kind: "error",
            message: `Agent ${state.agentName} not found. Create with: agentbox new ${state.agentName}`,
        };
    }

    // Full restore path — config is required
    if (state.configResult == null) {
        return { kind: "error", message: "Failed to load config" };
    }
    if (!state.modeResult.ok) {
        return { kind: "error", message: state.modeResult.error };
    }

    return {
        kind: "restore",
        agentName: state.agentName,
        config: state.configResult,
        repoPath: state.repoPath,
        mode: state.modeResult.value,
        trust: state.trust,
        untrusted: state.untrusted,
    };
}

/**
 * Resolve all arguments and state needed for the `attach` command.
 * Gathers I/O into AttachState, then delegates to the pure `determineAttachAction`.
 */
export async function resolveAttachArgs(
    name: string | undefined,
    modeName: string | undefined,
    trust: boolean,
    untrusted: boolean
): Promise<ResolvedAttachArgs> {
    const repoPathResult = await getRepoPath();
    if (!repoPathResult.ok) {
        return { kind: "error", message: repoPathResult.error };
    }
    const repoPath = repoPathResult.value;

    const agentResult = await resolveAgentName(name, repoPath, "Select agent to attach");
    if (!agentResult.ok) {
        return match(agentResult.error)
            .with({ kind: "no-agents" }, () => ({
                kind: "no-agents" as const,
                message: "No agents available. Create one with: agentbox new",
            }))
            .with({ kind: "cancelled" }, () => ({ kind: "cancelled" as const }))
            .with({ kind: "error" }, (e) => ({ kind: "error" as const, message: e.message }))
            .exhaustive();
    }
    const agentName = agentResult.value;

    const tmuxAvailable = await isTmuxInstalled();
    const hasSession = tmuxAvailable ? await sessionExists(sanitizeSessionName(agentName)) : false;

    const paths = getAgentPaths(repoPath, agentName);
    const worktreeExists = fs.existsSync(paths.worktree);

    // Load config only when needed (mode specified or restore path)
    const needsConfig = modeName != null || (!hasSession && worktreeExists);
    const configResult = needsConfig ? ((await resolveConfig())?.config ?? null) : null;

    const modeResult: Result<TmuxMode | undefined, string> =
        configResult != null ? resolveMode(modeName, configResult) : { ok: true, value: undefined };

    return determineAttachAction({
        tmuxAvailable,
        hasSession,
        worktreeExists,
        configResult,
        modeResult,
        agentName,
        repoPath,
        trust,
        untrusted,
        modeName,
    });
}
