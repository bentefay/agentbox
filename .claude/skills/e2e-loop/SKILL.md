---
name: e2e-loop
description: End-to-end stability loop — repeatedly run agentbox new, diagnose failures, fix, and validate
disable-model-invocation: true
allowed-tools:
    Bash, Grep, Glob, Read, Write, Edit, Agent, TaskCreate, TaskList, TaskGet, TaskUpdate, TeamCreate, TeamDelete,
    SendMessage
---

You are the orchestrator for the e2e stability loop. Your goal: make `agentbox new --mode dev` work reliably 5
consecutive times. You do not write code — you delegate to the implementor and verify via the reviewer.

## Startup

1. Read `.agent-memory/e2e-loop/STATUS.json` to understand current phase and progress.
2. Read `.agent-memory/e2e-loop/runs.jsonl` (last 5 entries) to understand recent history.
3. Read `.agent-memory/e2e-loop/CHECKLIST.md` to know the verification criteria.
4. Read `.claude/skills/e2e-loop/PLAN.md` for the full plan, principles, and key code locations.
5. Determine what phase you're in and what to do next.

## Commands

Alternate between trusted and untrusted on each run to exercise both code paths.
Use `totalRuns` from `STATUS.json` to determine: even runs → untrusted, odd runs → trusted.

```
Spin up (untrusted): agentbox new --mode dev --untrusted --use-local-branch --no-focus test
Spin up (trusted):   agentbox new --mode dev --use-local-branch --no-focus test
Tear down:           agentbox rm --force test
List:                agentbox list
```

## Your principles

1. **You do not write code.** You delegate to the implementor and verify via the reviewer.
2. **You do not trust self-reports.** The reviewer independently verifies everything.
3. **You keep your context clean.** Run investigation through teammates.
4. **You think before you act.** At each decision point: what could go wrong? What am I assuming?
5. **You own the outcome.**

---

## Phase 1: Baseline

If `.agent-memory/e2e-loop/STATUS.json` shows `phase: "baseline"` and `totalRuns: 0`:

1. Run the spin-up command. Wait for it to complete (it blocks during setup, then returns).
2. Spawn the reviewer to run the full checklist and capture evidence from every pane.
3. Report findings to the user.
4. Update `.agent-memory/e2e-loop/STATUS.json` to `phase: "fixing"` with the failure details.
5. Do NOT make changes yet — wait for user acknowledgment.

## Phase 2: Fixing

If `.agent-memory/e2e-loop/STATUS.json` shows `phase: "fixing"`:

1. Create the team and teammates if not already done (see **Teammates** section below).
2. The implementor and reviewer persist for the duration of the session — reuse them via `SendMessage`.
3. Create tasks from the latest failure findings (from `.agent-memory/e2e-loop/runs.jsonl` or baseline).
4. Send tasks to the implementor with:
    - The specific failure and evidence
    - The diagnosis protocol from PLAN.md (observe -> hypothesize -> test -> run -> confirm)
    - The relevant code locations from PLAN.md
    - The project tooling block:
        ```
        Project tooling:
          Format:    bun run fmt:check
          Lint:      bun run lint
          Typecheck: bun run typecheck
          Build:     n/a
          Test:      bun test
        ```
5. When implementor reports done, send the reviewer the appropriate spin-up command (trusted/untrusted) via `SendMessage`.
   The reviewer handles: teardown, spin-up, readiness polling, full checklist, diagnosis quality gate, and result recording.
6. If reviewer finds issues: send them back to the implementor with evidence via `SendMessage`.
7. Max 3 cycles per issue. If stuck, escalate to user.
8. When all issues resolved, update `.agent-memory/e2e-loop/STATUS.json` to `phase: "validating"`.

## Phase 3: Validating

If `.agent-memory/e2e-loop/STATUS.json` shows `phase: "validating"`:

1. Create the team and teammates if not already done (see **Teammates** section below).
2. Read `.agent-memory/e2e-loop/STATUS.json`. If `consecutivePasses >= 5`, update phase to `"complete"` and stop.
3. Determine trusted/untrusted: if `totalRuns % 2 === 0` → untrusted, else → trusted.
4. Send the reviewer the appropriate spin-up command via `SendMessage`. The reviewer handles: teardown, spin-up,
   readiness polling, checklist verification, result recording in `runs.jsonl` and `STATUS.json`.
5. When reviewer reports back (via `SendMessage`):
    - On failure: verify `STATUS.json` shows `phase: "fixing"`, `consecutivePasses: 0`. Report to user.
    - On pass: verify `STATUS.json` shows incremented `consecutivePasses`. If now >= 5, set `phase: "complete"`.

## Phase: Complete

If `consecutivePasses >= 5`: report success to the user. Done.

---

## Teammates

Generate a short, unique team name based on the task context (e.g., `e2e-fix-teardown`, `e2e-validate-run9`). Do NOT use
a generic name like `implement` — multiple concurrent sessions may run, and agent names must be globally unique to avoid
cross-team message routing collisions. Create the team with `TeamCreate` using the generated name, then spawn both
teammates using the `Agent` tool with the specified `subagent_type` and unique names derived from the team. Do this
once — at the start of Phase 2, or at the start of Phase 3 if entering validation directly. Teammates persist for the
session. Communicate with them via `SendMessage` — never spawn a new agent for a task a teammate can handle. If you need
to respawn an agent, append a suffix (e.g., `e2e-impl-2`).

### Implementor

```
subagent_type: "implementor"
name: "<team-derived-name>"  # e.g., "e2e-impl-teardown", NOT "implementor"
```

Provide: task description and evidence, code locations from PLAN.md, the project tooling block, the principles
(especially evidence-before-action), and instruction to flag behavioral questions to you.

### Reviewer

```
subagent_type: "reviewer"
name: "<team-derived-name>"  # e.g., "e2e-review-teardown", NOT "reviewer"
```

The reviewer owns the **full run lifecycle**: teardown, spin-up, readiness polling, checklist verification, and result
recording. Send it instructions via `SendMessage`; it reports back with a structured result.

Provide:
- The spin-up command (trusted or untrusted based on `totalRuns % 2`)
- The teardown command
- The full CHECKLIST.md content
- `git diff origin/main...HEAD` for the diff command
- Pane capture commands (`tmux capture-pane -t test:<window>.<pane> -p -S -1000`)
- `.agent-memory/e2e-loop/runs.jsonl` format for recording
- `.agent-memory/e2e-loop/STATUS.json` path
- The port discovery command (`agentbox list` — parse devtools port for Playwright MCP verification)
- Readiness polling instructions: poll each pane every 10s for its ready signal (see PLAN.md), global timeout 10 minutes

The reviewer must:
1. Tear down any existing session (`rm --force test`, then `tmux kill-session -t test` if leftover)
2. Spin up fresh
3. Poll panes for readiness (global 10 min timeout)
4. Run the full checklist with evidence
5. Record result in `runs.jsonl` and update `STATUS.json`
6. Report structured result back to orchestrator

---

## Detecting derailment

- Same error repeating across cycles — restart teammate with different guidance
- Implementor making changes without evidence — stop, remind of principles
- Implementor stashing/reverting to check if a failure is "pre-existing" — stop immediately, remind: all failures are yours to fix, never stash to bisect blame
- Reviewer passing panes without capturing output — stop, require evidence
- 3+ fix cycles on the same issue — escalate to user
- Guessing — if either teammate says "I think" without evidence, push back

---

## Communication

Report to the user at these milestones:

- Baseline results (Phase 1 complete)
- Each fix cycle result (Phase 2, after reviewer verifies)
- Each validation run result (Phase 3, pass or fail)
- Completion (5 consecutive passes)
- Any time you're blocked or need a decision
