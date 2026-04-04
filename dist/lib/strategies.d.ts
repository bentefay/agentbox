import type { DependencyStrategy, HostPrepareContext, VolumeMount } from "./config";
import type { Result } from "./result";
export interface NixStrategyOptions {
    readonly nixPath?: string;
}
export declare function nixStrategy(opts?: NixStrategyOptions): DependencyStrategy;
export declare function direnvStrategy(): DependencyStrategy;
export declare function claudeStrategy(): DependencyStrategy;
export interface BunStrategyOptions {
    readonly cachePath?: string;
}
export declare function bunStrategy(opts?: BunStrategyOptions): DependencyStrategy;
export interface YarnStrategyOptions {
    readonly cachePath?: string;
}
export declare function yarnStrategy(opts?: YarnStrategyOptions): DependencyStrategy;
export interface PnpmStrategyOptions {
    readonly storePath?: string;
}
export declare function pnpmStrategy(opts?: PnpmStrategyOptions): DependencyStrategy;
export interface NpmStrategyOptions {
    readonly cachePath?: string;
}
export declare function npmStrategy(opts?: NpmStrategyOptions): DependencyStrategy;
export declare const builtInStrategies: readonly DependencyStrategy[];
export declare function detectStrategies(repoRoot: string, strategies?: readonly DependencyStrategy[]): Promise<readonly DependencyStrategy[]>;
export declare function runHostPrepare(ctx: HostPrepareContext, strategies: readonly DependencyStrategy[], repoRoot: string, worktreePath: string): Promise<Result<void, string>>;
/** Collect all volumes declared by detected strategies. */
export declare function collectStrategyVolumes(strategies: readonly DependencyStrategy[]): readonly VolumeMount[];
