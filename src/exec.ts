import { spawn } from "child_process";
import * as os from "os";
import * as path from "path";

import type { Result } from "./result";
import { Ok, Err } from "./result";

export interface ExecResult {
    readonly code: number | null;
    readonly stdout: string;
    readonly stderr: string;
}

export interface ExecOptions {
    readonly cwd?: string;
    readonly captureOutput?: boolean;
    readonly rejectOnNonZeroExit?: boolean;
    readonly env?: Readonly<Record<string, string>>;
    /** Kill the spawned process after this many milliseconds. */
    readonly timeout?: number;
}

export async function exec(command: string, options: ExecOptions = {}): Promise<ExecResult> {
    const { cwd, captureOutput = false, rejectOnNonZeroExit = true, env, timeout } = options;

    const mergedEnv = env ? { ...process.env, ...env } : undefined;

    return new Promise((resolve, reject) => {
        const child = spawn("bash", ["-c", command], {
            cwd,
            env: mergedEnv,
            stdio: captureOutput ? "pipe" : "inherit",
        });

        let stdout = "";
        let stderr = "";
        let timedOut = false;

        const timer =
            timeout != null
                ? setTimeout(() => {
                      timedOut = true;
                      child.kill("SIGTERM");
                  }, timeout)
                : undefined;

        if (captureOutput) {
            child.stdout?.on("data", (data: Buffer) => {
                stdout += data.toString();
            });
            child.stderr?.on("data", (data: Buffer) => {
                stderr += data.toString();
            });
        }

        child.on("error", (err) => {
            if (timer != null) clearTimeout(timer);
            reject(err);
        });

        child.on("close", (code) => {
            if (timer != null) clearTimeout(timer);
            if (timedOut) {
                const result: ExecResult = {
                    code: null,
                    stdout,
                    stderr: `Command timed out after ${timeout}ms: ${command}`,
                };
                if (rejectOnNonZeroExit) {
                    const error = new Error(result.stderr);
                    error.cause = result;
                    reject(error);
                } else {
                    resolve(result);
                }
                return;
            }
            const result: ExecResult = { code, stdout, stderr };
            if (code !== 0 && rejectOnNonZeroExit) {
                const error = new Error(`Command '${command}' failed with code ${code}`);
                error.cause = { code, stdout, stderr };
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * Runs a command with `rejectOnNonZeroExit: false` and `captureOutput: true`,
 * returning `Ok(result)` on exit code 0 or `Err(errorContext + stderr)` otherwise.
 */
export async function tryExec(
    command: string,
    errorContext: string,
    options?: Omit<ExecOptions, "rejectOnNonZeroExit" | "captureOutput">
): Promise<Result<ExecResult, string>> {
    const result = await exec(command, {
        ...options,
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });
    if (result.code !== 0) {
        return Err(`${errorContext}: ${(result.stderr ?? "").trim()}`);
    }
    return Ok(result);
}

export function shellEscape(s: string): string {
    return `'${s.replace(/'/g, "'\\''")}'`;
}

export function expandHome(p: string): string {
    if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
    return p;
}

export function errorMessage(err: unknown): string {
    return err instanceof Error ? err.message : String(err);
}

/** Memoize an async factory so it runs at most once; concurrent callers share the same Promise. */
export function once<T>(fn: () => Promise<T>): () => Promise<T> {
    let cached: Promise<T> | undefined;
    return () => {
        if (cached == null) cached = fn();
        return cached;
    };
}
