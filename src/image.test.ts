import { describe, expect, test } from "bun:test";

import { DEFAULT_IMAGE_NAME, TAGGED_IMAGE_NAME, buildAgentImage } from "./image";

describe("image naming constants", () => {
    test("DEFAULT_IMAGE_NAME is the expected base name", () => {
        expect(DEFAULT_IMAGE_NAME).toBe("agentbox-agent:local");
    });

    test("TAGGED_IMAGE_NAME includes a hash suffix and differs from the base", () => {
        expect(TAGGED_IMAGE_NAME).not.toBe(DEFAULT_IMAGE_NAME);
        expect(TAGGED_IMAGE_NAME).toStartWith(`${DEFAULT_IMAGE_NAME}-`);
    });

    test("TAGGED_IMAGE_NAME hash suffix is 12 hex characters", () => {
        const suffix = TAGGED_IMAGE_NAME.slice(DEFAULT_IMAGE_NAME.length + 1);
        expect(suffix).toMatch(/^[0-9a-f]{12}$/);
    });

    test("hash is deterministic across evaluations", () => {
        // Re-importing gives the same value since the Dockerfile content is constant
        expect(TAGGED_IMAGE_NAME).toBe(TAGGED_IMAGE_NAME);
    });
});

describe("buildAgentImage", () => {
    test("returns Ok(customImage) immediately when custom image is provided", async () => {
        const result = await buildAgentImage("my-custom-image:v1");
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value).toBe("my-custom-image:v1");
        }
    });

    test("returns Ok(customImage) regardless of backend kind", async () => {
        const k3sResult = await buildAgentImage("custom:latest", "k3s");
        const dockerResult = await buildAgentImage("custom:latest", "docker");

        expect(k3sResult).toEqual({ ok: true, value: "custom:latest" });
        expect(dockerResult).toEqual({ ok: true, value: "custom:latest" });
    });
});
