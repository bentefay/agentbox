import type { Result } from "../result";
import { Ok, Err } from "../result";

export type AgentName = string & { readonly __brand: "AgentName" };

/**
 * Validates and parses a raw string into an AgentName.
 * Valid names: alphanumeric + hyphens, 1-63 characters.
 */
export function parseAgentName(raw: string): Result<AgentName, string> {
    if (!/^[a-zA-Z0-9-]{1,63}$/.test(raw)) {
        return Err(
            `Invalid agent name '${raw}': must be 1-63 characters, alphanumeric and hyphens only`
        );
    }
    // This is the ONE allowed cast — the branded type smart constructor pattern
    return Ok(raw as AgentName);
}
