# Per-Run Verification Checklist

The reviewer must check **every item** on every run. No shortcuts. A run only passes if all items pass.

Use `tmux capture-pane -t test:<window>.<pane> -p -S -1000` to capture pane output.

---

## Infrastructure

- [ ] Agent container is running: `kubectl get pod agent-test -n agents` (k3s) or `docker ps --filter name=agent-test` (Docker)
- [ ] Container is ready and accepting exec: `bun run src/cli.ts exec test -- echo ok`
- [ ] All expected tmux windows exist: `tmux list-windows -t test` should show: agent, test, devtools, shell
- [ ] All expected panes exist:
    - `tmux list-panes -t test:agent` — 1 pane
    - `tmux list-panes -t test:test` — 1 pane
    - `tmux list-panes -t test:devtools` — 1 pane
    - `tmux list-panes -t test:shell` — 1 pane

## Pane Health

### agent:0 — `claude --dangerously-skip-permissions`

- [ ] Claude CLI is running (prompt or welcome message visible)
- [ ] No error messages (e.g. "command not found", permission errors, missing config)
- [ ] Process is still alive (not exited)

### test:0 — `bun test --watch`

- [ ] Tests have run at least once
- [ ] Test results are displayed (pass/fail counts visible)
- [ ] No fatal errors or crashes in output
- [ ] Watch mode is active (not exited)

### devtools:0 — docker build + run claude-devtools

- [ ] Docker image build completed (or was cached)
- [ ] Container is running (docker run did not error)
- [ ] Server is listening (port 3456 output visible, or process running)
- [ ] No fatal errors in output

### shell:0 — (empty shell)

- [ ] Shell prompt is visible
- [ ] No error messages

## Playwright Verification

- [ ] Discover devtools port from `bun run src/cli.ts list` output (parse `devtools: localhost:<port>`)
- [ ] Navigate to `http://localhost:<port>` via Playwright MCP
- [ ] Page loads without connection error
- [ ] Page renders correctly (not blank, not error page)
- [ ] Screenshot captured as evidence (save to `.agent-memory/e2e-loop/` directory)

## Diagnosis Quality Gate

The reviewer checks that the implementor followed the principles:

- [ ] Every code change in this cycle was preceded by diagnostic evidence
- [ ] No changes were made based on guesses (check the implementor's reasoning)
- [ ] No behavioral changes were made without orchestrator/user approval
- [ ] No failures were dismissed as "pre-existing"
- [ ] No `git stash`, `git checkout .`, or revert was used to test whether a failure is "pre-existing" — all failures are owned
- [ ] The implementor flagged ambiguous behavioral questions rather than guessing

---

## Recording Results

After completing the checklist, the reviewer must:

1. Record the result in `runs.jsonl` (one JSON line with all pane statuses and evidence)
2. Update `STATUS.json` (increment consecutivePasses on pass, reset to 0 on fail)
3. Report summary to the orchestrator
