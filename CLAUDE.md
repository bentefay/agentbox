# Agentbox

Secure, isolated development environments for AI coding agents.

## Core Values

1. **Challenge assumptions** - Push back; don't just accept requests
2. **Ask before guessing** - If a decision isn't documented, ask first but always propose an answer
3. **Match existing patterns** - Before writing new code, find and follow codebase conventions
4. **Verify before concluding** - Never present a theory as fact; gather evidence (logs, commands, code reads) first
5. **Curate agent memory** - Continuously refine CLAUDE.md, rules, skills, and commands; right-size detail for
   progressive disclosure

## Technology Stack

| Layer   | Technology                            |
| ------- | ------------------------------------- |
| Runtime | Bun                                   |
| Lang    | TypeScript (strict)                   |
| Linting | oxlint                                |
| Format  | oxfmt                                 |
| Testing | bun test                              |

## Code Style

**Prioritize patterns.** Before writing new code, search for existing patterns to reuse or extend. When writing new
code, extract reusable patterns early - future agent sessions benefit from discoverable abstractions.

## Agent Build/Test Workflow

**Before completing work**, evaluate which of these need to run based on your changes:

| Changed         | Must run                                    |
| --------------- | ------------------------------------------- |
| TypeScript code | `bun run typecheck`, relevant `bun test`    |
| Any code        | `bun run lint`, `bun run fmt:check`         |

## Agent Memory

Document patterns for future agent sessions using rules (path-specific conventions) or skills (on-demand workflows).

**Before editing CLAUDE.md files**, ask: would an agent think to look for this?

- Flag patterns and canonical examples agents should follow (they won't search unprompted)
- Warn about gotchas and "don't do X" constraints
- Skip things agents would do correctly with their default behavior
- Document current state, not migration history
