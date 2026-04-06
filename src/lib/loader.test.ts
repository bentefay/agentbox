import { describe, test, expect } from "bun:test";

import { getRepoPath, detectGitContext } from "./loader";
import type { RepoPath } from "./loader";

describe("getRepoPath", () => {
    test("returns Ok with the repo root when run inside a git repo", async () => {
        const result = await getRepoPath();
        expect(result.ok).toBe(true);
        if (result.ok) {
            // We're running inside the agentbox repo, so it should return a valid path
            expect(result.value.length).toBeGreaterThan(0);
            expect(result.value).not.toContain("\n");
            // The value should be usable as a string (branded type is transparent)
            const str: string = result.value;
            expect(str).toBe(result.value);
        }
    });
});

describe("detectGitContext", () => {
    test("returns repo context when run inside a normal git repo", async () => {
        const result = await detectGitContext();
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.kind).toBe("repo");
            expect(result.value.root.length).toBeGreaterThan(0);
        }
    });
});

describe("RepoPath branded type", () => {
    test("is usable as a string", () => {
        const repoPath = "/some/path" as RepoPath;
        const str: string = repoPath;
        expect(str).toBe("/some/path");
    });

    test("can be used in string operations", () => {
        const repoPath = "/home/user/my-repo" as RepoPath;
        expect(repoPath.endsWith("my-repo")).toBe(true);
        expect(repoPath.startsWith("/")).toBe(true);
    });
});
