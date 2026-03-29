import { describe, test, expect } from "bun:test";

import { AgentboxConfigSchema, defineConfig } from "./config";
import type { AgentboxConfig } from "./config";

describe("AgentboxConfigSchema", () => {
    test("accepts a minimal valid config", () => {
        const config = {
            tmuxModes: [],
            dependencyStrategies: [],
        };
        const result = AgentboxConfigSchema.safeParse(config);
        expect(result.success).toBe(true);
    });

    test("accepts a full config with all optional fields", () => {
        const config = {
            tmuxModes: [
                {
                    name: "dev",
                    windows: [
                        {
                            name: "editor",
                            panes: [{ command: "vim", sleepSeconds: 2 }],
                        },
                    ],
                },
            ],
            dependencyStrategies: [],
            containerImage: "my-image:latest",
            resources: { memoryGi: 8, cpuLimit: 4 },
            volumes: [{ hostPath: "/host/path", containerPath: "/container/path", readOnly: true }],
            servicePorts: [{ name: "http", port: 8080, targetPort: 3000 }],
            environmentSetup: ["echo hello"],
            cacheImages: ["postgres:16", "redis:7-alpine"],
        };
        const result = AgentboxConfigSchema.safeParse(config);
        expect(result.success).toBe(true);
    });

    test("rejects config missing tmuxModes", () => {
        const config = { dependencyStrategies: [] };
        const result = AgentboxConfigSchema.safeParse(config);
        expect(result.success).toBe(false);
    });

    test("rejects config missing dependencyStrategies", () => {
        const config = { tmuxModes: [] };
        const result = AgentboxConfigSchema.safeParse(config);
        expect(result.success).toBe(false);
    });

    test("rejects negative memoryGi", () => {
        const config = {
            tmuxModes: [],
            dependencyStrategies: [],
            resources: { memoryGi: -1 },
        };
        const result = AgentboxConfigSchema.safeParse(config);
        expect(result.success).toBe(false);
    });

    test("rejects zero memoryGi", () => {
        const config = {
            tmuxModes: [],
            dependencyStrategies: [],
            resources: { memoryGi: 0 },
        };
        const result = AgentboxConfigSchema.safeParse(config);
        expect(result.success).toBe(false);
    });

    test("rejects wrong type for containerImage", () => {
        const config = {
            tmuxModes: [],
            dependencyStrategies: [],
            containerImage: 42,
        };
        const result = AgentboxConfigSchema.safeParse(config);
        expect(result.success).toBe(false);
    });

    test("rejects tmuxMode with missing window name", () => {
        const config = {
            tmuxModes: [{ name: "test", windows: [{ panes: [] }] }],
            dependencyStrategies: [],
        };
        const result = AgentboxConfigSchema.safeParse(config);
        expect(result.success).toBe(false);
    });
});

describe("defineConfig", () => {
    test("returns the config unchanged", () => {
        const config: AgentboxConfig = {
            tmuxModes: [],
            dependencyStrategies: [],
        };
        expect(defineConfig(config)).toBe(config);
    });
});
