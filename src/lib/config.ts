import { z } from "zod";

import type { Result } from "./result";

/**
 * A single pane inside a tmux window.
 */
export interface TmuxPane {
    /** Shell command to execute when the pane opens (empty string for a plain shell). */
    command: string;
    /**
     * Optional delay before sending the command, useful when a prior pane
     * needs time to start (e.g. waiting for a database container).
     */
    sleepSeconds?: number;
}

/** @internal */
export const TmuxPaneSchema: z.ZodType<TmuxPane> = z.object({
    command: z.string(),
    sleepSeconds: z.number().optional()
});

/**
 * A tmux window containing one or more panes. When multiple panes are defined
 * they are split vertically within the window.
 */
export interface TmuxWindow {
    /** Display name of the tmux window. */
    name: string;
    /** Panes to create inside this window, split vertically. */
    readonly panes: readonly TmuxPane[];
}

/** @internal */
export const TmuxWindowSchema: z.ZodType<TmuxWindow> = z.object({
    name: z.string(),
    panes: z.array(TmuxPaneSchema).readonly()
});

/**
 * A named tmux layout selected via `agentbox new --mode <name>`.
 * Each mode defines a set of windows that are created when the agent starts.
 */
export interface TmuxMode {
    /** Name used to select this mode via `--mode`. */
    name: string;
    /** Windows to create when the agent starts in this mode. */
    readonly windows: readonly TmuxWindow[];
}

/** @internal */
export const TmuxModeSchema: z.ZodType<TmuxMode> = z.object({
    name: z.string(),
    windows: z.array(TmuxWindowSchema).readonly()
});

/**
 * A host-to-container volume mount. Paths are resolved relative to the host;
 * `~` is expanded automatically.
 */
export interface VolumeMount {
    /** Path on the host machine. */
    hostPath: string;
    /** Mount point inside the container. */
    containerPath: string;
    /** When `true`, the volume is mounted read-only. */
    readOnly?: boolean;
}

/** @internal */
export const VolumeMountSchema: z.ZodType<VolumeMount> = z.object({
    hostPath: z.string(),
    containerPath: z.string(),
    readOnly: z.boolean().optional()
});

/**
 * A port to expose from the agent container.
 * Exposed ports are visible via `agentbox list` once the agent is running.
 */
export interface ServicePort {
    /** Human-readable label shown in `agentbox list` output. */
    name: string;
    /** Port number on the host (k3s: allocated as a NodePort; Docker: bound directly). */
    port: number;
    /** Port inside the container. Defaults to {@link port} when omitted. */
    targetPort?: number;
}

/** @internal */
export const ServicePortSchema: z.ZodType<ServicePort> = z.object({
    name: z.string(),
    port: z.number(),
    targetPort: z.number().optional()
});

/**
 * Resource limits applied to the agent container/VM.
 */
export interface ResourceLimits {
    /** Memory limit in GiB (must be positive). */
    memoryGi: number;
    /** Maximum CPU cores. Omit to leave uncapped. */
    cpuLimit?: number;
}

/** @internal */
export const ResourceLimitsSchema: z.ZodType<ResourceLimits> = z.object({
    memoryGi: z.number().positive(),
    cpuLimit: z.number().optional()
});

/**
 * Container images to pre-cache via `agentbox cache`. Either a static list
 * or an async function that resolves one (useful for dynamic image tags).
 */
export type CacheImages = readonly string[] | (() => Promise<readonly string[]>);

/** Context passed to {@link DependencyStrategy.hostPrepare}. */
export interface HostPrepareContext {
    readonly trusted: boolean;
    readonly logWarning: (message: string) => void;
}

/**
 * A dependency strategy detects a build tool, optionally prepares the host,
 * installs dependencies inside the container, and declares volumes to mount.
 *
 * Strategies run in declaration order. Use the built-in factories
 * (`nixStrategy`, `bunStrategy`, etc.) or implement this interface for custom tooling.
 *
 * @example
 * ```ts
 * const custom: DependencyStrategy = {
 *   name: "my-tool",
 *   detect: async (root) => fs.existsSync(path.join(root, "my-tool.lock")),
 *   containerInstall: async () => ["my-tool install"],
 * };
 * ```
 */
export interface DependencyStrategy {
    /** Unique identifier shown in logs. */
    readonly name: string;
    /** Return `true` if this strategy applies to the given repo root. */
    readonly detect: (repoRoot: string) => Promise<boolean>;
    /** Run on the host before the container starts. Only called when `--trust` is set. */
    readonly hostPrepare?: (
        ctx: HostPrepareContext,
        repoRoot: string,
        worktreePath: string
    ) => Promise<Result<void, string>>;
    /** Return shell commands to run inside the container after it starts. */
    readonly containerInstall?: (workspacePath: string) => Promise<readonly string[]>;
    /** Return shell snippets sourced at the top of every tmux pane (e.g. `source .nix-dev-env.sh`). */
    readonly shellInit?: () => readonly string[];
    /** Return additional volumes to mount (e.g. nix store, package manager cache). */
    readonly volumes?: () => readonly VolumeMount[];
}

/**
 * Top-level agentbox configuration, typically defined in `agentbox.config.ts`
 * at the project root and passed to {@link defineConfig}.
 *
 * @example
 * ```ts
 * import { defineConfig, nixStrategy, bunStrategy } from "agentbox";
 *
 * export default defineConfig({
 *   tmuxModes: [
 *     {
 *       name: "dev",
 *       windows: [
 *         { name: "agent", panes: [{ command: "claude" }] },
 *         { name: "tests", panes: [{ command: "bun test --watch" }] },
 *       ],
 *     },
 *   ],
 *   dependencyStrategies: [nixStrategy(), bunStrategy()],
 *   resources: { memoryGi: 16, cpuLimit: 8 },
 *   servicePorts: [{ name: "vite", port: 3000 }],
 *   cacheImages: ["node:20-slim"],
 * });
 * ```
 */
export interface AgentboxConfig {
    /** Named tmux layouts selectable via `--mode`. */
    readonly tmuxModes: readonly TmuxMode[];
    /** Dependency strategies to run. Auto-detected from the repo when empty. */
    readonly dependencyStrategies: readonly DependencyStrategy[];
    /** Override the default container image (Ubuntu-based with Docker-in-Docker). */
    containerImage?: string;
    /** CPU and memory limits for the agent container/VM. */
    resources?: ResourceLimits;
    /** Additional host-to-container volume mounts beyond those declared by strategies. */
    readonly volumes?: readonly VolumeMount[];
    /** Ports to expose from the container. Shown in `agentbox list` when the agent is running. */
    readonly servicePorts?: readonly ServicePort[];
    /** Shell commands run as root inside the container before dependency install (e.g. sysctl tweaks). */
    readonly environmentSetup?: readonly string[];
    /** Container images to pull ahead of time via `agentbox cache`. */
    cacheImages?: CacheImages;
}

/** @internal */
export const AgentboxConfigSchema: z.ZodType<AgentboxConfig> = z.object({
    tmuxModes: z.array(TmuxModeSchema).readonly(),
    dependencyStrategies: z.array(z.custom<DependencyStrategy>()).readonly(),
    containerImage: z.string().optional(),
    resources: ResourceLimitsSchema.optional(),
    volumes: z.array(VolumeMountSchema).readonly().optional(),
    servicePorts: z.array(ServicePortSchema).readonly().optional(),
    environmentSetup: z.array(z.string()).readonly().optional(),
    cacheImages: z.custom<CacheImages>().optional()
});

/** Resolve {@link CacheImages} to a concrete list of image references. */
export async function resolveCacheImages(cacheImages: CacheImages): Promise<readonly string[]> {
    return typeof cacheImages === "function" ? cacheImages() : cacheImages;
}

/**
 * Identity function that validates and returns the config object.
 * Use as the default export of `agentbox.config.ts` for type-safe configuration.
 */
export function defineConfig(config: AgentboxConfig): AgentboxConfig {
    return config;
}
