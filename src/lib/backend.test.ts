import { describe, expect, it } from "bun:test";

import {
    parsePortsLabel,
    buildDockerRunCommand,
    buildExecCommand,
    buildLogsCommand,
    createBackend
} from "./backend";
import type { ContainerSpec } from "./container-spec";
import type { AgentName } from "./git";

// ============================================================================
// Helpers
// ============================================================================

function minimalContainerSpec(overrides: Partial<ContainerSpec> = {}): ContainerSpec {
    return {
        env: overrides.env ?? [],
        volumes: overrides.volumes ?? [],
        ports: overrides.ports ?? [],
        environmentSetup: overrides.environmentSetup ?? []
    };
}

// ============================================================================
// parsePortsLabel
// ============================================================================

describe("parsePortsLabel", () => {
    it("parses a valid JSON array into AllocatedPort[]", () => {
        const input = JSON.stringify([
            { name: "http", nodePort: 30080, targetPort: 8080 },
            { name: "https", nodePort: 30443, targetPort: 8443 }
        ]);
        const result = parsePortsLabel(input);
        expect(result).toEqual([
            { name: "http", nodePort: 30080, targetPort: 8080 },
            { name: "https", nodePort: 30443, targetPort: 8443 }
        ]);
    });

    it("returns empty array for empty string", () => {
        expect(parsePortsLabel("")).toEqual([]);
    });

    it("returns empty array for whitespace-only string", () => {
        expect(parsePortsLabel("   ")).toEqual([]);
    });

    it("returns empty array for invalid JSON", () => {
        expect(parsePortsLabel("not-json")).toEqual([]);
    });

    it("returns empty array for non-array JSON", () => {
        expect(
            parsePortsLabel(JSON.stringify({ name: "http", nodePort: 80, targetPort: 80 }))
        ).toEqual([]);
    });

    it("filters out entries with missing fields", () => {
        const input = JSON.stringify([
            { name: "http", nodePort: 80 }, // missing targetPort
            { nodePort: 80, targetPort: 80 }, // missing name
            { name: "http", targetPort: 80 } // missing nodePort
        ]);
        expect(parsePortsLabel(input)).toEqual([]);
    });

    it("keeps only valid entries from a mixed array", () => {
        const input = JSON.stringify([
            { name: "http", nodePort: 30080, targetPort: 8080 },
            { name: "bad" }, // invalid
            null,
            { name: "https", nodePort: 30443, targetPort: 8443 }
        ]);
        const result = parsePortsLabel(input);
        expect(result).toEqual([
            { name: "http", nodePort: 30080, targetPort: 8080 },
            { name: "https", nodePort: 30443, targetPort: 8443 }
        ]);
    });
});

// ============================================================================
// buildDockerRunCommand
// ============================================================================

describe("buildDockerRunCommand", () => {
    it("produces correct base flags for minimal config", () => {
        const cmd = buildDockerRunCommand(
            "my-container",
            "my-image:latest",
            minimalContainerSpec()
        );

        expect(cmd).toInclude("docker run -d --name my-container --privileged");
        expect(cmd).toInclude("-w /workspace");
        expect(cmd).toInclude("my-image:latest sleep infinity");
    });

    it("maps volumes to -v flags", () => {
        const cmd = buildDockerRunCommand(
            "ctr",
            "img",
            minimalContainerSpec({
                volumes: [
                    { hostPath: "/host/src", containerPath: "/workspace" },
                    { hostPath: "/host/cache", containerPath: "/cache", readOnly: true }
                ]
            })
        );

        expect(cmd).toInclude("-v '/host/src':'/workspace'");
        expect(cmd).toInclude("-v '/host/cache':'/cache':ro");
    });

    it("maps env vars to -e flags", () => {
        const cmd = buildDockerRunCommand(
            "ctr",
            "img",
            minimalContainerSpec({
                env: [
                    { name: "FOO", value: "bar" },
                    { name: "BAZ", value: "qux" }
                ]
            })
        );

        expect(cmd).toInclude("-e FOO='bar'");
        expect(cmd).toInclude("-e BAZ='qux'");
    });

    it("maps ports to -p flags", () => {
        const cmd = buildDockerRunCommand(
            "ctr",
            "img",
            minimalContainerSpec({
                ports: [
                    { name: "http", port: 8080 },
                    { name: "debug", port: 9229, targetPort: 9230 }
                ]
            })
        );

        expect(cmd).toInclude("-p 8080:8080");
        expect(cmd).toInclude("-p 9229:9230");
    });

    it("embeds ports as a --label agentbox.ports JSON value", () => {
        const cmd = buildDockerRunCommand(
            "ctr",
            "img",
            minimalContainerSpec({
                ports: [{ name: "http", port: 8080, targetPort: 3000 }]
            })
        );

        expect(cmd).toInclude("--label agentbox.ports=");
        // The label value should contain the serialised port mapping
        expect(cmd).toInclude('"name":"http"');
        expect(cmd).toInclude('"nodePort":8080');
        expect(cmd).toInclude('"targetPort":3000');
    });

    it("places image name before sleep infinity", () => {
        const cmd = buildDockerRunCommand("ctr", "custom/image:v2", minimalContainerSpec());

        expect(cmd).toEndWith("custom/image:v2 sleep infinity");
    });
});

// ============================================================================
// createBackend
// ============================================================================

const testAgent = "test-agent" as AgentName;

describe("createBackend", () => {
    it("creates k3s backend with correct fields", () => {
        const backend = createBackend(testAgent, "k3s");
        expect(backend.kind).toBe("k3s");
        expect(backend).toHaveProperty("podName", "agent-test-agent");
        expect(backend).toHaveProperty("agentName", testAgent);
    });

    it("creates docker backend with correct fields", () => {
        const backend = createBackend(testAgent, "docker");
        expect(backend.kind).toBe("docker");
        expect(backend).toHaveProperty("containerName", "agentbox-test-agent");
        expect(backend).toHaveProperty("agentName", testAgent);
    });
});

// ============================================================================
// buildExecCommand
// ============================================================================

describe("buildExecCommand", () => {
    describe("k3s backend", () => {
        const backend = createBackend(testAgent, "k3s");

        it("returns kubectl exec command with default bash", () => {
            const cmd = buildExecCommand(backend);
            expect(cmd).toContain("kubectl");
            expect(cmd).toContain("exec -it agent-test-agent -c agent -- runuser -u agent -- bash");
        });

        it("returns kubectl exec command with custom command", () => {
            const cmd = buildExecCommand(backend, "bash -c 'echo hello'");
            expect(cmd).toContain("kubectl");
            expect(cmd).toContain(
                "exec -it agent-test-agent -c agent -- runuser -u agent -- bash -c 'echo hello'"
            );
        });
    });

    describe("docker backend", () => {
        const backend = createBackend(testAgent, "docker");

        it("returns docker exec command with default bash", () => {
            const cmd = buildExecCommand(backend);
            expect(cmd).toBe("docker exec -it agentbox-test-agent runuser -u agent -- bash");
        });

        it("returns docker exec command with custom command", () => {
            const cmd = buildExecCommand(backend, "bash -c 'echo hello'");
            expect(cmd).toBe(
                "docker exec -it agentbox-test-agent runuser -u agent -- bash -c 'echo hello'"
            );
        });
    });
});

// ============================================================================
// buildLogsCommand
// ============================================================================

describe("buildLogsCommand", () => {
    describe("k3s backend", () => {
        const backend = createBackend(testAgent, "k3s");

        it("produces kubectl logs command with agent container by default", () => {
            const result = buildLogsCommand(backend);
            expect(result).toEqual({ ok: true, value: "kubectl logs agent-test-agent -c agent" });
        });

        it("produces kubectl logs command with setup container when init is true", () => {
            const result = buildLogsCommand(backend, { init: true });
            expect(result).toEqual({ ok: true, value: "kubectl logs agent-test-agent -c setup" });
        });

        it("includes -f flag when follow is true", () => {
            const result = buildLogsCommand(backend, { follow: true });
            expect(result).toEqual({
                ok: true,
                value: "kubectl logs agent-test-agent -c agent -f"
            });
        });
    });

    describe("docker backend", () => {
        const backend = createBackend(testAgent, "docker");

        it("produces docker logs command by default", () => {
            const result = buildLogsCommand(backend);
            expect(result).toEqual({ ok: true, value: "docker logs agentbox-test-agent" });
        });

        it("includes -f flag when follow is true", () => {
            const result = buildLogsCommand(backend, { follow: true });
            expect(result).toEqual({ ok: true, value: "docker logs -f agentbox-test-agent" });
        });

        it("returns Err when init is true", () => {
            const result = buildLogsCommand(backend, { init: true });
            expect(result.ok).toBe(false);
        });
    });
});
