import type { Result } from "./result";
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
export declare function exec(command: string, options?: ExecOptions): Promise<ExecResult>;
/**
 * Runs a command with `rejectOnNonZeroExit: false` and `captureOutput: true`,
 * returning `Ok(result)` on exit code 0 or `Err(errorContext + stderr)` otherwise.
 */
export declare function tryExec(command: string, errorContext: string, options?: Omit<ExecOptions, "rejectOnNonZeroExit" | "captureOutput">): Promise<Result<ExecResult, string>>;
export declare function shellEscape(s: string): string;
export declare function expandHome(p: string): string;
export declare function errorMessage(err: unknown): string;
/** Memoize an async factory so it runs at most once; concurrent callers share the same Promise. */
export declare function once<T>(fn: () => Promise<T>): () => Promise<T>;
