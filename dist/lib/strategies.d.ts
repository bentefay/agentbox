import type { DependencyStrategy, HostPrepareContext, VolumeMount } from "./config";
import type { Result } from "./result";
/** Options for {@link nixStrategy}. */
export interface NixStrategyOptions {
    /** Path to the host nix store. Defaults to `/nix`. */
    readonly nixPath?: string;
}
/** Detect `flake.nix` and mount the nix store. Runs `nix print-dev-env` on the host (trusted) or inside the container. */
export declare function nixStrategy(opts?: NixStrategyOptions): DependencyStrategy;
/** Detect `.envrc` and run `direnv allow` on the host when trusted. */
export declare function direnvStrategy(): DependencyStrategy;
/** Detect the `claude` CLI on the host and mount its binary, config, and settings into the container. */
export declare function claudeStrategy(): DependencyStrategy;
/** Options for {@link bunStrategy}. */
export interface BunStrategyOptions {
    /** Host path to the bun install cache. Mounted into the container when set. */
    readonly cachePath?: string;
}
/** Detect `bun.lock` / `bun.lockb` and run `bun install --frozen-lockfile` in the container. */
export declare function bunStrategy(opts?: BunStrategyOptions): DependencyStrategy;
/** Options for {@link yarnStrategy}. */
export interface YarnStrategyOptions {
    /** Host path to the yarn cache. Mounted into the container when set. */
    readonly cachePath?: string;
}
/** Detect `yarn.lock` and run `yarn install --frozen-lockfile` in the container. */
export declare function yarnStrategy(opts?: YarnStrategyOptions): DependencyStrategy;
/** Options for {@link pnpmStrategy}. */
export interface PnpmStrategyOptions {
    /** Host path to the pnpm content-addressable store. Mounted into the container when set. */
    readonly storePath?: string;
}
/** Detect `pnpm-lock.yaml` and run `pnpm install --frozen-lockfile` in the container. */
export declare function pnpmStrategy(opts?: PnpmStrategyOptions): DependencyStrategy;
/** Options for {@link npmStrategy}. */
export interface NpmStrategyOptions {
    /** Host path to the npm cache. Mounted into the container when set. */
    readonly cachePath?: string;
}
/** Detect `package-lock.json` and run `npm ci` in the container. */
export declare function npmStrategy(opts?: NpmStrategyOptions): DependencyStrategy;
/**
 * Default strategy list used when `dependencyStrategies` is empty.
 * Strategies are tried in order; all that match are applied.
 */
export declare const builtInStrategies: readonly DependencyStrategy[];
export declare function detectStrategies(repoRoot: string, strategies?: readonly DependencyStrategy[]): Promise<readonly DependencyStrategy[]>;
export declare function runHostPrepare(ctx: HostPrepareContext, strategies: readonly DependencyStrategy[], repoRoot: string, worktreePath: string): Promise<Result<void, string>>;
/** Collect all volumes declared by detected strategies. */
export declare function collectStrategyVolumes(strategies: readonly DependencyStrategy[]): readonly VolumeMount[];
