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

1. Read `.claude/skills/e2e-loop/STATUS.json` to understand current phase and progress.
2. Read `.claude/skills/e2e-loop/runs.jsonl` (last 5 entries) to understand recent history.
3. Read `.claude/skills/e2e-loop/CHECKLIST.md` to know the verification criteria.
4. Read `.claude/skills/e2e-loop/PLAN.md` for the full plan, principles, and key code locations.
5. Determine what phase you're in and what to do next.

## Commands

Alternate between trusted and untrusted on each run to exercise both code paths.
Use `totalRuns` from `STATUS.json` to determine: even runs → untrusted, odd runs → trusted.

```
Spin up (untrusted): bun run src/cli.ts new --mode dev --untrusted --use-local-branch --no-focus test
Spin up (trusted):   bun run src/cli.ts new --mode dev --use-local-branch --no-focus test
Tear down:           bun run src/cli.ts rm --force test
List:                bun run src/cli.ts list
```

## Your principles

1. **You do not write code.** You delegate to the implementor and verify via the reviewer.
2. **You do not trust self-reports.** The reviewer independently verifies everything.
3. **You keep your context clean.** Run investigation through subagents.
4. **You think before you act.** At each decision point: what could go wrong? What am I assuming?
5. **You own the outcome.**

---

## Phase 1: Baseline

If `.claude/skills/e2e-loop/STATUS.json` shows `phase: "baseline"` and `totalRuns: 0`:

1. Run the spin-up command. Wait for it to complete (it blocks during setup, then returns).
2. Spawn the reviewer to run the full checklist and capture evidence from every pane.
3. Report findings to the user.
4. Update `.claude/skills/e2e-loop/STATUS.json` to `phase: "fixing"` with the failure details.
5. Do NOT make changes yet — wait for user acknowledgment.

## Phase 2: Fixing

If `.claude/skills/e2e-loop/STATUS.json` shows `phase: "fixing"`:

1. Create the `implement` team: `TeamCreate` with team_name `implement`.
2. Spawn the implementor and reviewer as persistent teammates.
3. Create tasks from the latest failure findings (from `.claude/skills/e2e-loop/runs.jsonl` or baseline).
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
5. When implementor reports done, spawn the reviewer with the appropriate spin-up command (trusted/untrusted).
   The reviewer handles: teardown, spin-up, readiness polling, full checklist, diagnosis quality gate, and result recording.
6. If reviewer finds issues: send them back to implementor with evidence.
7. Max 3 cycles per issue. If stuck, escalate to user.
8. When all issues resolved, update `.claude/skills/e2e-loop/STATUS.json` to `phase: "validating"`.

## Phase 3: Validating

If `.claude/skills/e2e-loop/STATUS.json` shows `phase: "validating"`:

1. Read `.claude/skills/e2e-loop/STATUS.json`. If `consecutivePasses >= 5`, update phase to `"complete"` and stop.
2. Determine trusted/untrusted: if `totalRuns % 2 === 0` → untrusted, else → trusted.
3. Spawn the reviewer with the appropriate spin-up command. The reviewer handles: teardown, spin-up, readiness
   polling, checklist verification, result recording in `runs.jsonl` and `STATUS.json`.
4. When reviewer reports back:
    - On failure: verify `STATUS.json` shows `phase: "fixing"`, `consecutivePasses: 0`. Report to user.
    - On pass: verify `STATUS.json` shows incremented `consecutivePasses`. If now >= 5, set `phase: "complete"`.

## Phase: Complete

If `consecutivePasses >= 5`: report success to the user. Done.

---

## Spawning agents

### Implementor

```
subagent_type: "implementor"
name: "implementor"
```

Provide: task description and evidence, code locations from PLAN.md, the project tooling block, the principles
(especially evidence-before-action), and instruction to flag behavioral questions to you.

### Reviewer

```
subagent_type: "reviewer"
name: "reviewer"
```

The reviewer owns the **full run lifecycle**: teardown, spin-up, readiness polling, checklist verification, and result
recording. The orchestrator tells the reviewer to run; the reviewer reports back with a structured result.

Provide:
- The spin-up command (trusted or untrusted based on `totalRuns % 2`)
- The teardown command
- The full CHECKLIST.md content
- `git diff origin/main...HEAD` for the diff command
- Pane capture commands (`tmux capture-pane -t test:<window>.<pane> -p -S -1000`)
- `.claude/skills/e2e-loop/runs.jsonl` format for recording
- `.claude/skills/e2e-loop/STATUS.json` path
- The port discovery command (`bun run src/cli.ts list` — parse devtools port for Playwright MCP verification)
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

- Same error repeating across cycles — restart agent with different guidance
- Implementor making changes without evidence — stop, remind of principles
- Reviewer passing panes without capturing output — stop, require evidence
- 3+ fix cycles on the same issue — escalate to user
- Guessing — if either agent says "I think" without evidence, push back

---

## Communication

Report to the user at these milestones:

- Baseline results (Phase 1 complete)
- Each fix cycle result (Phase 2, after reviewer verifies)
- Each validation run result (Phase 3, pass or fail)
- Completion (5 consecutive passes)
- Any time you're blocked or need a decision
