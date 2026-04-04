import type { Result } from "./result";
export declare const DEFAULT_IMAGE_NAME = "agentbox-agent:local";
export declare const TAGGED_IMAGE_NAME: string;
export declare function buildAgentImage(customImage?: string, backendKind?: "k3s" | "docker"): Promise<Result<string, string>>;
