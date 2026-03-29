import * as path from "path";

import type { AgentboxConfig, ServicePort } from "./config";
import { expandHome } from "./exec";
import type { BareRepoPath } from "./git";

// ============================================================================
// Shared container specification — single source of truth for env vars,
// volumes, and setup commands used by both k3s and Docker backends.
// ============================================================================

export interface ContainerEnvVar {
    readonly name: string;
    readonly value: string;
}

export interface ContainerVolume {
    readonly hostPath: string;
    readonly containerPath: string;
    readonly readOnly?: boolean;
}

export interface ContainerSpec {
    readonly env: readonly ContainerEnvVar[];
    readonly volumes: readonly ContainerVolume[];
    readonly ports: readonly ServicePort[];
    readonly environmentSetup: readonly string[];
}

/** Minimal input required by buildContainerSpec — satisfied by both BackendStartSpec and PodSpec. */
export interface ContainerSpecInput {
    readonly agentName: string;
    readonly worktreePath: string;
    readonly bareRepoPath: BareRepoPath;
    readonly config: AgentboxConfig;
    readonly imageCachePath?: string | undefined;
    readonly gitUser?: { readonly name: string; readonly email: string } | undefined;
    readonly strategyVolumes?: readonly {
        readonly hostPath: string;
        readonly containerPath: string;
        readonly readOnly?: boolean;
    }[];
}

/**
 * Pure function computing the canonical env vars, volumes, and setup commands
 * shared by both k3s and Docker backends. Single source of truth — prevents
 * drift between the two code paths.
 */
export function buildContainerSpec(spec: ContainerSpecInput): ContainerSpec {
    const userVolumes = spec.config.volumes ?? [];

    const env: readonly ContainerEnvVar[] = [
        { name: "AGENT_NAME", value: spec.agentName },
        { name: "HOME", value: "/home/agent" },
        ...(spec.gitUser?.name
            ? [
                  { name: "GIT_AUTHOR_NAME", value: spec.gitUser.name },
                  { name: "GIT_COMMITTER_NAME", value: spec.gitUser.name },
              ]
            : []),
        ...(spec.gitUser?.email
            ? [
                  { name: "GIT_AUTHOR_EMAIL", value: spec.gitUser.email },
                  { name: "GIT_COMMITTER_EMAIL", value: spec.gitUser.email },
              ]
            : []),
    ];

    const volumes: readonly ContainerVolume[] = [
        { hostPath: spec.worktreePath, containerPath: "/workspace" },
        { hostPath: spec.bareRepoPath, containerPath: spec.bareRepoPath },
        ...(spec.strategyVolumes ?? []),
        ...userVolumes.map((m) => ({
            hostPath: expandHome(m.hostPath),
            containerPath: m.containerPath,
            readOnly: m.readOnly,
        })),
        ...(spec.imageCachePath
            ? [
                  {
                      hostPath: path.dirname(spec.imageCachePath),
                      containerPath: "/cache",
                      readOnly: true,
                  },
              ]
            : []),
    ];

    const environmentSetup: readonly string[] = spec.config.environmentSetup ?? [
        "echo '127.0.0.1 host.docker.internal' >> /etc/hosts",
        "sysctl -w fs.inotify.max_user_watches=524288",
    ];

    const ports: readonly ServicePort[] = spec.config.servicePorts ?? [];

    return { env, volumes, ports, environmentSetup };
}
