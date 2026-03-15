import { describe, expect, it } from "bun:test";

import type { AgentboxConfig, TmuxMode } from "../config";
import type { AgentName } from "../git";
import { buildReinvokeArgs, resolveMode } from "./resolve-new";

// ============================================================================
// Helpers
// ============================================================================

const testAgent = "my-agent" as AgentName;
const selfPath = "/usr/local/bin/agentbox";

function minimalTmuxMode(name: string): TmuxMode {
    return { name, windows: [] };
}

function minimalConfig(tmuxModes: readonly TmuxMode[] = []): AgentboxConfig {
    return {
        tmuxModes: [...tmuxModes],
        dependencyStrategies: [],
    };
}

// ============================================================================
// buildReinvokeArgs
// ============================================================================

describe("buildReinvokeArgs", () => {
    it("produces base args with --trust when trusted", () => {
        const args = buildReinvokeArgs(selfPath, testAgent, undefined, undefined, false, true);
        expect(args).toEqual([selfPath, "new", "my-agent", "--trust"]);
    });

    it("produces base args with --untrusted when not trusted", () => {
        const args = buildReinvokeArgs(selfPath, testAgent, undefined, undefined, false, false);
        expect(args).toEqual([selfPath, "new", "my-agent", "--untrusted"]);
    });

    it("includes baseBranch as positional arg after agentName", () => {
        const args = buildReinvokeArgs(selfPath, testAgent, "main", undefined, false, true);
        expect(args).toEqual([selfPath, "new", "my-agent", "main", "--trust"]);
    });

    it("includes -m flag when tmuxMode is provided", () => {
        const mode = minimalTmuxMode("core");
        const args = buildReinvokeArgs(selfPath, testAgent, undefined, mode, false, true);
        expect(args).toEqual([selfPath, "new", "my-agent", "-m", "core", "--trust"]);
    });

    it("includes --use-local-branch when useLocalBranch is true", () => {
        const args = buildReinvokeArgs(selfPath, testAgent, undefined, undefined, true, true);
        expect(args).toEqual([selfPath, "new", "my-agent", "--use-local-branch", "--trust"]);
    });

    it("includes all options in correct order when combined", () => {
        const mode = minimalTmuxMode("full");
        const args = buildReinvokeArgs(selfPath, testAgent, "develop", mode, true, true);
        expect(args).toEqual([
            selfPath,
            "new",
            "my-agent",
            "develop",
            "-m",
            "full",
            "--use-local-branch",
            "--trust",
        ]);
    });

    it("always includes trust flag as the last argument", () => {
        const cases = [
            buildReinvokeArgs(selfPath, testAgent, undefined, undefined, false, true),
            buildReinvokeArgs(selfPath, testAgent, "main", undefined, false, true),
            buildReinvokeArgs(selfPath, testAgent, undefined, minimalTmuxMode("x"), false, false),
            buildReinvokeArgs(selfPath, testAgent, undefined, undefined, true, true),
            buildReinvokeArgs(selfPath, testAgent, "main", minimalTmuxMode("x"), true, false),
        ];
        for (const args of cases) {
            const last = args[args.length - 1];
            expect(last === "--trust" || last === "--untrusted").toBe(true);
        }
    });

    it("uses the selfPath verbatim as the first element", () => {
        const customPath = "/some/other/path/agentbox";
        const args = buildReinvokeArgs(customPath, testAgent, undefined, undefined, false, true);
        expect(args[0]).toBe(customPath);
    });

    it("uses the agentName string directly as the branch argument", () => {
        const agent = "feature-branch-123" as AgentName;
        const args = buildReinvokeArgs(selfPath, agent, undefined, undefined, false, true);
        expect(args[2]).toBe("feature-branch-123");
    });
});

// ============================================================================
// resolveMode
// ============================================================================

describe("resolveMode", () => {
    it("returns ok with undefined mode when no mode name is given", () => {
        const result = resolveMode(undefined, minimalConfig());
        expect(result).toEqual({ ok: true, value: undefined });
    });

    it("returns ok with the matching TmuxMode when mode is found", () => {
        const core = minimalTmuxMode("core");
        const full = minimalTmuxMode("full");
        const config = minimalConfig([core, full]);
        const result = resolveMode("core", config);
        expect(result).toEqual({ ok: true, value: core });
    });

    it("returns error when mode name is not in config", () => {
        const config = minimalConfig([minimalTmuxMode("core")]);
        const result = resolveMode("missing", config);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toContain("Unknown tmux mode: missing");
            expect(result.error).toContain("core");
        }
    });

    it("returns ok with undefined mode for empty string", () => {
        const config = minimalConfig([minimalTmuxMode("core")]);
        const result = resolveMode("", config);
        expect(result).toEqual({ ok: true, value: undefined });
    });
});
