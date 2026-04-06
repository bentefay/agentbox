import { or, object } from "@optique/core/constructs";
import { message } from "@optique/core/message";
import { optional, multiple } from "@optique/core/modifiers";
import { command, option, argument, constant } from "@optique/core/primitives";
import { defineProgram } from "@optique/core/program";
import { string } from "@optique/core/valueparser";
import { run } from "@optique/run";
import { match } from "ts-pattern";

import pkg from "../package.json";
import { errorMessage } from "./lib/exec";

const VERSION = pkg.version;

const newCmd = command(
    "new",
    object({
        cmd: constant("new" as const),
        branch: optional(
            argument(string({ metavar: "BRANCH" }), {
                description: message`Branch name or existing branch`
            })
        ),
        base: optional(
            argument(string({ metavar: "BASE" }), {
                description: message`Base branch to create from`
            })
        ),
        mode: optional(
            option("-m", "--mode", string({ metavar: "MODE" }), {
                description: message`tmux mode to launch`
            })
        ),
        noTmux: option("--no-tmux", {
            description: message`Create worktree without starting tmux`
        }),
        trust: option("--trust", {
            description: message`Trust environment (run host-side operations)`
        }),
        untrusted: option("--untrusted", {
            description: message`Skip host-side operations like direnv`
        }),
        useLocalBranch: option("--use-local-branch", {
            description: message`Auto-select local branch version when versions differ`
        }),
        noFocus: option("--no-focus", {
            description: message`Don't switch tmux session after setup`
        })
    }),
    { description: message`Create a new agent (worktree + container + tmux)` }
);

const attachCmd = command(
    "attach",
    object({
        cmd: constant("attach" as const),
        name: optional(argument(string({ metavar: "NAME" }), { description: message`Agent name` })),
        mode: optional(
            option("-m", "--mode", string({ metavar: "MODE" }), {
                description: message`tmux mode to launch`
            })
        ),
        trust: option("--trust", {
            description: message`Trust environment (run host-side operations)`
        }),
        untrusted: option("--untrusted", {
            description: message`Skip host-side operations like direnv`
        }),
        noFocus: option("--no-focus", {
            description: message`Don't switch tmux session after setup`
        })
    }),
    { description: message`Attach to an existing agent's tmux session` }
);

const stopCmd = command(
    "stop",
    object({
        cmd: constant("stop" as const),
        name: optional(argument(string({ metavar: "NAME" }), { description: message`Agent name` }))
    }),
    { description: message`Stop agent container, preserve worktree` }
);

const rmCmd = command(
    "rm",
    object({
        cmd: constant("rm" as const),
        names: multiple(
            argument(string({ metavar: "NAME" }), { description: message`Agent name(s)` })
        ),
        force: option("-f", "--force", { description: message`Skip confirmation` })
    }),
    { description: message`Remove agent entirely (container + worktree)` }
);

const listCmd = command(
    "list",
    object({
        cmd: constant("list" as const)
    }),
    { description: message`List all agents with status` }
);

const checkoutCmd = command(
    "checkout",
    object({
        cmd: constant("checkout" as const),
        name: optional(argument(string({ metavar: "NAME" }), { description: message`Agent name` }))
    }),
    { description: message`Fetch agent's branch into main repo` }
);

const checkVmCmd = command(
    "check-vm",
    object({
        cmd: constant("check-vm" as const)
    }),
    { description: message`Verify k3s/Kata/Cloud Hypervisor setup` }
);

const cacheCmd = command(
    "cache",
    object({
        cmd: constant("cache" as const)
    }),
    { description: message`Pre-cache docker images for fast startup` }
);

const logsCmd = command(
    "logs",
    object({
        cmd: constant("logs" as const),
        name: optional(argument(string({ metavar: "NAME" }), { description: message`Agent name` })),
        follow: option("-f", "--follow", { description: message`Follow log output` }),
        init: option("--init", { description: message`Show init container logs (k3s only)` })
    }),
    { description: message`Display agent container logs` }
);

const execCmd = command(
    "exec",
    object({
        cmd: constant("exec" as const),
        name: optional(argument(string({ metavar: "NAME" }), { description: message`Agent name` })),
        command: multiple(
            argument(string({ metavar: "CMD" }), {
                description: message`Command to run (after --)`
            })
        )
    }),
    { description: message`Execute a command inside an agent container` }
);

const parser = or(
    newCmd,
    attachCmd,
    stopCmd,
    rmCmd,
    listCmd,
    checkoutCmd,
    checkVmCmd,
    cacheCmd,
    logsCmd,
    execCmd
);

const program = defineProgram({
    parser,
    metadata: {
        name: "agentbox",
        version: VERSION,
        brief: message`Secure, isolated development environments for AI coding agents`
    }
});

async function dispatch(): Promise<number> {
    const result = run(program, {
        help: { mode: "both" },
        version: { mode: "both", value: VERSION }
    });
    const cmd = await import("./commands/index");

    return match(result)
        .with({ cmd: "new" }, (r) =>
            cmd.cmdNew({
                branch: r.branch,
                base: r.base,
                mode: r.mode,
                noTmux: r.noTmux,
                trust: r.trust,
                untrusted: r.untrusted,
                useLocalBranch: r.useLocalBranch,
                noFocus: r.noFocus
            })
        )
        .with({ cmd: "attach" }, (r) =>
            cmd.cmdAttach(r.name, r.mode, r.trust, r.untrusted, r.noFocus)
        )
        .with({ cmd: "stop" }, (r) => cmd.cmdStop(r.name))
        .with({ cmd: "rm" }, (r) => cmd.cmdRm(r.names, r.force))
        .with({ cmd: "list" }, () => cmd.cmdList())
        .with({ cmd: "checkout" }, (r) => cmd.cmdCheckout(r.name))
        .with({ cmd: "check-vm" }, () => cmd.cmdCheckVm())
        .with({ cmd: "cache" }, () => cmd.cmdCache())
        .with({ cmd: "logs" }, (r) => cmd.cmdLogs(r.name, r.follow, r.init))
        .with({ cmd: "exec" }, (r) => cmd.cmdExec(r.name, r.command))
        .exhaustive();
}

dispatch().then(
    (code) => {
        process.exitCode = code;
    },
    (err) => {
        console.error(errorMessage(err));
        process.exitCode = 1;
    }
);
