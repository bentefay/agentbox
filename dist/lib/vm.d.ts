import type { Result } from "./result";
export type VmCheckKind = "kataInstall" | "modules" | "shimSymlink" | "kataConfig" | "k3sInstall" | "k3sRunning" | "containerdSocketAccess" | "containerdConfig" | "kubeconfig" | "runtimeClass" | "traefikDisabled";
export interface VmCheckResult {
    readonly kind: VmCheckKind;
    readonly name: string;
    readonly ok: boolean;
}
export interface VmDiagnosis {
    readonly checks: readonly VmCheckResult[];
    readonly allGood: boolean;
    readonly fixScript: string | null;
}
export declare function checkVm(): Promise<VmDiagnosis>;
export declare function smokeTest(): Promise<Result<void, string>>;
export interface VmVerification {
    readonly diagnosis: VmDiagnosis;
    readonly smokeTestPassed: boolean | null;
    readonly smokeTestError: string | null;
}
export declare function verifyVm(): Promise<VmVerification>;
export type FixStep = {
    readonly kind: "installKata";
} | {
    readonly kind: "loadModules";
} | {
    readonly kind: "shimSymlink";
} | {
    readonly kind: "configureKata";
} | {
    readonly kind: "installK3s";
} | {
    readonly kind: "startK3s";
} | {
    readonly kind: "disableTraefik";
} | {
    readonly kind: "socketAccess";
} | {
    readonly kind: "kubeconfig";
} | {
    readonly kind: "containerdConfig";
} | {
    readonly kind: "runtimeClass";
};
export declare function getFixSteps(failing: ReadonlySet<VmCheckKind>): readonly FixStep[];
export declare function renderFixStep(step: FixStep): readonly string[];
