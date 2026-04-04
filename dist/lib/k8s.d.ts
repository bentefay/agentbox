import { z } from "zod";
import type { AgentboxConfig } from "./config";
import type { ContainerVolume } from "./container-spec";
import type { AgentName, BareRepoPath } from "./git";
import type { Result } from "./result";
export declare function kubectl(cmd: string): string;
export declare function ensureNamespace(): Promise<void>;
export declare function podName(agentName: AgentName): string;
export type PodState = {
    readonly kind: "running";
} | {
    readonly kind: "stopped";
} | {
    readonly kind: "not-found";
};
export declare function getPodState(name: string): Promise<PodState>;
export declare function deletePodAndService(name: string): Promise<void>;
export interface PodSpec {
    readonly agentName: AgentName;
    readonly worktreePath: string;
    readonly bareRepoPath: BareRepoPath;
    readonly config: AgentboxConfig;
    readonly imageCachePath?: string;
    readonly gitUser?: {
        readonly name: string;
        readonly email: string;
    };
    readonly strategyVolumes?: readonly {
        readonly hostPath: string;
        readonly containerPath: string;
        readonly readOnly?: boolean;
    }[];
}
export interface PodBuildContext {
    readonly cpuCount: number;
}
export declare function createPodBuildContext(): PodBuildContext;
interface NamedVolume {
    readonly name: string;
    readonly hostPath: string;
    readonly containerPath: string;
    readonly readOnly?: boolean;
    readonly type: string;
}
/** Maps ContainerVolume[] (from buildContainerSpec) to k8s-specific named volumes with hostPath types. */
export declare function assignVolumeNames(volumes: readonly ContainerVolume[]): readonly NamedVolume[];
export declare function buildPodYaml(spec: PodSpec, ctx: PodBuildContext): string;
export declare function startPod(spec: PodSpec, ctx: PodBuildContext): Promise<Result<void, string>>;
export declare function stopPod(agentName: AgentName): Promise<void>;
export declare const AllocatedPortSchema: z.ZodObject<{
    name: z.ZodString;
    nodePort: z.ZodNumber;
    targetPort: z.ZodNumber;
}, z.core.$strip>;
export type AllocatedPort = z.infer<typeof AllocatedPortSchema>;
export declare function getServicePorts(agentName: AgentName): Promise<readonly AllocatedPort[]>;
export interface KubectlExecOptions {
    readonly interactive?: boolean;
}
export declare function kubectlExecCommand(agentName: AgentName, command?: string, options?: KubectlExecOptions): string;
export {};
