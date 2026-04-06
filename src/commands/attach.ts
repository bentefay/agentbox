import * as p from "@clack/prompts";
import { match } from "ts-pattern";

import {
    createAgentContext,
    setupAgentTmux,
    startAndSetupAgent,
    handleLifecycleError,
    getAgentState,
    logBackendFallback,
} from "../lib/agent";
import { getAgentPaths } from "../lib/git";
import { switchOrAttach, sanitizeSessionName } from "../lib/tmux";
import { resolveAttachArgs } from "./resolve-attach";
import { ensureHostPreparation } from "./resolve-new";

export async function cmdAttach(
    name?: string,
    modeName?: string,
    trust = false,
    untrusted = false,
    noFocus = false
): Promise<number> {
    const resolved = await resolveAttachArgs(name, modeName, trust, untrusted);

    const focus = async (session: import("../lib/tmux").SessionName): Promise<number> => {
        if (noFocus) return 0;
        const attachResult = await switchOrAttach(session);
        if (!attachResult.ok) {
            p.log.error(attachResult.error);
            return 1;
        }
        return 0;
    };

    return match(resolved)
        .with({ kind: "reattach" }, async (r) => {
            if (r.mode != null && r.config != null) {
                const ctx = await createAgentContext(r.agentName, r.gitContext, r.config);
                const tmuxResult = await setupAgentTmux(ctx, r.mode);
                if (!tmuxResult.ok) {
                    p.log.error(tmuxResult.error);
                    return 1;
                }
                return focus(tmuxResult.value);
            }
            return focus(sanitizeSessionName(r.agentName));
        })
        .with({ kind: "restore" }, async (r) => {
            p.intro(`agent · attach · ${r.agentName}`);

            const agentState = await getAgentState(r.agentName);
            if (agentState.kind !== "running") {
                const paths = getAgentPaths(r.gitContext, r.agentName);
                const prepResult = await ensureHostPreparation(
                    r.config,
                    r.gitContext.root,
                    paths.worktree,
                    r.trust,
                    r.untrusted
                );
                if (!prepResult.ok) {
                    p.outro("Aborted");
                    return 1;
                }
            }

            await logBackendFallback();
            const ctx = await createAgentContext(r.agentName, r.gitContext, r.config);

            const result = await startAndSetupAgent(ctx, r.mode);
            if (!result.ok) return handleLifecycleError(result.error);

            return focus(result.value);
        })
        .with({ kind: "cancelled" }, () => {
            p.outro("Aborted");
            return 0;
        })
        .with({ kind: "no-agents" }, (r) => {
            p.log.info(r.message);
            return 0;
        })
        .with({ kind: "error" }, (r) => {
            p.log.error(r.message);
            return 1;
        })
        .exhaustive();
}
