import { describe, expect, it } from "bun:test";

import type { AgentName } from "../git";
import { parseAgentName } from "../git";
import type { AgentInfo } from "./agent-info";
import type { ResolveError } from "./resolve-agent";
import { parseAgentNames, agentsWithValidNames, handleResolveError } from "./resolve-agent";

// ============================================================================
// Helpers
// ============================================================================

const name = (s: string) => {
    const r = parseAgentName(s);
    if (!r.ok) throw new Error(`bad test name: ${s}`);
    return r.value;
};

function makeAgentInfo(overrides: Partial<AgentInfo> = {}): AgentInfo {
    return {
        name: "test-agent",
        agentName: "test-agent" as AgentName,
        branch: "feature/test",
        path: "/tmp/test",
        containerState: { kind: "running" },
        hasTmuxSession: false,
        ports: [],
        ...overrides,
    };
}

// ============================================================================
// parseAgentNames
// ============================================================================

describe("parseAgentNames", () => {
    it("returns Ok with parsed names for valid inputs", () => {
        const result = parseAgentNames(["agent-one", "agent-two"]);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value).toEqual([name("agent-one"), name("agent-two")]);
        }
    });

    it("returns Ok for a single valid name", () => {
        const result = parseAgentNames(["my-agent"]);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value).toEqual([name("my-agent")]);
        }
    });

    it("returns Ok for an empty array", () => {
        const result = parseAgentNames([]);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value).toEqual([]);
        }
    });

    it("returns Err when any name is invalid", () => {
        const result = parseAgentNames(["valid-name", "invalid name with spaces"]);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.kind).toBe("error");
        }
    });

    it("returns Err with the first invalid name's error", () => {
        const result = parseAgentNames(["bad name!", "also bad"]);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.kind).toBe("error");
            if (result.error.kind === "error") {
                expect(result.error.message).toContain("bad name!");
            }
        }
    });

    it("rejects names with special characters", () => {
        const result = parseAgentNames(["agent@home"]);
        expect(result.ok).toBe(false);
    });

    it("accepts alphanumeric names with hyphens", () => {
        const result = parseAgentNames(["abc-123", "A-B-C"]);
        expect(result.ok).toBe(true);
    });

    it("rejects names longer than 63 characters", () => {
        const longName = "a".repeat(64);
        const result = parseAgentNames([longName]);
        expect(result.ok).toBe(false);
    });

    it("accepts names exactly 63 characters long", () => {
        const maxName = "a".repeat(63);
        const result = parseAgentNames([maxName]);
        expect(result.ok).toBe(true);
    });
});

// ============================================================================
// agentsWithValidNames
// ============================================================================

describe("agentsWithValidNames", () => {
    it("returns agents that have a non-null agentName", () => {
        const agents = [
            makeAgentInfo({ name: "valid", agentName: "valid" as AgentName }),
            makeAgentInfo({ name: "also-valid", agentName: "also-valid" as AgentName }),
        ];
        const result = agentsWithValidNames(agents);
        expect(result).toHaveLength(2);
        expect(result[0]?.agentName).toBe(name("valid"));
        expect(result[1]?.agentName).toBe(name("also-valid"));
    });

    it("filters out agents with null agentName", () => {
        const agents = [
            makeAgentInfo({ name: "valid", agentName: name("valid") }),
            makeAgentInfo({ name: "invalid-worktree", agentName: null }),
        ];
        const result = agentsWithValidNames(agents);
        expect(result).toHaveLength(1);
        expect(result[0]?.agentName).toBe(name("valid"));
    });

    it("returns empty array when all agents have null agentName", () => {
        const agents = [
            makeAgentInfo({ name: "bad-1", agentName: null }),
            makeAgentInfo({ name: "bad-2", agentName: null }),
        ];
        const result = agentsWithValidNames(agents);
        expect(result).toHaveLength(0);
    });

    it("returns empty array for empty input", () => {
        const result = agentsWithValidNames([]);
        expect(result).toHaveLength(0);
    });

    it("preserves all agent properties in filtered results", () => {
        const agent = makeAgentInfo({
            name: "my-agent",
            agentName: "my-agent" as AgentName,
            branch: "feature/cool",
            path: "/some/path",
            containerState: { kind: "stopped" },
            hasTmuxSession: true,
        });
        const result = agentsWithValidNames([agent]);
        expect(result).toHaveLength(1);
        expect(result[0]?.branch).toBe("feature/cool");
        expect(result[0]?.hasTmuxSession).toBe(true);
        expect(result[0]?.containerState).toEqual({ kind: "stopped" });
    });
});

// ============================================================================
// handleResolveError
// ============================================================================

describe("handleResolveError", () => {
    it("returns 0 for no-agents error", () => {
        const error: ResolveError = { kind: "no-agents" };
        const exitCode = handleResolveError(error, "No agents found");
        expect(exitCode).toBe(0);
    });

    it("returns 0 for cancelled error", () => {
        const error: ResolveError = { kind: "cancelled" };
        const exitCode = handleResolveError(error, "No agents found");
        expect(exitCode).toBe(0);
    });

    it("returns 1 for error with message", () => {
        const error: ResolveError = { kind: "error", message: "something went wrong" };
        const exitCode = handleResolveError(error, "No agents found");
        expect(exitCode).toBe(1);
    });

    it("uses noAgentsMessage parameter for no-agents case", () => {
        const error: ResolveError = { kind: "no-agents" };
        // The function logs the message; we just verify it doesn't throw and returns 0
        const exitCode = handleResolveError(error, "Custom no agents message");
        expect(exitCode).toBe(0);
    });
});
