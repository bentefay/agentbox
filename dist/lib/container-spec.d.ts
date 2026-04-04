import type { AgentboxConfig, ServicePort } from "./config";
import type { BareRepoPath } from "./git";
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
    readonly gitUser?: {
        readonly name: string;
        readonly email: string;
    } | undefined;
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
export declare function buildContainerSpec(spec: ContainerSpecInput): ContainerSpec;
