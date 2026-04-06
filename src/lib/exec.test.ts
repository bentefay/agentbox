import { describe, test, expect } from "bun:test";
import * as os from "os";
import * as path from "path";

import { exec, shellEscape, expandHome, errorMessage, tryExec, once } from "./exec";

describe("shellEscape", () => {
    test("wraps a simple string in single quotes", () => {
        expect(shellEscape("hello")).toBe("'hello'");
    });

    test("escapes single quotes inside the string", () => {
        expect(shellEscape("it's")).toBe("'it'\\''s'");
    });

    test("handles spaces", () => {
        expect(shellEscape("hello world")).toBe("'hello world'");
    });

    test("handles double quotes", () => {
        expect(shellEscape('say "hi"')).toBe("'say \"hi\"'");
    });

    test("handles backticks", () => {
        expect(shellEscape("run `cmd`")).toBe("'run `cmd`'");
    });

    test("handles dollar signs", () => {
        expect(shellEscape("$HOME")).toBe("'$HOME'");
    });

    test("handles empty string", () => {
        expect(shellEscape("")).toBe("''");
    });

    test("handles semicolons", () => {
        expect(shellEscape("a; rm -rf /")).toBe("'a; rm -rf /'");
    });

    test("handles pipes", () => {
        expect(shellEscape("a | b")).toBe("'a | b'");
    });

    test("handles multiple single quotes", () => {
        expect(shellEscape("it's a 'test'")).toBe("'it'\\''s a '\\''test'\\'''");
    });
});

describe("expandHome", () => {
    test("expands tilde prefix to home directory", () => {
        expect(expandHome("~/foo/bar")).toBe(path.join(os.homedir(), "foo/bar"));
    });

    test("leaves absolute paths unchanged", () => {
        expect(expandHome("/usr/local/bin")).toBe("/usr/local/bin");
    });

    test("leaves relative paths unchanged", () => {
        expect(expandHome("relative/path")).toBe("relative/path");
    });

    test("does not expand tilde in the middle of a path", () => {
        expect(expandHome("/home/~/foo")).toBe("/home/~/foo");
    });

    test("expands bare tilde-slash with no trailing path", () => {
        expect(expandHome("~/")).toBe(path.join(os.homedir(), ""));
    });

    test("does not expand bare tilde without slash", () => {
        expect(expandHome("~")).toBe("~");
    });
});

describe("errorMessage", () => {
    test("extracts message from Error instance", () => {
        expect(errorMessage(new Error("something broke"))).toBe("something broke");
    });

    test("returns string as-is", () => {
        expect(errorMessage("plain string")).toBe("plain string");
    });

    test("converts number to string", () => {
        expect(errorMessage(42)).toBe("42");
    });

    test("converts null to string", () => {
        expect(errorMessage(null)).toBe("null");
    });

    test("converts undefined to string", () => {
        expect(errorMessage(undefined)).toBe("undefined");
    });
});

describe("tryExec", () => {
    test("returns Ok with ExecResult on success", async () => {
        const result = await tryExec("echo hello", "should not fail");
        expect(result.ok).toBe(true);
        if (!result.ok) throw new Error("expected Ok");
        expect(result.value.code).toBe(0);
        expect(result.value.stdout.trim()).toBe("hello");
    });

    test("returns Err with context and stderr on non-zero exit", async () => {
        const result = await tryExec("bash -c 'echo oops >&2; exit 1'", "command failed");
        expect(result.ok).toBe(false);
        if (result.ok) throw new Error("expected Err");
        expect(result.error).toContain("command failed");
        expect(result.error).toContain("oops");
    });

    test("captures output by default", async () => {
        const result = await tryExec("echo captured", "unused");
        expect(result.ok).toBe(true);
        if (!result.ok) throw new Error("expected Ok");
        expect(result.value.stdout).toContain("captured");
    });

    test("passes cwd option through", async () => {
        const result = await tryExec("pwd", "unused", { cwd: "/tmp" });
        expect(result.ok).toBe(true);
        if (!result.ok) throw new Error("expected Ok");
        expect(result.value.stdout.trim()).toMatch(/tmp$/);
    });
});

describe("exec timeout", () => {
    test("kills process after timeout and returns non-zero result when rejectOnNonZeroExit is false", async () => {
        const result = await exec("sleep 30", {
            captureOutput: true,
            rejectOnNonZeroExit: false,
            timeout: 200
        });

        expect(result.code).toBeNull();
        expect(result.stderr).toContain("timed out after 200ms");
    });

    test("rejects when rejectOnNonZeroExit is true and process times out", async () => {
        await expect(
            exec("sleep 30", {
                captureOutput: true,
                rejectOnNonZeroExit: true,
                timeout: 200
            })
        ).rejects.toThrow("timed out after 200ms");
    });

    test("does not interfere when command completes before timeout", async () => {
        const result = await exec("echo hello", {
            captureOutput: true,
            timeout: 5000
        });

        expect(result.code).toBe(0);
        expect(result.stdout.trim()).toBe("hello");
    });
});

describe("tryExec timeout", () => {
    test("returns Err when command times out", async () => {
        const result = await tryExec("sleep 30", "long-running command", { timeout: 200 });

        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toContain("long-running command");
            expect(result.error).toContain("timed out after 200ms");
        }
    });
});

describe("once", () => {
    test("calls the factory function only once even with multiple invocations", async () => {
        let callCount = 0;
        const fn = once(async () => {
            callCount++;
            return 42;
        });

        const [a, b, c] = await Promise.all([fn(), fn(), fn()]);

        expect(callCount).toBe(1);
        expect(a).toBe(42);
        expect(b).toBe(42);
        expect(c).toBe(42);
    });

    test("returns the cached result on subsequent calls", async () => {
        const fn = once(async () => ({ value: "hello" }));

        const first = await fn();
        const second = await fn();

        expect(first).toBe(second); // same object reference
    });

    test("shares the same promise for concurrent callers", async () => {
        const fn = once(async () => "result");

        const p1 = fn();
        const p2 = fn();

        expect(p1).toBe(p2); // exact same promise object
        expect(await p1).toBe("result");
    });

    test("caches rejected promises (does not retry)", async () => {
        let callCount = 0;
        const fn = once(async () => {
            callCount++;
            throw new Error("boom");
        });

        await expect(fn()).rejects.toThrow("boom");
        await expect(fn()).rejects.toThrow("boom");
        expect(callCount).toBe(1);
    });
});
