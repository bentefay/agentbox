import { afterEach, describe, test, expect } from "bun:test";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { ensureClaudeBypassPermissions } from "./agent";

function makeTmpHome(): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "agentbox-test-"));
    return dir;
}

describe("ensureClaudeBypassPermissions", () => {
    const tmpDirs: string[] = [];

    function tmpHome(): string {
        const dir = makeTmpHome();
        tmpDirs.push(dir);
        return dir;
    }

    afterEach(() => {
        for (const dir of tmpDirs) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
        tmpDirs.length = 0;
    });

    test("sets bypassPermissionsModeAccepted when missing", () => {
        const home = tmpHome();
        fs.writeFileSync(path.join(home, ".claude.json"), JSON.stringify({}));

        ensureClaudeBypassPermissions(home);

        const data = JSON.parse(fs.readFileSync(path.join(home, ".claude.json"), "utf-8"));
        expect(data.bypassPermissionsModeAccepted).toBe(true);
    });

    test("sets hasTrustDialogAccepted for /workspace", () => {
        const home = tmpHome();
        fs.writeFileSync(path.join(home, ".claude.json"), JSON.stringify({}));

        ensureClaudeBypassPermissions(home);

        const data = JSON.parse(fs.readFileSync(path.join(home, ".claude.json"), "utf-8"));
        expect(data.projects).toBeDefined();
        expect(data.projects["/workspace"].hasTrustDialogAccepted).toBe(true);
    });

    test("preserves existing projects when adding /workspace trust", () => {
        const home = tmpHome();
        const existing = {
            bypassPermissionsModeAccepted: true,
            projects: {
                "/some/other/path": { hasTrustDialogAccepted: true, allowedTools: ["bash"] }
            }
        };
        fs.writeFileSync(path.join(home, ".claude.json"), JSON.stringify(existing));

        ensureClaudeBypassPermissions(home);

        const data = JSON.parse(fs.readFileSync(path.join(home, ".claude.json"), "utf-8"));
        expect(data.projects["/some/other/path"].allowedTools).toEqual(["bash"]);
        expect(data.projects["/workspace"].hasTrustDialogAccepted).toBe(true);
    });

    test("preserves existing /workspace project properties", () => {
        const home = tmpHome();
        const existing = {
            projects: {
                "/workspace": { allowedTools: ["Read"], mcpServers: {} }
            }
        };
        fs.writeFileSync(path.join(home, ".claude.json"), JSON.stringify(existing));

        ensureClaudeBypassPermissions(home);

        const data = JSON.parse(fs.readFileSync(path.join(home, ".claude.json"), "utf-8"));
        expect(data.projects["/workspace"].hasTrustDialogAccepted).toBe(true);
        expect(data.projects["/workspace"].allowedTools).toEqual(["Read"]);
    });

    test("does not rewrite when already fully configured", () => {
        const home = tmpHome();
        const existing = {
            bypassPermissionsModeAccepted: true,
            projects: {
                "/workspace": { hasTrustDialogAccepted: true }
            }
        };
        const content = JSON.stringify(existing, null, 2) + "\n";
        fs.writeFileSync(path.join(home, ".claude.json"), content);
        const mtimeBefore = fs.statSync(path.join(home, ".claude.json")).mtimeMs;

        ensureClaudeBypassPermissions(home);

        const mtimeAfter = fs.statSync(path.join(home, ".claude.json")).mtimeMs;
        expect(mtimeAfter).toBe(mtimeBefore);
    });

    test("skips gracefully when file does not exist", () => {
        const home = tmpHome();
        expect(() => ensureClaudeBypassPermissions(home)).not.toThrow();
    });

    test("skips gracefully when file is malformed JSON", () => {
        const home = tmpHome();
        fs.writeFileSync(path.join(home, ".claude.json"), "not json");
        expect(() => ensureClaudeBypassPermissions(home)).not.toThrow();
    });
});
