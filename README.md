# agentbox

Secure, isolated development environments for AI coding agents.

Agentbox creates sandboxed workspaces where AI agents can write and run code safely. Each agent gets
its own git worktree, container (with optional VM isolation via Kata Containers), and tmux session —
fully isolated from your main repo and from each other.

Supports Linux.

## How it works

When you run `agentbox new my-agent`, agentbox:

1. Creates a **bare git clone** of your repo in a sibling directory (`../<repo>-agents/.bare`)
2. Sets up a **git worktree** on a new branch for the agent
3. Builds an **OCI image** (Ubuntu-based with Docker-in-Docker support)
4. Starts a **container** — either a Kata VM pod via k3s (secure) or a Docker container (fallback)
5. Runs **dependency strategies** (nix, direnv, claude, bun, yarn, pnpm, npm)
6. Opens a **tmux session** with preconfigured window layouts

The agent's branch lives in the bare repo, completely isolated from your working tree. When the
agent is done, `agentbox checkout my-agent` fetches the branch back into your main repo.

## Installation

### Prerequisites

- [Bun](https://bun.sh/) (runtime and bundler)
- [Git](https://git-scm.com/)
- Either [Docker](https://docs.docker.com/get-docker/) or [k3s](https://k3s.io/) +
  [Kata Containers](https://katacontainers.io/) for VM isolation
- [tmux](https://github.com/tmux/tmux)

### Build

```bash
npm run build
```

This produces a standalone `./agentbox` binary.

### As an npm dependency

Install from GitHub in another repo:

```bash
npm install github:bentefay/agentbox
# or: pnpm add github:bentefay/agentbox
```

This makes `agentbox` available as `node_modules/.bin/agentbox` (runnable via `npx agentbox`, `pnpx agentbox`, etc).

### Development

A Nix flake is provided for a reproducible dev environment:

```bash
nix develop
```

This adds `agentbox` to your PATH via `bin/agentbox`, which runs the TypeScript source directly with Bun.

Or install dependencies manually and run directly:

```bash
bun install
bun run src/cli.ts
```

## Usage

### Create an agent

```bash
agentbox new my-agent
```

Creates a worktree, starts a container, sets up tmux, and attaches you to the session. The agent
runs on a new git branch named `my-agent`.

Options:

- `-m, --mode <mode>` — select a tmux mode (window/pane layout) defined in your config
- `--no-tmux` — start the container without opening tmux
- `--trust` — trust environment (run host-side operations like direnv)
- `--untrusted` — skip host-side operations
- `--use-local-branch` — prefer local branch version on conflict

### Attach to an agent

```bash
agentbox attach my-agent
```

Re-attach to an existing agent's tmux session. Starts the container if it's stopped.

### List agents

```bash
agentbox list
```

Shows all agents with their branch, container status, exposed ports, and tmux sessions.

### Stop an agent

```bash
agentbox stop my-agent
```

Stops the container but preserves the worktree and branch.

### Remove an agent

```bash
agentbox rm my-agent
```

Stops the container and removes the worktree. Use `--force` to skip confirmation.

### Checkout an agent's work

```bash
agentbox checkout my-agent
```

Fetches the agent's branch from the bare repo into your main repo and checks it out.

### Execute a command in an agent's container

```bash
agentbox exec my-agent -- ls /workspace
```

### View container logs

```bash
agentbox logs my-agent
agentbox logs my-agent -f        # follow
agentbox logs my-agent --init    # init container logs (k3s only)
```

### Pre-cache container images

```bash
agentbox cache
```

Pulls and caches container images defined in your config (`cacheImages`) for faster agent startup.

### Verify VM setup

```bash
agentbox check-vm
```

Runs pre-flight checks for the k3s + Kata Containers stack and outputs fix scripts for any issues
found.

## Configuration

Create an `agentbox.config.ts` in your project root:

```typescript
import { defineConfig, nixStrategy, yarnStrategy, claudeStrategy } from "agentbox";

export default defineConfig({
  // Tmux window/pane layouts
  tmuxModes: [
    {
      name: "dev",
      windows: [
        { name: "agent", panes: [{ command: "claude --dangerously-skip-permissions" }] },
        { name: "server", panes: [{ command: "yarn dev" }] },
      ],
    },
  ],

  // Strategies detect tools, mount volumes, and install dependencies.
  // Auto-detected if omitted. Each is a factory function with optional config.
  dependencyStrategies: [
    nixStrategy(),
    claudeStrategy(),
    yarnStrategy({ cachePath: "~/.cache/yarn" }),
  ],

  // Container resource limits
  resources: {
    memoryGi: 16,
    cpuLimit: 8,
  },

  // Ports to expose from the container
  servicePorts: [
    { name: "https", port: 443 },
    { name: "vite", port: 3000 },
  ],

  // Container images to pre-cache (static list or async function)
  cacheImages: ["postgres:16", "redis:7-alpine"],
});
```

## Backends

### k3s + Kata Containers (default)

When k3s is available, agentbox runs each agent in a Kata Container pod — a lightweight VM providing
hardware-level isolation. This is the secure default for running untrusted agent code.

Each agent gets:

- Its own VM via Cloud Hypervisor
- A Kubernetes pod with the Kata runtime class
- A NodePort service for exposed ports
- Docker-in-Docker support inside the VM

Run `agentbox check-vm` to verify your setup.

### Docker (fallback)

When k3s isn't available, agentbox falls back to plain Docker containers. These run with
`--privileged` for Docker-in-Docker support but without VM isolation.

## Git isolation model

```
your-repo/
├── .git/
├── src/
└── ...

../your-repo-agents/
├── .bare/                    # bare clone with two remotes:
│   ├── refs/remotes/origin/  #   origin → GitHub
│   └── refs/remotes/local/   #   local  → your main repo
├── agent-alice/              # worktree on branch agent-alice
└── agent-bob/                # worktree on branch agent-bob
```

The bare repo sits in a sibling directory, keeping agent worktrees completely separate from your
working tree. Branches are synced from both your local repo and the remote, with interactive
conflict resolution when the same branch exists in multiple places with different commits.

## Dependency strategies

Agentbox auto-detects your project's build system and runs the appropriate install commands inside
the container:

| Strategy    | Detection           | Host prep (trusted)  | Container install                | Volumes              |
| ----------- | ------------------- | -------------------- | -------------------------------- | -------------------- |
| **nix**     | `flake.nix`         | `nix print-dev-env`  | Offline fallback if cached       | `/nix`               |
| **direnv**  | `.envrc`            | `direnv allow`       | —                                | —                    |
| **claude**  | `which claude`      | —                    | —                                | binary, config       |
| **bun**     | `bun.lock`          | —                    | `bun install --frozen-lockfile`  | cache (optional)     |
| **yarn**    | `yarn.lock`         | —                    | `yarn install --frozen-lockfile` | cache (optional)     |
| **pnpm**    | `pnpm-lock.yaml`    | —                    | `pnpm install --frozen-lockfile` | store (optional)     |
| **npm**     | `package-lock.json` | —                    | `npm ci`                         | cache (optional)     |

Strategies can also be configured explicitly in `agentbox.config.ts`.

## Scripts

| Script              | Description                  |
| ------------------- | ---------------------------- |
| `npm run build`     | Compile to standalone binary |
| `npm run typecheck` | TypeScript type checking     |
| `npm run test`      | Run tests (via Bun)          |

## License

MIT
