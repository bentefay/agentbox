import { describe, expect, it } from "bun:test";

import type { AgentName } from "../git";
import type { StopState } from "./resolve-stop";
import { determineStopAction } from "./resolve-stop";

// ============================================================================
// Helpers
// ============================================================================

const testAgent = "my-agent" as AgentName;

function baseState(overrides: Partial<StopState> = {}): StopState {
    return {
        agentName: testAgent,
        agentState: { kind: "running" },
        hasSession: true,
        hasWorktree: true,
        ...overrides,
    };
}

// ============================================================================
// determineStopAction
// ============================================================================

describe("determineStopAction", () => {
    it("returns not-found when nothing exists", () => {
        const result = determineStopAction(
            baseState({
                agentState: { kind: "not-found" },
                hasSession: false,
                hasWorktree: false,
            })
        );
        expect(result).toEqual({ kind: "not-found" });
    });

    describe("running container", () => {
        it("returns stop-container when container is running", () => {
            const result = determineStopAction(
                baseState({
                    agentState: { kind: "running" },
                    hasSession: true,
                    hasWorktree: true,
                })
            );
            expect(result).toEqual({
                kind: "stop-container",
                agentName: testAgent,
                hasSession: true,
                hasWorktree: true,
            });
        });

        it("passes through hasSession=false correctly", () => {
            const result = determineStopAction(
                baseState({
                    agentState: { kind: "running" },
                    hasSession: false,
                    hasWorktree: true,
                })
            );
            expect(result).toEqual({
                kind: "stop-container",
                agentName: testAgent,
                hasSession: false,
                hasWorktree: true,
            });
        });

        it("passes through hasWorktree=false correctly", () => {
            const result = determineStopAction(
                baseState({
                    agentState: { kind: "running" },
                    hasSession: true,
                    hasWorktree: false,
                })
            );
            expect(result).toEqual({
                kind: "stop-container",
                agentName: testAgent,
                hasSession: true,
                hasWorktree: false,
            });
        });
    });

    describe("stopped container", () => {
        it("returns already-stopped when container is stopped", () => {
            const result = determineStopAction(
                baseState({
                    agentState: { kind: "stopped" },
                    hasSession: true,
                    hasWorktree: true,
                })
            );
            expect(result).toEqual({
                kind: "already-stopped",
                agentName: testAgent,
                hasSession: true,
                hasWorktree: true,
            });
        });

        it("passes through flags when stopped with no session", () => {
            const result = determineStopAction(
                baseState({
                    agentState: { kind: "stopped" },
                    hasSession: false,
                    hasWorktree: true,
                })
            );
            expect(result).toEqual({
                kind: "already-stopped",
                agentName: testAgent,
                hasSession: false,
                hasWorktree: true,
            });
        });
    });

    describe("no container", () => {
        it("returns no-container when only session exists", () => {
            const result = determineStopAction(
                baseState({
                    agentState: { kind: "not-found" },
                    hasSession: true,
                    hasWorktree: false,
                })
            );
            expect(result).toEqual({
                kind: "no-container",
                agentName: testAgent,
                hasSession: true,
                hasWorktree: false,
            });
        });

        it("returns no-container when only worktree exists", () => {
            const result = determineStopAction(
                baseState({
                    agentState: { kind: "not-found" },
                    hasSession: false,
                    hasWorktree: true,
                })
            );
            expect(result).toEqual({
                kind: "no-container",
                agentName: testAgent,
                hasSession: false,
                hasWorktree: true,
            });
        });

        it("returns no-container when both session and worktree exist", () => {
            const result = determineStopAction(
                baseState({
                    agentState: { kind: "not-found" },
                    hasSession: true,
                    hasWorktree: true,
                })
            );
            expect(result).toEqual({
                kind: "no-container",
                agentName: testAgent,
                hasSession: true,
                hasWorktree: true,
            });
        });
    });

    it("preserves agentName from state", () => {
        const customAgent = "custom-agent" as AgentName;
        const result = determineStopAction(
            baseState({
                agentName: customAgent,
                agentState: { kind: "running" },
            })
        );
        expect(result).toEqual({
            kind: "stop-container",
            agentName: customAgent,
            hasSession: true,
            hasWorktree: true,
        });
    });
});
