# Agent Stability Plan

Stabilize `agentbox new --mode dev` so it works correctly 5 consecutive times.

## Command Under Test

Alternate between trusted and untrusted on each run to exercise both code paths.
Use `totalRuns` from `STATUS.json` to determine: even runs → untrusted, odd runs → trusted.

```bash
# Untrusted (even runs: 0, 2, 4, ...)
bun run src/cli.ts new --mode dev --untrusted --use-local-branch --no-focus test

# Trusted (odd runs: 1, 3, 5, ...)
bun run src/cli.ts new --mode dev --use-local-branch --no-focus test
```

Teardown between runs:

```bash
bun run src/cli.ts rm --force test
```

---

## Principles

These are non-negotiable. The reviewer must verify conformance on every cycle.

### 1. Evidence before action

Never guess why something is failing. Run detailed diagnostics — capture pane output, check logs, inspect processes —
and confirm the root cause before making any change.

**Saying "I don't know yet, I need more data" is 3x more valuable than a guess.**

Add temporary instrumentation (logging, debug output) to the code if needed to get diagnostics. Re-run and collect
evidence. Only then propose a fix.

### 2. Protect the host

The VM is your sandbox — do anything you need inside it (`kubectl exec`, docker, tmux, modify files in the worktree).
Kube commands and tmux commands on the host are fine.

**Do not make destructive changes to the host computer.** No deleting host files, killing host processes, or modifying
host system config.

### 3. Own every failure

Never assume a problem is pre-existing or someone else's responsibility. Every failing pane, every test error, every
crash is yours to fix. If it was broken before your changes, fix it anyway and report it.

**Never stash, revert, or undo your changes to check whether a failure is "pre-existing".** This wastes time and creates
a false sense that some failures aren't your problem. They are. If something fails during your run, fix it — regardless
of when it was introduced.

### 4. Preserve intent, fix bugs

Fix bugs and make things work, but don't change intended behavior. If you're unsure whether a fix changes behavior or
intent, **ask the user before proceeding**. Prefer asking over guessing.

When the implementor encounters a behavioral question:

- Flag it to the orchestrator immediately
- Move on to other tasks it can complete while waiting for an answer
- Do not block on the question

### 5. Checklists enforce discipline

Use the shared checklist (see `CHECKLIST.md`) on every run. The checklist is the source of truth for whether a run
passed. No shortcuts, no "it's probably fine."

---

## Architecture

Three roles, following the `/implement` pattern:

### Orchestrator

- Does not write code
- Manages the loop, monitors progress, routes information, escalates to user
- Owns the outcome
- Reads `STATUS.json` and `runs.jsonl` to understand history
- Creates tasks for the implementor, sends verification requests to the reviewer

### Implementor (subagent_type: "implementor")

- Makes code changes
- Must diagnose with evidence before changing anything
- Flags behavioral questions to orchestrator, then moves to other tasks
- Runs its own verification after each change
- Never dismisses a failure as "pre-existing"

### Reviewer/Verifier (subagent_type: "reviewer")

- Independently verifies each cycle — never trusts implementor self-reports
- Captures all pane contents fresh
- Checks every item on the checklist
- Visits the devtools UI via Playwright MCP
- Reports failures with evidence (captured output, screenshots)
- Pushes back if implementor's diagnosis lacks evidence
- Checks that principles are being followed (diagnosis quality gate)

---

## Expected tmux Session Structure

Session name: `test`

All panes run inside the agent container (k3s pod or Docker container).

### Window: `agent` (1 pane)

| Pane | Command                                | Ready signal                              |
| ---- | -------------------------------------- | ----------------------------------------- |
| 0    | `claude --dangerously-skip-permissions` | Claude prompt or welcome message visible |

### Window: `test` (1 pane)

| Pane | Command              | Ready signal                                 |
| ---- | -------------------- | -------------------------------------------- |
| 0    | `bun test --watch`   | Test results displayed (pass/fail counts)    |

### Window: `devtools` (1 pane)

| Pane | Command                              | Ready signal                                |
| ---- | ------------------------------------ | ------------------------------------------- |
| 0    | docker build + run claude-devtools   | Server listening output or port 3456 active |

### Window: `shell` (1 pane)

| Pane | Command  | Ready signal        |
| ---- | -------- | ------------------- |
| 0    | (empty)  | Shell prompt visible |

---

## Phases

### Phase 1: Research & Baseline (one-time)

1. Run the command once
2. Reviewer captures every pane's output and grades each against the checklist
3. Categorize failures with evidence:
    - **Infrastructure** (VM/k3s/kata/docker) — check pod status, container logs
    - **Dependency** (bun install, strategy setup) — check install output, lock files
    - **Runtime** (process crash, test failure) — check process output, stack traces
    - **Timing** (race conditions) — check ordering, sleep delays
4. Report findings to user before making any changes

### Phase 2: Fix Cycle (iterative, max 3 rounds per issue)

1. Orchestrator creates tasks from Phase 1 findings, each with:
    - The specific failure and evidence
    - Diagnostic steps to confirm root cause
    - Acceptance criteria
    - Verification commands
2. Implementor works through tasks using the diagnosis protocol (see below)
3. When implementor reports done: reviewer independently verifies by tearing down and re-running
4. If reviewer finds issues: back to implementor with evidence
5. Max 3 implementor<->reviewer cycles per issue. If stuck, escalate to user.

### Phase 3: Consistency Validation (cron loop)

A recurring cron job runs the validation cycle. Each cycle:

1. **Check status** — read `STATUS.json`. If `consecutivePasses >= 5`, do nothing (we're done).
2. **Check readiness** — verify any previous run has fully completed before tearing down:
    - Check if tmux session `test` exists
    - If it does, check if all panes have reached their ready signals
    - If a run is still in progress (panes not ready yet), skip this cycle and wait for the next one
3. **Tear down** — `bun run src/cli.ts rm --force test`
4. **Spin up** — `bun run src/cli.ts new --mode dev --untrusted --use-local-branch --no-focus test`
5. **Wait for readiness** — actively poll panes for ready signals:
    - Poll `agent:0` until claude prompt visible
    - Poll `test:0` until test results appear
    - Poll `devtools:0` until server output visible
    - Poll `shell:0` until shell prompt visible
    - Global timeout: 10 minutes. If any pane hasn't reached ready state by then, that's a failure.
6. **Verify** — reviewer runs full checklist (pane health, test results, Playwright devtools check)
7. **Record result** — append to `runs.jsonl`, update `STATUS.json`
8. **On failure** — pause loop, create tasks for implementor to diagnose and fix, reset consecutive count to 0
9. **On pass** — increment consecutive count, continue loop

---

## Port Discovery

To find the devtools port for Playwright verification:

```bash
bun run src/cli.ts list
```

This outputs port mappings for running agents, e.g.:

```
  devtools: localhost:31234
```

Parse the port number from this output to construct the Playwright URL.

---

## Failure Diagnosis Protocol

When a pane fails, the reviewer collects:

1. Full pane output: `tmux capture-pane -t test:<window>.<pane> -p -S -1000`
2. Process status: is anything running in the pane?
3. Container logs if relevant: `kubectl logs agent-test -c agent` or `docker logs agent-test`
4. Related file state (config, lock files, build output)

The implementor then follows this sequence — **no skipping steps**:

1. **Observe** — state what the evidence shows (quote the output)
2. **Hypothesize** — state what it thinks the cause is
3. **Test** — state what diagnostic it will run to confirm
4. **Run** — execute the diagnostic, report results
5. **Confirm or revise** — if diagnostic confirms, propose a fix. If inconclusive, add instrumentation and re-run. Do
   not guess.

---

## Persisted Artifacts

### `STATUS.json`

Current state of the stability loop. Read by the cron job and by fresh agents picking up work.

```json
{
    "phase": "baseline | fixing | validating | complete",
    "consecutivePasses": 0,
    "totalRuns": 0,
    "lastRunTimestamp": null,
    "lastFailureReason": null,
    "blocked": false,
    "blockedReason": null
}
```

### `runs.jsonl`

One JSON line per completed cycle. Append-only audit trail.

```json
{
    "run": 1,
    "timestamp": "2026-04-04T12:00:00Z",
    "result": "pass | fail",
    "panes": {
        "agent:0": {
            "status": "pass | fail",
            "signal": "what was found",
            "evidence": "captured output snippet"
        },
        "test:0": { "status": "pass | fail", "signal": "...", "evidence": "..." },
        "devtools:0": { "status": "pass | fail", "signal": "...", "evidence": "..." },
        "shell:0": { "status": "pass | fail", "signal": "...", "evidence": "..." }
    },
    "playwrightCheck": { "status": "pass | fail", "evidence": "screenshot path or error" },
    "durationSeconds": 300,
    "notes": "free-text for anything notable"
}
```

### `CHECKLIST.md`

See separate file — the canonical per-run verification checklist.

---

## Handover Instructions

When spawning a fresh orchestrator or agent:

1. Point it to this `PLAN.md` as the authoritative plan
2. Have it read `STATUS.json` to understand current phase and progress
3. Have it read the tail of `runs.jsonl` to understand recent history
4. Have it read `CHECKLIST.md` for the verification criteria
5. Summarize what was attempted, what failed, and what to do differently (don't dump full history)

---

## Key Code Locations

| Area                              | Path                          |
| --------------------------------- | ----------------------------- |
| CLI entry point                   | `src/cli.ts`                  |
| `new` command handler             | `src/commands/new.ts`         |
| `rm` command handler              | `src/commands/rm.ts`          |
| `list` command handler            | `src/commands/list.ts`        |
| Agent info & port discovery       | `src/commands/agent-info.ts`  |
| Agent lifecycle (start, stop, rm) | `src/lib/agent.ts`            |
| Backend dispatch (k3s vs docker)  | `src/lib/backend.ts`          |
| Container spec builder            | `src/lib/container-spec.ts`   |
| Kubernetes operations             | `src/lib/k8s.ts`              |
| tmux session setup                | `src/lib/tmux.ts`             |
| Git (worktree, bare repo)         | `src/lib/git/`                |
| VM readiness checks               | `src/lib/vm.ts`               |
| Config schema                     | `src/lib/config.ts`           |
| Dependency strategies             | `src/lib/strategies.ts`       |
| Image cache                       | `src/lib/cache.ts`            |
