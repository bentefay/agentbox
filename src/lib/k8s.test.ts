import { describe, test, expect } from "bun:test";

import type { AgentboxConfig } from "./config";
import type { ContainerVolume } from "./container-spec";
import { parseAgentName } from "./git";
import type { AgentName, BareRepoPath } from "./git";
import { podName, buildPodYaml, assignVolumeNames } from "./k8s";
import type { PodSpec, PodBuildContext } from "./k8s";

/** Helper to create a BareRepoPath for tests. */
function testBareRepoPath(raw: string): BareRepoPath {
    return raw as BareRepoPath;
}

/** Helper to create a valid AgentName for tests. */
function testAgentName(raw: string): AgentName {
    const result = parseAgentName(raw);
    if (!result.ok) throw new Error(`Test setup: invalid agent name '${raw}'`);
    return result.value;
}

describe("podName", () => {
    test("prefixes agent name with 'agent-'", () => {
        expect(podName(testAgentName("my-agent"))).toBe("agent-my-agent");
    });

    test("handles simple names", () => {
        expect(podName(testAgentName("test"))).toBe("agent-test");
    });
});

describe("buildPodYaml", () => {
    const minimalConfig: AgentboxConfig = {
        tmuxModes: [],
        dependencyStrategies: [],
    };

    const minimalSpec: PodSpec = {
        agentName: testAgentName("test-agent"),
        worktreePath: "/tmp/agents/test-agent",
        bareRepoPath: testBareRepoPath("/tmp/agents/.bare"),
        config: minimalConfig,
    };

    const baseCtx: PodBuildContext = {
        cpuCount: 8,
    };

    test("produces valid YAML with Pod and Service separated by ---", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain("apiVersion: v1");
        expect(yaml).toContain("kind: Pod");
        expect(yaml).toContain("---");
        expect(yaml).toContain("kind: Service");
    });

    test("includes the agent name in metadata", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain("name: agent-test-agent");
        expect(yaml).toContain("agent-name: test-agent");
    });

    test("includes kata runtime class", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain("runtimeClassName: kata");
    });

    test("includes workspace volume mount", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain("mountPath: /workspace");
    });

    test("includes bare repo volume mount", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain(`mountPath: ${minimalSpec.bareRepoPath}`);
    });

    test("includes strategy volumes in pod spec", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            strategyVolumes: [
                { hostPath: "/home/user/.claude", containerPath: "/home/agent/.claude" },
            ],
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain("mountPath: /home/agent/.claude");
        expect(yaml).toContain("path: /home/user/.claude");
    });

    test("includes AGENT_NAME env var", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain("name: AGENT_NAME");
        expect(yaml).toContain("value: test-agent");
    });

    test("uses default memory when not specified", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain('memory: "16Gi"');
    });

    test("uses configured memory", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            config: { ...minimalConfig, resources: { memoryGi: 32 } },
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain('memory: "32Gi"');
    });

    test("uses cpuCount from context as default cpu limit", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain('cpu: "8"');
    });

    test("uses configured cpu limit over context cpuCount", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            config: { ...minimalConfig, resources: { memoryGi: 16, cpuLimit: 4 } },
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain('cpu: "4"');
    });

    test("includes user-configured volumes", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            config: {
                ...minimalConfig,
                volumes: [{ hostPath: "/host/data", containerPath: "/data", readOnly: true }],
            },
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain("mountPath: /data");
        expect(yaml).toContain("readOnly: true");
        expect(yaml).toContain("path: /host/data");
    });

    test("includes multiple user-configured volumes with deterministic names", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            config: {
                ...minimalConfig,
                volumes: [
                    { hostPath: "/host/a", containerPath: "/a" },
                    { hostPath: "/host/b", containerPath: "/b", readOnly: true },
                ],
            },
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain("name: user-a");
        expect(yaml).toContain("name: user-b");
        expect(yaml).toContain("mountPath: /a");
        expect(yaml).toContain("mountPath: /b");
    });

    test("expands tilde in user volume hostPath", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            config: {
                ...minimalConfig,
                volumes: [{ hostPath: "~/mydata", containerPath: "/data" }],
            },
        };
        const yaml = buildPodYaml(spec, baseCtx);
        // expandHome replaces ~ with os.homedir(), not ctx.hostHome
        expect(yaml).not.toContain("~/mydata");
    });

    test("includes service ports when configured", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            config: {
                ...minimalConfig,
                servicePorts: [{ name: "http", port: 8080, targetPort: 3000 }],
            },
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain("name: http");
        expect(yaml).toContain("port: 8080");
        expect(yaml).toContain("targetPort: 3000");
    });

    test("includes empty ports array when no service ports", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain("ports: []");
    });

    test("includes git identity env vars when provided", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            gitUser: { name: "Test User", email: "test@example.com" },
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain("GIT_AUTHOR_NAME");
        expect(yaml).toContain("GIT_COMMITTER_NAME");
        expect(yaml).toContain("GIT_AUTHOR_EMAIL");
        expect(yaml).toContain("GIT_COMMITTER_EMAIL");
        expect(yaml).toContain("value: Test User");
        expect(yaml).toContain('value: "test@example.com"');
    });

    test("does not include git env vars when not provided", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).not.toContain("GIT_AUTHOR_NAME");
        expect(yaml).not.toContain("GIT_COMMITTER_NAME");
    });

    test("includes git name but not email when only name provided", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            gitUser: { name: "Test User", email: "" },
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain("GIT_AUTHOR_NAME");
        expect(yaml).not.toContain("GIT_AUTHOR_EMAIL");
    });

    test("includes docker image cache volume when imageCachePath set", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            imageCachePath: "/cache/docker-images.tar",
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain("mountPath: /cache");
        expect(yaml).toContain("docker-image-cache");
    });

    test("does not include docker image cache when imageCachePath not set", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).not.toContain("docker-image-cache");
    });

    test("includes custom container image", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            config: { ...minimalConfig, containerImage: "my-custom-image:v2" },
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain('image: "my-custom-image:v2"');
    });

    test("includes init container for worktree symlink", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain("initContainers:");
        expect(yaml).toContain("name: setup");
        expect(yaml).toContain("ln -sfn /workspace");
    });

    test("sets privileged security context on agent container", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).toContain("privileged: true");
    });

    // --- Strategy-driven nix mount tests ---

    test("includes nix mount when provided as strategy volume", () => {
        const spec: PodSpec = {
            ...minimalSpec,
            strategyVolumes: [{ hostPath: "/nix", containerPath: "/nix", readOnly: true }],
        };
        const yaml = buildPodYaml(spec, baseCtx);
        expect(yaml).toContain("mountPath: /nix");
        expect(yaml).toContain("name: nix");
        expect(yaml).toContain("path: /nix");
        expect(yaml).toContain("readOnly: true");
    });

    test("does not include nix mount when no strategy volumes", () => {
        const yaml = buildPodYaml(minimalSpec, baseCtx);
        expect(yaml).not.toContain("name: nix");
        expect(yaml).not.toContain("path: /nix");
    });
});

describe("assignVolumeNames", () => {
    test("returns empty array for empty input", () => {
        expect(assignVolumeNames([])).toEqual([]);
    });

    test("assigns 'workspace' name for /workspace container path", () => {
        const volumes: readonly ContainerVolume[] = [
            { hostPath: "/tmp/ws", containerPath: "/workspace" },
        ];
        const result = assignVolumeNames(volumes);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe("workspace");
        expect(result[0].type).toBe("Directory");
    });

    test("assigns known names for all known container paths", () => {
        const volumes: readonly ContainerVolume[] = [
            { hostPath: "/tmp/ws", containerPath: "/workspace" },
            { hostPath: "/home/user/.claude", containerPath: "/home/agent/.claude" },
            { hostPath: "/usr/bin/claude", containerPath: "/usr/local/bin/claude", readOnly: true },
            { hostPath: "/home/user/.claude.json", containerPath: "/home/agent/.claude.json" },
            { hostPath: "/nix", containerPath: "/nix", readOnly: true },
            { hostPath: "/cache/imgs", containerPath: "/cache" },
        ];
        const result = assignVolumeNames(volumes);
        expect(result.map((v) => v.name)).toEqual([
            "workspace",
            "claude-config",
            "claude-cli",
            "claude-json",
            "nix",
            "docker-image-cache",
        ]);
    });

    test("assigns 'bare-repo' when hostPath equals containerPath", () => {
        const volumes: readonly ContainerVolume[] = [
            { hostPath: "/tmp/agents/.bare", containerPath: "/tmp/agents/.bare" },
        ];
        const result = assignVolumeNames(volumes);
        expect(result[0].name).toBe("bare-repo");
        expect(result[0].type).toBe("Directory");
    });

    test("derives user volume name from last path segment", () => {
        const volumes: readonly ContainerVolume[] = [
            { hostPath: "/host/data", containerPath: "/data" },
        ];
        const result = assignVolumeNames(volumes);
        expect(result[0].name).toBe("user-data");
        expect(result[0].type).toBe("DirectoryOrCreate");
    });

    test("derives user volume name from deep path's last segment", () => {
        const volumes: readonly ContainerVolume[] = [
            { hostPath: "/host/yarn-cache", containerPath: "/home/agent/.cache/yarn" },
        ];
        const result = assignVolumeNames(volumes);
        expect(result[0].name).toBe("user-yarn");
    });

    test("sanitizes special characters in path segments", () => {
        const volumes: readonly ContainerVolume[] = [
            { hostPath: "/host/foo", containerPath: "/mnt/My_Data.v2" },
        ];
        const result = assignVolumeNames(volumes);
        expect(result[0].name).toBe("user-my-data-v2");
    });

    test("deduplicates volumes with same last segment", () => {
        const volumes: readonly ContainerVolume[] = [
            { hostPath: "/host/a/cache", containerPath: "/a/cache" },
            { hostPath: "/host/b/cache", containerPath: "/b/cache" },
        ];
        const result = assignVolumeNames(volumes);
        expect(result[0].name).toBe("user-cache");
        expect(result[1].name).toBe("user-cache-1");
    });

    test("preserves readOnly flag on named volumes", () => {
        const volumes: readonly ContainerVolume[] = [
            { hostPath: "/host/data", containerPath: "/data", readOnly: true },
        ];
        const result = assignVolumeNames(volumes);
        expect(result[0].readOnly).toBe(true);
    });

    test("names are deterministic regardless of ordering with other known volumes", () => {
        const userVol: ContainerVolume = { hostPath: "/host/stuff", containerPath: "/stuff" };
        const withPrefix: readonly ContainerVolume[] = [
            { hostPath: "/tmp/ws", containerPath: "/workspace" },
            userVol,
        ];
        const withoutPrefix: readonly ContainerVolume[] = [userVol];
        const resultA = assignVolumeNames(withPrefix);
        const resultB = assignVolumeNames(withoutPrefix);
        expect(resultA[1].name).toBe("user-stuff");
        expect(resultB[0].name).toBe("user-stuff");
    });

    test("mixed known, bare-repo, and user volumes all get correct names", () => {
        const volumes: readonly ContainerVolume[] = [
            { hostPath: "/tmp/ws", containerPath: "/workspace" },
            { hostPath: "/tmp/agents/.bare", containerPath: "/tmp/agents/.bare" },
            { hostPath: "/nix", containerPath: "/nix", readOnly: true },
            { hostPath: "/host/mydata", containerPath: "/mydata" },
        ];
        const result = assignVolumeNames(volumes);
        expect(result.map((v) => v.name)).toEqual(["workspace", "bare-repo", "nix", "user-mydata"]);
    });
});
