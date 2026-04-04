export { defineConfig } from "./lib/config";
export type { AgentboxConfig, CacheImages, DependencyStrategy, HostPrepareContext, TmuxMode, TmuxWindow, TmuxPane, VolumeMount, ServicePort, ResourceLimits, } from "./lib/config";
export { nixStrategy, direnvStrategy, claudeStrategy, bunStrategy, yarnStrategy, pnpmStrategy, npmStrategy, builtInStrategies, } from "./lib/strategies";
export type { NixStrategyOptions, BunStrategyOptions, YarnStrategyOptions, PnpmStrategyOptions, NpmStrategyOptions, } from "./lib/strategies";
