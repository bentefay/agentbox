import { z } from "zod";

import type { Result } from "./result";

export const TmuxPaneSchema = z.object({
    command: z.string(),
    sleepSeconds: z.number().optional(),
});

export const TmuxWindowSchema = z.object({
    name: z.string(),
    panes: z.array(TmuxPaneSchema).readonly(),
});

export const TmuxModeSchema = z.object({
    name: z.string(),
    windows: z.array(TmuxWindowSchema).readonly(),
});

export const VolumeMountSchema = z.object({
    hostPath: z.string(),
    containerPath: z.string(),
    readOnly: z.boolean().optional(),
});

export const ServicePortSchema = z.object({
    name: z.string(),
    port: z.number(),
    targetPort: z.number().optional(),
});

export const ResourceLimitsSchema = z.object({
    memoryGi: z.number().positive(),
    cpuLimit: z.number().optional(),
});

export type CacheImages = readonly string[] | (() => Promise<readonly string[]>);

export interface HostPrepareContext {
    readonly trusted: boolean;
    readonly logWarning: (message: string) => void;
}

export interface DependencyStrategy {
    readonly name: string;
    readonly detect: (repoRoot: string) => Promise<boolean>;
    readonly hostPrepare?: (
        ctx: HostPrepareContext,
        repoRoot: string,
        worktreePath: string
    ) => Promise<Result<void, string>>;
    readonly containerInstall?: (workspacePath: string) => Promise<readonly string[]>;
    readonly shellInit?: () => readonly string[];
    readonly volumes?: () => readonly VolumeMount[];
}

export const AgentboxConfigSchema = z.object({
    tmuxModes: z.array(TmuxModeSchema).readonly(),
    dependencyStrategies: z.array(z.custom<DependencyStrategy>()).readonly(),
    containerImage: z.string().optional(),
    resources: ResourceLimitsSchema.optional(),
    volumes: z.array(VolumeMountSchema).readonly().optional(),
    servicePorts: z.array(ServicePortSchema).readonly().optional(),
    environmentSetup: z.array(z.string()).readonly().optional(),
    cacheImages: z.custom<CacheImages>().optional(),
});

export type TmuxPane = z.infer<typeof TmuxPaneSchema>;
export type TmuxWindow = z.infer<typeof TmuxWindowSchema>;
export type TmuxMode = z.infer<typeof TmuxModeSchema>;
export type VolumeMount = z.infer<typeof VolumeMountSchema>;
export type ServicePort = z.infer<typeof ServicePortSchema>;
export type ResourceLimits = z.infer<typeof ResourceLimitsSchema>;
export type AgentboxConfig = z.infer<typeof AgentboxConfigSchema>;

export async function resolveCacheImages(cacheImages: CacheImages): Promise<readonly string[]> {
    return typeof cacheImages === "function" ? cacheImages() : cacheImages;
}

export function defineConfig(config: AgentboxConfig): AgentboxConfig {
    return config;
}
