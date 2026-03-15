import { describe, expect, it } from "bun:test";

import type { AgentName } from "../git";
import type { AgentInfo } from "./agent-info";
import { agentStatusHint } from "./agent-info";

// ============================================================================
// Helpers
// ============================================================================

function makeAgent(overrides: Partial<AgentInfo> = {}): AgentInfo {
    return {
        name: "test-agent",
        agentName: "test-agent" as AgentName,
        branch: "feature/test",
        path: "/tmp/test",
        containerState: { kind: "not-found" },
        hasTmuxSession: false,
        ports: [],
        ...overrides,
    };
}

// ============================================================================
// agentStatusHint
// ============================================================================

describe("agentStatusHint", () => {
    it("returns 'running, tmux' when running with tmux", () => {
        const agent = makeAgent({ containerState: { kind: "running" }, hasTmuxSession: true });
        expect(agentStatusHint(agent)).toBe("running, tmux");
    });

    it("returns 'running' when running without tmux", () => {
        const agent = makeAgent({ containerState: { kind: "running" }, hasTmuxSession: false });
        expect(agentStatusHint(agent)).toBe("running");
    });

    it("returns 'stopped' when stopped without tmux", () => {
        const agent = makeAgent({ containerState: { kind: "stopped" }, hasTmuxSession: false });
        expect(agentStatusHint(agent)).toBe("stopped");
    });

    it("returns 'stopped, tmux' when stopped with tmux", () => {
        const agent = makeAgent({ containerState: { kind: "stopped" }, hasTmuxSession: true });
        expect(agentStatusHint(agent)).toBe("stopped, tmux");
    });

    it("returns branch name when no container state and no tmux", () => {
        const agent = makeAgent({
            containerState: { kind: "not-found" },
            hasTmuxSession: false,
            branch: "my-branch",
        });
        expect(agentStatusHint(agent)).toBe("my-branch");
    });

    it("returns 'tmux' when no container state but has tmux session", () => {
        const agent = makeAgent({ containerState: { kind: "not-found" }, hasTmuxSession: true });
        expect(agentStatusHint(agent)).toBe("tmux");
    });
});
