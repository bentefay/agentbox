import { z } from "zod";
import type { Result } from "./result";
export declare const TmuxPaneSchema: z.ZodObject<{
    command: z.ZodString;
    sleepSeconds: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const TmuxWindowSchema: z.ZodObject<{
    name: z.ZodString;
    panes: z.ZodReadonly<z.ZodArray<z.ZodObject<{
        command: z.ZodString;
        sleepSeconds: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const TmuxModeSchema: z.ZodObject<{
    name: z.ZodString;
    windows: z.ZodReadonly<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        panes: z.ZodReadonly<z.ZodArray<z.ZodObject<{
            command: z.ZodString;
            sleepSeconds: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const VolumeMountSchema: z.ZodObject<{
    hostPath: z.ZodString;
    containerPath: z.ZodString;
    readOnly: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const ServicePortSchema: z.ZodObject<{
    name: z.ZodString;
    port: z.ZodNumber;
    targetPort: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const ResourceLimitsSchema: z.ZodObject<{
    memoryGi: z.ZodNumber;
    cpuLimit: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CacheImages = readonly string[] | (() => Promise<readonly string[]>);
export interface HostPrepareContext {
    readonly trusted: boolean;
    readonly logWarning: (message: string) => void;
}
export interface DependencyStrategy {
    readonly name: string;
    readonly detect: (repoRoot: string) => Promise<boolean>;
    readonly hostPrepare?: (ctx: HostPrepareContext, repoRoot: string, worktreePath: string) => Promise<Result<void, string>>;
    readonly containerInstall?: (workspacePath: string) => Promise<readonly string[]>;
    readonly shellInit?: () => readonly string[];
    readonly volumes?: () => readonly VolumeMount[];
}
export declare const AgentboxConfigSchema: z.ZodObject<{
    tmuxModes: z.ZodReadonly<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        windows: z.ZodReadonly<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            panes: z.ZodReadonly<z.ZodArray<z.ZodObject<{
                command: z.ZodString;
                sleepSeconds: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>>;
        }, z.core.$strip>>>;
    }, z.core.$strip>>>;
    dependencyStrategies: z.ZodReadonly<z.ZodArray<z.ZodCustom<DependencyStrategy, DependencyStrategy>>>;
    containerImage: z.ZodOptional<z.ZodString>;
    resources: z.ZodOptional<z.ZodObject<{
        memoryGi: z.ZodNumber;
        cpuLimit: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    volumes: z.ZodOptional<z.ZodReadonly<z.ZodArray<z.ZodObject<{
        hostPath: z.ZodString;
        containerPath: z.ZodString;
        readOnly: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>>;
    servicePorts: z.ZodOptional<z.ZodReadonly<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        port: z.ZodNumber;
        targetPort: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>>>;
    environmentSetup: z.ZodOptional<z.ZodReadonly<z.ZodArray<z.ZodString>>>;
    cacheImages: z.ZodOptional<z.ZodCustom<CacheImages, CacheImages>>;
}, z.core.$strip>;
export type TmuxPane = z.infer<typeof TmuxPaneSchema>;
export type TmuxWindow = z.infer<typeof TmuxWindowSchema>;
export type TmuxMode = z.infer<typeof TmuxModeSchema>;
export type VolumeMount = z.infer<typeof VolumeMountSchema>;
export type ServicePort = z.infer<typeof ServicePortSchema>;
export type ResourceLimits = z.infer<typeof ResourceLimitsSchema>;
export type AgentboxConfig = z.infer<typeof AgentboxConfigSchema>;
export declare function resolveCacheImages(cacheImages: CacheImages): Promise<readonly string[]>;
export declare function defineConfig(config: AgentboxConfig): AgentboxConfig;
