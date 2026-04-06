import * as p from "@clack/prompts";
import { match } from "ts-pattern";

import type { AgentName, GitContext } from "../lib/git";
import { parseAgentName } from "../lib/git";
import { detectGitContext } from "../lib/loader";
import type { Result } from "../lib/result";
import { Ok, Err, collectResults } from "../lib/result";
import type { AgentInfo } from "./agent-info";
import { listAgentsWithState, agentStatusHint } from "./agent-info";

export type ResolveError =
    | { readonly kind: "no-agents" }
    | { readonly kind: "cancelled" }
    | { readonly kind: "error"; readonly message: string };

export type ResolveResult = Result<AgentName, ResolveError>;

export type ResolveNamesResult = Result<readonly AgentName[], ResolveError>;

export function parseAgentNames(rawNames: readonly string[]): ResolveNamesResult {
    const collected = collectResults(rawNames.map(parseAgentName));
    return collected.ok ? Ok(collected.value) : Err({ kind: "error", message: collected.error });
}

export type PickAgentError = { readonly kind: "no-agents" } | { readonly kind: "cancelled" };

export type PickAgentResult = Result<AgentName, PickAgentError>;

/** Filter agents to only those with a valid parsed AgentName. */
export function agentsWithValidNames(
    agents: readonly AgentInfo[]
): readonly (AgentInfo & { readonly agentName: AgentName })[] {
    return agents.filter(
        (a): a is AgentInfo & { readonly agentName: AgentName } => a.agentName != null
    );
}

export async function pickAgent(gitContext: GitContext, message: string): Promise<PickAgentResult> {
    const allAgents = await listAgentsWithState(gitContext);
    const agents = agentsWithValidNames(allAgents);
    if (agents.length === 0) return Err({ kind: "no-agents" });

    const options = agents.map((a) => ({
        value: a.agentName,
        label: a.name,
        hint: agentStatusHint(a),
    }));

    const result = await p.select({ message, options });
    if (p.isCancel(result)) return Err({ kind: "cancelled" });
    return Ok(result);
}

/**
 * Resolve an agent name from a raw CLI argument or interactive picker.
 * Returns a discriminated union so callers can exhaustively handle each case.
 */
export async function resolveAgentName(
    rawName: string | undefined,
    gitContext: GitContext,
    promptMessage: string
): Promise<ResolveResult> {
    if (rawName != null) {
        const parsed = parseAgentName(rawName);
        return parsed.ok ? Ok(parsed.value) : Err({ kind: "error", message: parsed.error });
    }
    return pickAgent(gitContext, promptMessage);
}

/**
 * Resolve multiple agent names from CLI arguments or interactive multi-select.
 * Returns a discriminated union so callers can exhaustively handle each case.
 */
export async function resolveAgentNames(
    rawNames: readonly string[],
    gitContext: GitContext
): Promise<ResolveNamesResult> {
    if (rawNames.length > 0) {
        return parseAgentNames(rawNames);
    }

    const allAgents = await listAgentsWithState(gitContext);
    const agents = agentsWithValidNames(allAgents);
    if (agents.length === 0) return Err({ kind: "no-agents" });

    const options = agents.map((a) => ({
        value: a.agentName,
        label: a.name,
        hint: agentStatusHint(a),
    }));
    const selected = await p.multiselect({
        message: "Select agents to remove",
        options,
        required: true,
    });
    if (p.isCancel(selected)) return Err({ kind: "cancelled" });

    return Ok(selected);
}

/**
 * Handle a ResolveError by displaying the appropriate message and returning an exit code.
 * Shared by `withResolvedAgent` and `withResolvedAgentNames` to avoid duplicating the match block.
 */
export function handleResolveError(error: ResolveError, noAgentsMessage: string): number {
    return match(error)
        .with({ kind: "no-agents" }, () => {
            p.log.info(noAgentsMessage);
            return 0;
        })
        .with({ kind: "cancelled" }, () => {
            p.outro("Aborted");
            return 0;
        })
        .with({ kind: "error" }, (r) => {
            p.log.error(r.message);
            return 1;
        })
        .exhaustive();
}

/**
 * Resolve the git context, displaying an error and returning exit code 1 on failure.
 * Convenience wrapper for commands that only need the git context (e.g. list, cache).
 */
export async function withGitContext(
    onOk: (gitContext: GitContext) => Promise<number>
): Promise<number> {
    const ctxResult = await detectGitContext();
    if (!ctxResult.ok) {
        p.log.error(ctxResult.error);
        return 1;
    }
    return onOk(ctxResult.value);
}

/**
 * Higher-order helper that resolves a single agent name (from CLI arg or interactive picker),
 * handles the common error/cancel/no-agents cases, and delegates the `ok` branch to the caller.
 * Internally resolves the git context so callers don't need to.
 */
export async function withResolvedAgent(
    rawName: string | undefined,
    promptMessage: string,
    onOk: (name: AgentName, gitContext: GitContext) => Promise<number>,
    noAgentsMessage = "No agents available"
): Promise<number> {
    const ctxResult = await detectGitContext();
    if (!ctxResult.ok) {
        p.log.error(ctxResult.error);
        return 1;
    }
    const gitContext = ctxResult.value;
    const resolved = await resolveAgentName(rawName, gitContext, promptMessage);
    if (resolved.ok) return onOk(resolved.value, gitContext);
    return handleResolveError(resolved.error, noAgentsMessage);
}

/**
 * Higher-order helper that resolves multiple agent names (from CLI args or interactive multi-select),
 * handles the common error/cancel/no-agents cases, and delegates the `ok` branch to the caller.
 * Internally resolves the git context so callers don't need to.
 */
export async function withResolvedAgentNames(
    rawNames: readonly string[],
    onOk: (names: readonly AgentName[], gitContext: GitContext) => Promise<number>,
    noAgentsMessage = "No agents to remove"
): Promise<number> {
    const ctxResult = await detectGitContext();
    if (!ctxResult.ok) {
        p.log.error(ctxResult.error);
        return 1;
    }
    const gitContext = ctxResult.value;
    const resolved = await resolveAgentNames(rawNames, gitContext);
    if (resolved.ok) return onOk(resolved.value, gitContext);
    return handleResolveError(resolved.error, noAgentsMessage);
}
