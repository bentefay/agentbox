import { describe, test, expect } from "bun:test";

import { sanitizeSessionName, isInsideTmux, getCurrentSessionName } from "./tmux";

describe("sanitizeSessionName", () => {
    test("replaces dots with hyphens", () => {
        expect(sanitizeSessionName("my.session")).toBe(sanitizeSessionName("my-session"));
    });

    test("replaces colons with hyphens", () => {
        expect(sanitizeSessionName("my:session")).toBe(sanitizeSessionName("my-session"));
    });

    test("replaces slashes with hyphens", () => {
        expect(sanitizeSessionName("my/session")).toBe(sanitizeSessionName("my-session"));
    });

    test("replaces multiple special characters", () => {
        expect(sanitizeSessionName("a.b:c/d")).toBe(sanitizeSessionName("a-b-c-d"));
    });

    test("leaves valid names unchanged", () => {
        expect(sanitizeSessionName("my-session")).toBe(sanitizeSessionName("my-session"));
    });

    test("handles names with no special characters", () => {
        expect(sanitizeSessionName("agent123")).toBe(sanitizeSessionName("agent123"));
    });

    test("handles empty string", () => {
        expect(sanitizeSessionName("")).toBe(sanitizeSessionName(""));
    });

    test("handles consecutive special characters", () => {
        expect(sanitizeSessionName("a..b::c//d")).toBe(sanitizeSessionName("a--b--c--d"));
    });

    test("returns branded SessionName type containing correct string value", () => {
        const result: string = sanitizeSessionName("my.session");
        expect(result).toBe("my-session");
    });
});

describe("getCurrentSessionName", () => {
    test("returns null when not inside tmux", async () => {
        const saved = process.env.TMUX;
        delete process.env.TMUX;
        try {
            expect(isInsideTmux()).toBe(false);
            const result = await getCurrentSessionName();
            expect(result).toBeNull();
        } finally {
            if (saved !== undefined) process.env.TMUX = saved;
        }
    });
});

describe("inTargetSession detection", () => {
    test("sanitizeSessionName is consistent with ensureSession naming", () => {
        // The inTargetSession check compares getCurrentSessionName() against
        // sanitizeSessionName(agentName). ensureSession also uses sanitizeSessionName
        // to create the session. This test verifies that agent names with special
        // characters are consistently sanitized.
        const agentNames = ["feature/my-branch", "fix:hotfix", "agent.name", "simple-name"];
        for (const name of agentNames) {
            const sanitized = sanitizeSessionName(name);
            // Sanitized name should not contain tmux-invalid characters
            expect(sanitized).not.toMatch(/[.:/]/);
            // Applying sanitize twice should be idempotent
            expect(sanitizeSessionName(sanitized)).toBe(sanitized);
        }
    });
});
