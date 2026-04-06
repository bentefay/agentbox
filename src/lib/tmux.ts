import type { TmuxMode, TmuxPane, TmuxWindow } from "./config";
import { exec, tryExec, shellEscape, once, errorMessage } from "./exec";
import type { Result } from "./result";
import { Ok, Err } from "./result";

export type SessionName = string & { readonly __brand: "SessionName" };

export const isTmuxInstalled: () => Promise<boolean> = once(async () => {
    const result = await exec("which tmux", {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    return result.code === 0;
});

export function isInsideTmux(): boolean {
    return !!process.env.TMUX;
}

export async function getCurrentSessionName(): Promise<string | null> {
    if (!isInsideTmux()) return null;
    const result = await exec("tmux display-message -p '#S'", {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (result.code !== 0) return null;
    return result.stdout.trim();
}

export function sanitizeSessionName(name: string): SessionName {
    // This is the ONE allowed cast — the branded type smart constructor pattern
    return name.replace(/[.:/]/g, "-") as SessionName;
}

export async function sessionExists(name: SessionName): Promise<boolean> {
    const result = await exec(`tmux has-session -t ${shellEscape(name)} 2>/dev/null`, {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    return result.code === 0;
}

export async function windowExists(session: SessionName, window: string): Promise<boolean> {
    const result = await exec(`tmux list-windows -t ${shellEscape(session)} -F '#{window_name}'`, {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (result.code !== 0) return false;
    return result.stdout.trim().split("\n").includes(window);
}

export async function createSession(name: SessionName, cwd: string): Promise<Result<void, string>> {
    const result = await tryExec(
        `tmux new-session -d -s ${shellEscape(name)} -c ${shellEscape(cwd)}`,
        "Failed to create tmux session"
    );
    if (!result.ok) return result;
    return Ok(undefined);
}

export async function createWindow(
    session: SessionName,
    name: string,
    afterWindow?: string
): Promise<Result<string, string>> {
    const printFmt = "-P -F '#{session_name}:#{window_index}'";
    const after = afterWindow ?? (await getLastWindowName(session));

    const result = after
        ? await tryExec(
              `tmux new-window -d -t ${shellEscape(session)}:${shellEscape(after)} -a -n ${shellEscape(name)} ${printFmt}`,
              "Failed to create tmux window"
          )
        : await tryExec(
              `tmux new-window -d -t ${shellEscape(session)} -n ${shellEscape(name)} ${printFmt}`,
              "Failed to create tmux window"
          );
    if (!result.ok) return result;
    return Ok(result.value.stdout.trim() || `${session}:${name}`);
}

export async function splitPane(target: string): Promise<Result<void, string>> {
    const result = await tryExec(
        `tmux split-window -d -t ${shellEscape(target)} -v`,
        "Failed to split tmux pane"
    );
    if (!result.ok) return result;
    return Ok(undefined);
}

export async function selectLayout(target: string, layout: string): Promise<Result<void, string>> {
    const result = await tryExec(
        `tmux select-layout -t ${shellEscape(target)} ${layout}`,
        "Failed to set tmux layout"
    );
    if (!result.ok) return result;
    return Ok(undefined);
}

export async function sendKeys(target: string, keys: string): Promise<Result<void, string>> {
    const result = await tryExec(
        `tmux send-keys -t ${shellEscape(target)} ${shellEscape(keys)} Enter`,
        "Failed to send keys to tmux"
    );
    if (!result.ok) return result;
    return Ok(undefined);
}

export async function switchOrAttach(session: SessionName): Promise<Result<void, string>> {
    try {
        if (isInsideTmux()) {
            const result = await tryExec(
                `tmux switch-client -t ${shellEscape(session)}`,
                "Failed to switch tmux client"
            );
            if (!result.ok) return result;
        } else {
            await exec(`tmux attach-session -t ${shellEscape(session)}`, {
                captureOutput: false
            });
        }
        return Ok(undefined);
    } catch (err) {
        return Err(`Failed to attach to tmux session: ${errorMessage(err)}`);
    }
}

export async function killSession(name: SessionName): Promise<void> {
    await exec(`tmux kill-session -t ${shellEscape(name)}`, {
        rejectOnNonZeroExit: false
    });
}

export async function gracefullyKillSession(name: SessionName): Promise<void> {
    const currentPane = process.env.TMUX_PANE;

    const result = await exec(
        `tmux list-panes -s -t ${shellEscape(name)} -F '#{pane_id} #{pane_pid}'`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false
        }
    );

    if (result.code === 0) {
        const panes = result.stdout
            .trim()
            .split("\n")
            .filter(Boolean)
            .map((line) => {
                const [id, pidStr] = line.split(" ");
                return { id: id ?? "", pid: parseInt(pidStr ?? "", 10) };
            })
            .filter((p) => p.id !== "");

        const otherPanes = panes.filter((p) => p.id !== currentPane);
        const validPanes = otherPanes.filter((p) => !isNaN(p.pid) && p.pid > 1);

        // Step 1: Send Ctrl+C to each pane (graceful SIGINT to foreground command)
        for (const pane of otherPanes) {
            try {
                await exec(`tmux send-keys -t ${shellEscape(name)}:${pane.id} C-c`, {
                    rejectOnNonZeroExit: false
                });
            } catch {
                // Pane may already be gone — continue
            }
        }

        if (otherPanes.length > 0) {
            await new Promise((r) => setTimeout(r, 2000));
        }

        // Step 2: SIGTERM pane processes and their children
        for (const pane of validPanes) {
            try {
                await exec(`pkill -P ${pane.pid}`, {
                    rejectOnNonZeroExit: false,
                    captureOutput: true
                });
            } catch {
                /* already exited */
            }
            try {
                await exec(`kill -15 ${pane.pid}`, {
                    rejectOnNonZeroExit: false,
                    captureOutput: true
                });
            } catch {
                /* already exited */
            }
        }

        if (validPanes.length > 0) {
            await new Promise((r) => setTimeout(r, 2000));
        }

        // Step 3: Escalate to SIGKILL for any remaining processes
        for (const pane of validPanes) {
            try {
                await exec(`pkill -P ${pane.pid} -KILL`, {
                    rejectOnNonZeroExit: false,
                    captureOutput: true
                });
            } catch {
                /* already exited */
            }
            try {
                await exec(`kill -9 ${pane.pid}`, {
                    rejectOnNonZeroExit: false,
                    captureOutput: true
                });
            } catch {
                /* already exited */
            }
        }

        if (validPanes.length > 0) {
            await new Promise((r) => setTimeout(r, 500));
        }
    }

    await killSession(name);
}

async function getLastWindowName(session: SessionName): Promise<string | null> {
    const result = await exec(`tmux list-windows -t ${shellEscape(session)} -F '#{window_name}'`, {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (result.code !== 0) return null;
    const windows = result.stdout.trim().split("\n").filter(Boolean);
    return windows.at(-1) ?? null;
}

export type CommandWrapper = (cmd: string) => string;

async function sendPaneCommands(
    target: string,
    panes: readonly TmuxPane[],
    wrapCommand?: CommandWrapper
): Promise<Result<void, string>> {
    for (const [i, pane] of panes.entries()) {
        if (!pane.command) continue;
        const paneTarget = `${target}.${i}`;
        if (pane.sleepSeconds && pane.sleepSeconds > 0) {
            const sleepResult = await sendKeys(paneTarget, `sleep ${pane.sleepSeconds}`);
            if (!sleepResult.ok) return sleepResult;
        }
        const cmd = wrapCommand ? wrapCommand(pane.command) : pane.command;
        const cmdResult = await sendKeys(paneTarget, cmd);
        if (!cmdResult.ok) return cmdResult;
    }
    return Ok(undefined);
}

async function createWindowWithPanes(
    session: SessionName,
    window: TmuxWindow,
    wrapCommand?: CommandWrapper
): Promise<Result<void, string>> {
    const windowResult = await createWindow(session, window.name);
    if (!windowResult.ok) return windowResult;
    const target = windowResult.value;

    // Split into N panes (pane 0 already exists)
    for (let i = 1; i < window.panes.length; i++) {
        const splitResult = await splitPane(`${target}.0`);
        if (!splitResult.ok) return splitResult;
    }

    if (window.panes.length > 1) {
        const layoutResult = await selectLayout(target, "even-vertical");
        if (!layoutResult.ok) return layoutResult;
    }

    return sendPaneCommands(target, window.panes, wrapCommand);
}

export async function setupMode(
    session: SessionName,
    mode: TmuxMode,
    wrapCommand?: CommandWrapper
): Promise<Result<void, string>> {
    for (const window of mode.windows) {
        if (await windowExists(session, window.name)) {
            // Window exists — re-send pane commands (e.g. session reuse)
            const target = `${session}:${window.name}`;
            const result = await sendPaneCommands(target, window.panes, wrapCommand);
            if (!result.ok) return result;
        } else {
            const result = await createWindowWithPanes(session, window, wrapCommand);
            if (!result.ok) return result;
        }
    }
    return Ok(undefined);
}

export async function ensureSession(
    name: string,
    cwd: string
): Promise<Result<SessionName, string>> {
    const sessionName = sanitizeSessionName(name);
    if (!(await sessionExists(sessionName))) {
        const result = await createSession(sessionName, cwd);
        if (!result.ok) return result;
    }
    return Ok(sessionName);
}
