import type { Result } from "../result";
export type AgentName = string & {
    readonly __brand: "AgentName";
};
/**
 * Validates and parses a raw string into an AgentName.
 * Valid names: alphanumeric + hyphens, 1-63 characters.
 */
export declare function parseAgentName(raw: string): Result<AgentName, string>;
