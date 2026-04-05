---
description: Actionable code review using a team of specialized reviewers
allowed-tools:
    Bash(git diff:*), Bash(git log:*), Bash(git show:*), Bash(git --no-pager:*), Grep, Glob, Read, Agent, TaskCreate,
    TaskList, TaskGet, TaskUpdate, SendMessage, TeamCreate, TeamDelete
---

Goal: Output ONLY actionable issues that require changes. No summaries, praise, opinions, or process narration.

## Scope

- Review the diff at HEAD against origin/main. Use per-commit context if helpful, but judge the PR as a whole. Review
  commit messages for context.
- Assume all tests pass and code compiles. Looking for higher-level issues.
- Flag only clear MEDIUM or HIGH severity issues. Skip low-severity nits and subjective style.

## Diff command

```
git --no-pager diff --no-color --patch --unified=3 --find-renames=50% origin/main...HEAD
```

## Review process

### Step 1: Scout the PR

The lead must NOT run the full diff — it needs its context window for coordination, cross-checking, and synthesis. Each
reviewer will run the full diff in their own context window.

1. Run `git diff --stat origin/main...HEAD` (filenames + line counts only) and `git log --oneline origin/main...HEAD`
   (commit messages) to understand the shape and intent of the PR.
2. Group changed files by area (e.g., commands, lib, config, tests, infrastructure).
3. Spawn parallel subagents (Explore type) — one per group — to read the diffs for their group and return a structured
   summary: what changed, why (inferred from commit messages and code), and anything that looks notable.
4. Use the summaries to build a mental model of the PR. This informs the reviewer prompts in Step 2 — include relevant
   context about what the PR does so reviewers can focus their investigation.

### Step 2: Create the review team

1. Run `TeamCreate` with team_name `pr-review`.
2. Create 5 review tasks using `TaskCreate` — one per reviewer listed below. Use the reviewer name as the task subject
   (e.g., "correctness review"). Include the reviewer's focus area in the task description.
3. Create 4 cross-check tasks — one per **code reviewer** (correctness, security, reliability, patterns). Subject
   format: "cross-check: {name}". Set each cross-check task as `blockedBy` its corresponding review task using
   `TaskUpdate`.

### Step 3: Spawn reviewers as teammates

Spawn 5 teammates in parallel using the Agent tool with `team_name: "pr-review"`. Use the reviewer name as the teammate
`name`. Each teammate's prompt must include:

- The diff command to run (above)
- Their specific focus area and detection targets
- The validation rules (below) — for code reviewers only
- Instructions to send findings back to the lead via `SendMessage` using the appropriate report format (below)
- Explicit instruction: **do NOT edit any files — this is a review, not an implementation**
- Instructions to mark their review task as completed via `TaskUpdate` after sending findings
- Instructions to then check `TaskList` for their cross-check task (if they are a code reviewer) — it will become
  unblocked once all review tasks complete

#### Reviewers

| Name                | subagent_type   | Focus |
| ------------------- | --------------- | ----- |
| **correctness**     | general-purpose | Logic errors, bugs, edge cases (null/empty, off-by-one, race conditions), missing/incorrect error handling, API/contract breaks, type errors. Should use Explore subagents to verify findings in parallel — check call sites, surrounding context, and existing error handling. Must also spawn a dedicated Explore subagent for **breaking change detection**: changed function signatures, renamed/removed public types/fields/exports, changed Zod schemas that affect config format |
| **security**        | general-purpose | Injection (command injection via shell commands is particularly relevant), authN/authZ, secrets in code, insecure defaults, PII logging. Should use Explore subagents to verify findings in parallel — check input validation and sanitization that may exist elsewhere |
| **reliability**     | general-purpose | Performance antipatterns with measurable impact (N+1, O(n^2), unbounded I/O/memory), concurrency issues, resource leaks, race conditions in async code, process lifecycle issues. Should use Explore subagents to verify findings in parallel — trace call paths, check resource lifecycle management across files |
| **patterns**        | general-purpose | Codebase consistency — read CLAUDE.md and `.claude/rules/typescript-style.md` to learn conventions, then check whether the PR follows them. Search the codebase (via Explore subagents) for existing patterns, utilities, and abstractions the PR could have reused instead of introducing new approaches |
| **agent-artifacts** | general-purpose | Should any agent artifacts be updated based on this PR? Apply the "would an agent think to look for this?" test from CLAUDE.md's Agent Memory guidelines. Focus on: staleness (outdated references, renamed paths, removed APIs), gotchas agents would hit without guidance, and patterns agents should follow but won't discover unprompted. Do NOT recommend documenting things agents would find naturally by reading post-merge code |

#### Subagent usage for teammates

All reviewers should use Explore subagents (via the Agent tool) to parallelize investigation work. This keeps the
teammate's context window focused on the diff and review while offloading codebase searches to subagents.

Launch all 5 teammates in parallel. They will work on their review tasks and send findings via `SendMessage`.

### Step 4: Collect review findings

Monitor progress via `TaskList`. Wait for all 5 review tasks to be marked completed. Do NOT begin cross-checking until
all review tasks are done.

As teammates send their findings via `SendMessage`, collect and organize them.

### Step 5: Cross-check (code reviewers only)

Once all review tasks are complete:

1. Compile the combined findings from **correctness**, **security**, **reliability**, and **patterns**.
2. Send a message via `SendMessage` to each of the 4 code reviewer teammates with:
    - The combined list of findings from all 4 code reviewers
    - Instructions to challenge any finding they believe is a false positive, providing evidence from the codebase
    - Instructions to send challenges back via `SendMessage` and mark their cross-check task as completed
3. Allow one round of challenges.

The **agent-artifacts** reviewer does not participate in cross-checking — its recommendations are independent.

### Step 6: Synthesize and output

Collect surviving code findings (drop any issue that was convincingly challenged). Collect agent artifact
recommendations separately. Deduplicate and output per the formats below.

### Step 7: Cleanup

1. Send shutdown requests to all 5 teammates via `SendMessage` with `type: "shutdown_request"`.
2. After all teammates have shut down, run `TeamDelete` to clean up the team.

## Validation rules

Include these verbatim in each **code reviewer's** prompt (correctness, security, reliability, patterns):

Before reporting ANY issue, you MUST:

1. **Verify context**: Use search tools to examine surrounding code, related functions, and call sites. A pattern that
   looks wrong in isolation may be correct in context.
2. **Check for existing handling**: Search for error handling, validation, or guards that may exist elsewhere.
3. **Confirm the bug is real**: If unsure, investigate further or skip it.
4. **Test your reasoning**: "What concrete scenario would trigger this bug?" If you can't articulate one, don't report
   it.
5. **Apply the 90% confidence rule**: Only report issues where >90% confident it's a real problem.

If after investigation you determine an issue is not real, or is likely intentional, do NOT mention it at all — not even
to say you considered and rejected it.

## Code issue format (strict)

For each code issue, output a block with exactly these fields:

- Severity: High | Medium
- Category: Bug | Security | Data integrity | Error handling | Performance | Concurrency | Reliability | API/Contract |
  Maintainability | Pattern violation
- File: {path}:{diff line(s)}
- Finding: {concise statement of what's wrong}
- Why: {impact/consequence; reference CWE/OWASP if security}
- Fix: {specific change to make}; include a minimal code snippet or command if useful

## Agent artifact format

For each recommendation, output:

- File: {path to agent artifact}
- Recommendation: {what should be added or changed}
- Reason: {why this would help future agent sessions}

## Deduplication

If the same issue recurs, report it once and reference in later instances as "See issue #N".

## Rules

- Do NOT run tests (assume they all pass).
- Do NOT propose premature micro-optimizations.
- Do NOT restate code or summarize the PR.
- Do NOT comment on overall quality; focus on fixable issues only.
- Do NOT report issues you aren't confident about — investigate first.
- Do NOT show your work or explain issues you decided not to report.
- Reviewers must NOT edit any files.

## Output

Output two sections:

### Code Issues

Emit the list of code issue blocks in the specified format. If none found, output exactly: **NO CODE ISSUES.**

### Agent Artifact Recommendations

Emit the list of agent artifact recommendations. If none found, output exactly: **NO AGENT ARTIFACT RECOMMENDATIONS.**
