import { describe, test, expect } from "bun:test";

import type { AgentboxConfig } from "./config";
import { buildContainerSpec } from "./container-spec";
import type { ContainerSpecInput } from "./container-spec";
import type { BareRepoPath } from "./git";

/** Helper to create a BareRepoPath for tests. */
function testBareRepoPath(raw: string): BareRepoPath {
    return raw as BareRepoPath;
}

describe("buildContainerSpec", () => {
    const minimalConfig: AgentboxConfig = {
        tmuxModes: [],
        dependencyStrategies: []
    };

    const minimalInput: ContainerSpecInput = {
        agentName: "test-agent",
        worktreePath: "/tmp/agents/test-agent",
        bareRepoPath: testBareRepoPath("/tmp/agents/.bare"),
        config: minimalConfig
    };

    // --- Environment variables ---

    test("includes AGENT_NAME env var", () => {
        const spec = buildContainerSpec(minimalInput);
        const agentName = spec.env.find((e) => e.name === "AGENT_NAME");
        expect(agentName).toBeDefined();
        expect(agentName?.value).toBe("test-agent");
    });

    test("includes HOME env var", () => {
        const spec = buildContainerSpec(minimalInput);
        const home = spec.env.find((e) => e.name === "HOME");
        expect(home).toBeDefined();
        expect(home?.value).toBe("/home/agent");
    });

    test("includes git identity env vars when provided", () => {
        const input: ContainerSpecInput = {
            ...minimalInput,
            gitUser: { name: "Test User", email: "test@example.com" }
        };
        const spec = buildContainerSpec(input);
        expect(spec.env.find((e) => e.name === "GIT_AUTHOR_NAME")?.value).toBe("Test User");
        expect(spec.env.find((e) => e.name === "GIT_COMMITTER_NAME")?.value).toBe("Test User");
        expect(spec.env.find((e) => e.name === "GIT_AUTHOR_EMAIL")?.value).toBe("test@example.com");
        expect(spec.env.find((e) => e.name === "GIT_COMMITTER_EMAIL")?.value).toBe(
            "test@example.com"
        );
    });

    test("does not include git env vars when not provided", () => {
        const spec = buildContainerSpec(minimalInput);
        expect(spec.env.find((e) => e.name === "GIT_AUTHOR_NAME")).toBeUndefined();
        expect(spec.env.find((e) => e.name === "GIT_COMMITTER_NAME")).toBeUndefined();
    });

    test("includes git name but not email when only name provided", () => {
        const input: ContainerSpecInput = {
            ...minimalInput,
            gitUser: { name: "Test User", email: "" }
        };
        const spec = buildContainerSpec(input);
        expect(spec.env.find((e) => e.name === "GIT_AUTHOR_NAME")?.value).toBe("Test User");
        expect(spec.env.find((e) => e.name === "GIT_AUTHOR_EMAIL")).toBeUndefined();
    });

    // --- Volumes ---

    test("includes workspace volume", () => {
        const spec = buildContainerSpec(minimalInput);
        const workspace = spec.volumes.find((v) => v.containerPath === "/workspace");
        expect(workspace).toBeDefined();
        expect(workspace?.hostPath).toBe("/tmp/agents/test-agent");
    });

    test("includes bare repo volume", () => {
        const spec = buildContainerSpec(minimalInput);
        const bareRepo = spec.volumes.find((v) => v.containerPath === "/tmp/agents/.bare");
        expect(bareRepo).toBeDefined();
        expect(bareRepo?.hostPath).toBe("/tmp/agents/.bare");
    });

    test("includes strategy volumes", () => {
        const input: ContainerSpecInput = {
            ...minimalInput,
            strategyVolumes: [
                { hostPath: "/nix", containerPath: "/nix", readOnly: true },
                {
                    hostPath: "/usr/bin/claude",
                    containerPath: "/usr/local/bin/claude",
                    readOnly: true
                }
            ]
        };
        const spec = buildContainerSpec(input);
        const nix = spec.volumes.find((v) => v.containerPath === "/nix");
        expect(nix).toBeDefined();
        expect(nix?.readOnly).toBe(true);
        const claude = spec.volumes.find((v) => v.containerPath === "/usr/local/bin/claude");
        expect(claude).toBeDefined();
        expect(claude?.readOnly).toBe(true);
    });

    test("has no strategy volumes by default", () => {
        const spec = buildContainerSpec(minimalInput);
        // Only workspace + bare repo
        expect(spec.volumes).toHaveLength(2);
    });

    test("includes user-configured volumes", () => {
        const input: ContainerSpecInput = {
            ...minimalInput,
            config: {
                ...minimalConfig,
                volumes: [{ hostPath: "/host/data", containerPath: "/data", readOnly: true }]
            }
        };
        const spec = buildContainerSpec(input);
        const vol = spec.volumes.find((v) => v.containerPath === "/data");
        expect(vol).toBeDefined();
        expect(vol?.hostPath).toBe("/host/data");
        expect(vol?.readOnly).toBe(true);
    });

    test("includes docker image cache volume when imageCachePath set", () => {
        const input: ContainerSpecInput = {
            ...minimalInput,
            imageCachePath: "/cache/docker-images.tar"
        };
        const spec = buildContainerSpec(input);
        const cache = spec.volumes.find((v) => v.containerPath === "/cache");
        expect(cache).toBeDefined();
        expect(cache?.hostPath).toBe("/cache");
        expect(cache?.readOnly).toBe(true);
    });

    test("does not include docker image cache when imageCachePath not set", () => {
        const spec = buildContainerSpec(minimalInput);
        expect(spec.volumes.find((v) => v.containerPath === "/cache")).toBeUndefined();
    });

    // --- Environment setup ---

    test("uses default environment setup when not configured", () => {
        const spec = buildContainerSpec(minimalInput);
        expect(spec.environmentSetup).toEqual([
            "echo '127.0.0.1 host.docker.internal' >> /etc/hosts",
            "sysctl -w fs.inotify.max_user_watches=524288"
        ]);
    });

    test("uses configured environment setup", () => {
        const input: ContainerSpecInput = {
            ...minimalInput,
            config: {
                ...minimalConfig,
                environmentSetup: ["custom-setup-command"]
            }
        };
        const spec = buildContainerSpec(input);
        expect(spec.environmentSetup).toEqual(["custom-setup-command"]);
    });

    // --- Ports ---

    test("includes service ports from config", () => {
        const input: ContainerSpecInput = {
            ...minimalInput,
            config: {
                ...minimalConfig,
                servicePorts: [
                    { name: "http", port: 8080, targetPort: 3000 },
                    { name: "debug", port: 9229 }
                ]
            }
        };
        const spec = buildContainerSpec(input);
        expect(spec.ports).toEqual([
            { name: "http", port: 8080, targetPort: 3000 },
            { name: "debug", port: 9229 }
        ]);
    });

    test("returns empty ports when no servicePorts configured", () => {
        const spec = buildContainerSpec(minimalInput);
        expect(spec.ports).toEqual([]);
    });

    // --- Consistency guarantee ---

    test("produces same env vars regardless of strategy volumes", () => {
        const input: ContainerSpecInput = {
            ...minimalInput,
            gitUser: { name: "Test", email: "test@test.com" }
        };
        const spec1 = buildContainerSpec(input);
        const spec2 = buildContainerSpec({
            ...input,
            strategyVolumes: [{ hostPath: "/nix", containerPath: "/nix", readOnly: true }]
        });
        expect(spec1.env).toEqual(spec2.env);
    });
});
