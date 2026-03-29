import type { AgentboxConfig } from "./config";
import type { ContainerSpec } from "./container-spec";
import type { AgentName, BareRepoPath } from "./git";
import type { AllocatedPort, PodState } from "./k8s";
import type { Result } from "./result";
export type AgentState = PodState;
export interface BackendStartSpec {
    readonly agentName: AgentName;
    readonly worktreePath: string;
    readonly bareRepoPath: BareRepoPath;
    readonly config: AgentboxConfig;
    readonly imageName: string;
    readonly imageCachePath: string | undefined;
    readonly gitUser: {
        readonly name: string;
        readonly email: string;
    } | undefined;
    readonly strategyVolumes?: readonly {
        readonly hostPath: string;
        readonly containerPath: string;
        readonly readOnly?: boolean;
    }[];
}
export type ContainerBackend = {
    readonly kind: "k3s";
    readonly podName: string;
    readonly agentName: AgentName;
} | {
    readonly kind: "docker";
    readonly containerName: string;
    readonly agentName: AgentName;
};
export declare function createBackend(agentName: AgentName, kind: "k3s" | "docker"): ContainerBackend;
export declare function getBackendState(backend: ContainerBackend): Promise<AgentState>;
export declare function isBackendRunning(backend: ContainerBackend): Promise<boolean>;
export declare function startBackend(backend: ContainerBackend, spec: BackendStartSpec): Promise<Result<void, string>>;
export declare function stopBackend(backend: ContainerBackend): Promise<Result<void, string>>;
export interface ExecCommandOptions {
    readonly interactive?: boolean;
}
export declare function buildExecCommand(backend: ContainerBackend, command?: string, options?: ExecCommandOptions): string;
export interface BackendLogsOptions {
    readonly follow?: boolean;
    readonly init?: boolean;
}
export declare function buildLogsCommand(backend: ContainerBackend, options?: BackendLogsOptions): Result<string, string>;
export declare function getBackendLogs(backend: ContainerBackend, options?: BackendLogsOptions): Promise<Result<string, string>>;
export declare function getBackendServicePorts(backend: ContainerBackend): Promise<readonly AllocatedPort[]>;
export declare function parsePortsLabel(raw: string): readonly AllocatedPort[];
export declare function buildDockerRunCommand(containerName: string, imageName: string, container: ContainerSpec): string;
