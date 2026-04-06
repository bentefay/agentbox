import { describe, test, expect } from "bun:test";

import {
    parseAgentName,
    getAgentPaths,
    getAgentsDirPaths,
    mergeBranches,
    branchHint,
    groupSourcesBySha,
    classifyBranchSources
} from "./git";
import type {
    AgentName,
    RepoPath,
    GitContext,
    BranchInfo,
    AnnotatedBranch,
    BranchSource
} from "./git";
import type { BareRepoPath } from "./git/paths";

/** Helper to create a valid AgentName for tests that need one. */
function testAgentName(raw: string): AgentName {
    const result = parseAgentName(raw);
    if (!result.ok) throw new Error(`Test setup: invalid agent name '${raw}'`);
    return result.value;
}

/** Helper to create a GitContext for the common repo case in tests. */
function testRepoContext(root: string): GitContext {
    return { kind: "repo", root: root as RepoPath };
}

describe("parseAgentName", () => {
    test("accepts lowercase letters", () => {
        const result = parseAgentName("agent");
        expect(result.ok).toBe(true);
        if (result.ok) expect(`${result.value}`).toBe("agent");
    });

    test("accepts uppercase letters", () => {
        const result = parseAgentName("Agent");
        expect(result.ok).toBe(true);
    });

    test("accepts digits", () => {
        const result = parseAgentName("agent123");
        expect(result.ok).toBe(true);
    });

    test("accepts hyphens", () => {
        const result = parseAgentName("my-agent");
        expect(result.ok).toBe(true);
    });

    test("accepts mixed alphanumeric with hyphens", () => {
        const result = parseAgentName("agent-1-test");
        expect(result.ok).toBe(true);
    });

    test("accepts max length (63 chars)", () => {
        const result = parseAgentName("a".repeat(63));
        expect(result.ok).toBe(true);
    });

    test("rejects empty string", () => {
        const result = parseAgentName("");
        expect(result.ok).toBe(false);
    });

    test("rejects names longer than 63 chars", () => {
        const result = parseAgentName("a".repeat(64));
        expect(result.ok).toBe(false);
    });

    test("rejects spaces", () => {
        const result = parseAgentName("my agent");
        expect(result.ok).toBe(false);
    });

    test("rejects underscores", () => {
        const result = parseAgentName("my_agent");
        expect(result.ok).toBe(false);
    });

    test("rejects dots", () => {
        const result = parseAgentName("my.agent");
        expect(result.ok).toBe(false);
    });

    test("rejects slashes", () => {
        const result = parseAgentName("my/agent");
        expect(result.ok).toBe(false);
    });

    test("rejects special characters", () => {
        expect(parseAgentName("agent!").ok).toBe(false);
        expect(parseAgentName("agent@name").ok).toBe(false);
    });

    test("returns error message on invalid input", () => {
        const result = parseAgentName("bad name!");
        expect(result.ok).toBe(false);
        if (!result.ok) expect(result.error).toContain("Invalid agent name");
    });

    test("returned value is usable as a string", () => {
        const result = parseAgentName("my-agent");
        expect(result.ok).toBe(true);
        if (result.ok) {
            // Branded type should still work as string
            const str: string = result.value;
            expect(str).toBe("my-agent");
        }
    });
});

describe("getAgentPaths", () => {
    test("derives correct paths from repo context and agent name", () => {
        const paths = getAgentPaths(
            testRepoContext("/home/user/my-repo"),
            testAgentName("agent-1")
        );
        expect(paths.agentsDir).toBe("/home/user/my-repo-agents");
        expect(`${paths.bareRepo}`).toBe("/home/user/my-repo-agents/.bare");
        expect(paths.worktree).toBe("/home/user/my-repo-agents/agent-1");
    });

    test("handles nested repo paths", () => {
        const paths = getAgentPaths(testRepoContext("/a/b/c/repo"), testAgentName("test"));
        expect(paths.agentsDir).toBe("/a/b/c/repo-agents");
        expect(`${paths.bareRepo}`).toBe("/a/b/c/repo-agents/.bare");
        expect(paths.worktree).toBe("/a/b/c/repo-agents/test");
    });

    test("uses repo basename, not full path, for agents dir", () => {
        const paths = getAgentPaths(testRepoContext("/workspace/cosmos"), testAgentName("dev"));
        expect(paths.agentsDir).toEndWith("cosmos-agents");
        expect(paths.agentsDir).not.toContain("workspace-agents");
    });
});

describe("getAgentsDirPaths", () => {
    test("derives agents directory and bare repo paths for repo context", () => {
        const paths = getAgentsDirPaths(testRepoContext("/home/user/my-repo"));
        expect(paths.agentsDir).toBe("/home/user/my-repo-agents");
        expect(`${paths.bareRepo}`).toBe("/home/user/my-repo-agents/.bare");
    });

    test("returns provided paths for bare-worktree context", () => {
        const ctx: GitContext = {
            kind: "bare-worktree",
            root: "/tmp/agents/my-agent" as RepoPath,
            bareRepo: "/tmp/agents/.bare" as BareRepoPath,
            agentsDir: "/tmp/agents"
        };
        const paths = getAgentsDirPaths(ctx);
        expect(paths.agentsDir).toBe("/tmp/agents");
        expect(`${paths.bareRepo}`).toBe("/tmp/agents/.bare");
    });
});

describe("mergeBranches", () => {
    const mkBranch = (name: string, sha: string, unix: number): BranchInfo => ({
        name,
        sha,
        author: "Test",
        lastEdit: "1 day ago",
        lastEditUnix: unix
    });

    test("merges local-only branch as local", () => {
        const local = [mkBranch("feature", "abc1234", 100)];
        const remote: readonly BranchInfo[] = [];
        const result = mergeBranches(local, remote);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("feature");
        expect(result[0].location).toBe("local");
    });

    test("merges remote-only branch as remote", () => {
        const local: readonly BranchInfo[] = [];
        const remote = [mkBranch("origin/feature", "abc1234", 100)];
        const result = mergeBranches(local, remote);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("origin/feature");
        expect(result[0].location).toBe("remote");
    });

    test("merges same-SHA local+remote as 'local + remote'", () => {
        const local = [mkBranch("main", "abc1234", 200)];
        const remote = [mkBranch("origin/main", "abc1234", 200)];
        const result = mergeBranches(local, remote);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("main");
        expect(result[0].location).toBe("local + remote");
    });

    test("keeps diverged branches as separate entries", () => {
        const local = [mkBranch("main", "abc1234", 200)];
        const remote = [mkBranch("origin/main", "def5678", 300)];
        const result = mergeBranches(local, remote);
        expect(result).toHaveLength(2);
        const locations = result.map((b) => b.location);
        expect(locations).toContain("local");
        expect(locations).toContain("remote");
    });

    test("sorts by lastEditUnix descending", () => {
        const local = [mkBranch("old", "aaa", 100), mkBranch("new", "bbb", 300)];
        const remote = [mkBranch("origin/mid", "ccc", 200)];
        const result = mergeBranches(local, remote);
        expect(result[0].lastEditUnix).toBe(300);
        expect(result[1].lastEditUnix).toBe(200);
        expect(result[2].lastEditUnix).toBe(100);
    });

    test("handles empty inputs", () => {
        expect(mergeBranches([], [])).toEqual([]);
    });

    test("deduplicates by stripping origin/ prefix", () => {
        const local = [mkBranch("feature", "same", 100)];
        const remote = [mkBranch("origin/feature", "same", 100)];
        const result = mergeBranches(local, remote);
        expect(result).toHaveLength(1);
        expect(result[0].location).toBe("local + remote");
    });
});

describe("branchHint", () => {
    test("formats location, author, and date", () => {
        const branch: AnnotatedBranch = {
            name: "main",
            sha: "abc1234",
            author: "Alice",
            lastEdit: "2 days ago",
            lastEditUnix: 100,
            location: "local + remote"
        };
        expect(branchHint(branch)).toBe("local + remote, Alice, 2 days ago");
    });

    test("works with local-only branch", () => {
        const branch: AnnotatedBranch = {
            name: "feature",
            sha: "def5678",
            author: "Bob",
            lastEdit: "just now",
            lastEditUnix: 200,
            location: "local"
        };
        expect(branchHint(branch)).toBe("local, Bob, just now");
    });
});

describe("groupSourcesBySha", () => {
    test("single source produces one group with one label", () => {
        const sources: readonly BranchSource[] = [{ label: "Local", sha: "abc123" }];
        const result = groupSourcesBySha(sources);
        expect(result).toEqual([{ labels: ["Local"], sha: "abc123", unix: 0 }]);
    });

    test("two sources with same SHA produce one group with merged labels", () => {
        const sources: readonly BranchSource[] = [
            { label: "Local", sha: "abc123" },
            { label: "GitHub", sha: "abc123" }
        ];
        const result = groupSourcesBySha(sources);
        expect(result).toHaveLength(1);
        expect(result[0].labels).toEqual(["Local", "GitHub"]);
        expect(result[0].sha).toBe("abc123");
    });

    test("three sources with different SHAs produce three groups", () => {
        const sources: readonly BranchSource[] = [
            { label: "Local", sha: "aaa" },
            { label: "GitHub", sha: "bbb" },
            { label: "Bare repo", sha: "ccc" }
        ];
        const result = groupSourcesBySha(sources);
        expect(result).toHaveLength(3);
        expect(result[0]).toEqual({ labels: ["Local"], sha: "aaa", unix: 0 });
        expect(result[1]).toEqual({ labels: ["GitHub"], sha: "bbb", unix: 0 });
        expect(result[2]).toEqual({ labels: ["Bare repo"], sha: "ccc", unix: 0 });
    });

    test("empty sources produce empty result", () => {
        const result = groupSourcesBySha([]);
        expect(result).toEqual([]);
    });
});

describe("classifyBranchSources", () => {
    test("all null SHAs returns new-branch", () => {
        const result = classifyBranchSources({ originSha: null, localSha: null, bareSha: null });
        expect(result).toEqual({ kind: "new-branch" });
    });

    test("single source (origin only) returns agreed", () => {
        const result = classifyBranchSources({ originSha: "aaa", localSha: null, bareSha: null });
        expect(result).toEqual({ kind: "agreed", localSha: null });
    });

    test("single source (local only) returns agreed with localSha", () => {
        const result = classifyBranchSources({ originSha: null, localSha: "bbb", bareSha: null });
        expect(result).toEqual({ kind: "agreed", localSha: "bbb" });
    });

    test("single source (bare only) returns agreed", () => {
        const result = classifyBranchSources({ originSha: null, localSha: null, bareSha: "ccc" });
        expect(result).toEqual({ kind: "agreed", localSha: null });
    });

    test("two sources with same SHA returns agreed", () => {
        const result = classifyBranchSources({ originSha: "aaa", localSha: "aaa", bareSha: null });
        expect(result).toEqual({ kind: "agreed", localSha: "aaa" });
    });

    test("all three sources with same SHA returns agreed", () => {
        const result = classifyBranchSources({ originSha: "aaa", localSha: "aaa", bareSha: "aaa" });
        expect(result).toEqual({ kind: "agreed", localSha: "aaa" });
    });

    test("two sources with different SHAs returns conflict", () => {
        const result = classifyBranchSources({ originSha: "aaa", localSha: "bbb", bareSha: null });
        expect(result).toEqual({ kind: "conflict", localSha: "bbb" });
    });

    test("three sources, two same and one different returns conflict", () => {
        const result = classifyBranchSources({ originSha: "aaa", localSha: "aaa", bareSha: "bbb" });
        expect(result).toEqual({ kind: "conflict", localSha: "aaa" });
    });

    test("all three sources with different SHAs returns conflict", () => {
        const result = classifyBranchSources({ originSha: "aaa", localSha: "bbb", bareSha: "ccc" });
        expect(result).toEqual({ kind: "conflict", localSha: "bbb" });
    });

    test("conflict without local preserves null localSha", () => {
        const result = classifyBranchSources({ originSha: "aaa", localSha: null, bareSha: "bbb" });
        expect(result).toEqual({ kind: "conflict", localSha: null });
    });
});
