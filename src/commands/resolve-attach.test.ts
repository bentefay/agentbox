import { describe, expect, it } from "bun:test";

import type { AgentboxConfig, TmuxMode } from "../lib/config";
import type { AgentName, RepoPath, GitContext } from "../lib/git";
import type { AttachState } from "./resolve-attach";
import { determineAttachAction } from "./resolve-attach";

// ============================================================================
// Helpers
// ============================================================================

const testAgent = "my-agent" as AgentName;
const testGitContext: GitContext = { kind: "repo", root: "/tmp/test-repo" as RepoPath };

function minimalTmuxMode(name: string): TmuxMode {
    return { name, windows: [] };
}

function minimalConfig(tmuxModes: readonly TmuxMode[] = []): AgentboxConfig {
    return {
        tmuxModes: [...tmuxModes],
        dependencyStrategies: [],
    };
}

function baseState(overrides: Partial<AttachState> = {}): AttachState {
    return {
        tmuxAvailable: true,
        hasSession: false,
        worktreeExists: true,
        configResult: minimalConfig(),
        modeResult: { ok: true, value: undefined },
        agentName: testAgent,
        gitContext: testGitContext,
        trust: false,
        untrusted: false,
        modeName: undefined,
        ...overrides,
    };
}

// ============================================================================
// determineAttachAction
// ============================================================================

describe("determineAttachAction", () => {
    it("returns error when tmux is not installed", () => {
        const result = determineAttachAction(baseState({ tmuxAvailable: false }));
        expect(result).toEqual({
            kind: "error",
            message: "tmux not found. Please install tmux first.",
        });
    });

    describe("session exists", () => {
        it("returns reattach with no mode when modeName is not specified", () => {
            const result = determineAttachAction(baseState({ hasSession: true }));
            expect(result).toEqual({
                kind: "reattach",
                agentName: testAgent,
                mode: undefined,
                config: undefined,
                gitContext: testGitContext,
            });
        });

        it("returns reattach with mode when modeName specified and config loaded", () => {
            const mode = minimalTmuxMode("core");
            const config = minimalConfig([mode]);
            const result = determineAttachAction(
                baseState({
                    hasSession: true,
                    modeName: "core",
                    configResult: config,
                    modeResult: { ok: true, value: mode },
                })
            );
            expect(result).toEqual({
                kind: "reattach",
                agentName: testAgent,
                mode,
                config,
                gitContext: testGitContext,
            });
        });

        it("returns error when modeName specified but config failed to load", () => {
            const result = determineAttachAction(
                baseState({
                    hasSession: true,
                    modeName: "core",
                    configResult: null,
                })
            );
            expect(result).toEqual({ kind: "error", message: "Failed to load config" });
        });

        it("returns error when modeName specified but mode not found", () => {
            const config = minimalConfig([minimalTmuxMode("core")]);
            const result = determineAttachAction(
                baseState({
                    hasSession: true,
                    modeName: "missing",
                    configResult: config,
                    modeResult: { ok: false, error: "Unknown tmux mode: missing. Available: core" },
                })
            );
            expect(result).toEqual({
                kind: "error",
                message: "Unknown tmux mode: missing. Available: core",
            });
        });
    });

    describe("no session", () => {
        it("returns error with create hint when worktree is missing", () => {
            const result = determineAttachAction(
                baseState({
                    hasSession: false,
                    worktreeExists: false,
                })
            );
            expect(result).toEqual({
                kind: "error",
                message: `Agent ${testAgent} not found. Create with: agentbox new ${testAgent}`,
            });
        });

        it("returns restore when worktree exists and config loaded", () => {
            const config = minimalConfig();
            const result = determineAttachAction(
                baseState({
                    hasSession: false,
                    worktreeExists: true,
                    configResult: config,
                    trust: true,
                })
            );
            expect(result).toEqual({
                kind: "restore",
                agentName: testAgent,
                config,
                gitContext: testGitContext,
                mode: undefined,
                trust: true,
                untrusted: false,
            });
        });

        it("returns restore with mode when worktree exists and mode specified", () => {
            const mode = minimalTmuxMode("full");
            const config = minimalConfig([mode]);
            const result = determineAttachAction(
                baseState({
                    hasSession: false,
                    worktreeExists: true,
                    configResult: config,
                    modeName: "full",
                    modeResult: { ok: true, value: mode },
                    trust: false,
                })
            );
            expect(result).toEqual({
                kind: "restore",
                agentName: testAgent,
                config,
                gitContext: testGitContext,
                mode,
                trust: false,
                untrusted: false,
            });
        });

        it("returns error when worktree exists but config failed to load", () => {
            const result = determineAttachAction(
                baseState({
                    hasSession: false,
                    worktreeExists: true,
                    configResult: null,
                })
            );
            expect(result).toEqual({ kind: "error", message: "Failed to load config" });
        });

        it("returns error when worktree exists but mode resolution failed", () => {
            const config = minimalConfig([minimalTmuxMode("core")]);
            const result = determineAttachAction(
                baseState({
                    hasSession: false,
                    worktreeExists: true,
                    configResult: config,
                    modeName: "bad",
                    modeResult: { ok: false, error: "Unknown tmux mode: bad. Available: core" },
                })
            );
            expect(result).toEqual({
                kind: "error",
                message: "Unknown tmux mode: bad. Available: core",
            });
        });

        it("passes trust and untrusted flags through to restore result", () => {
            const config = minimalConfig();
            const resultTrusted = determineAttachAction(
                baseState({
                    hasSession: false,
                    worktreeExists: true,
                    configResult: config,
                    trust: true,
                    untrusted: false,
                })
            );
            const resultUntrusted = determineAttachAction(
                baseState({
                    hasSession: false,
                    worktreeExists: true,
                    configResult: config,
                    trust: false,
                    untrusted: true,
                })
            );
            expect(resultTrusted.kind).toBe("restore");
            expect(resultUntrusted.kind).toBe("restore");
            if (resultTrusted.kind === "restore" && resultUntrusted.kind === "restore") {
                expect(resultTrusted.trust).toBe(true);
                expect(resultTrusted.untrusted).toBe(false);
                expect(resultUntrusted.trust).toBe(false);
                expect(resultUntrusted.untrusted).toBe(true);
            }
        });
    });
});
