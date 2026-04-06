import { match } from "ts-pattern";

import type { AgentboxConfig } from "./config";
import type { ContainerSpec } from "./container-spec";
import { exec, tryExec, shellEscape } from "./exec";
import type { AgentName, BareRepoPath } from "./git";
import { AllocatedPortSchema } from "./k8s";
import type { AllocatedPort, PodState } from "./k8s";
import {
    podName,
    getPodState,
    startPod,
    stopPod,
    kubectlExecCommand,
    getServicePorts,
    deletePodAndService,
    createPodBuildContext
} from "./k8s";
import type { Result } from "./result";
import { Ok, Err } from "./result";

export type AgentState = PodState;
import { buildContainerSpec } from "./container-spec";

// ============================================================================
// Backend types
// ============================================================================

export interface BackendStartSpec {
    readonly agentName: AgentName;
    readonly worktreePath: string;
    readonly bareRepoPath: BareRepoPath;
    readonly config: AgentboxConfig;
    readonly imageName: string;
    readonly imageCachePath: string | undefined;
    readonly gitUser: { readonly name: string; readonly email: string } | undefined;
    readonly strategyVolumes?: readonly {
        readonly hostPath: string;
        readonly containerPath: string;
        readonly readOnly?: boolean;
    }[];
}

export type ContainerBackend =
    | { readonly kind: "k3s"; readonly podName: string; readonly agentName: AgentName }
    | { readonly kind: "docker"; readonly containerName: string; readonly agentName: AgentName };

// ============================================================================
// Backend factory
// ============================================================================

export function createBackend(agentName: AgentName, kind: "k3s" | "docker"): ContainerBackend {
    return match(kind)
        .with("k3s", () => ({ kind: "k3s" as const, podName: podName(agentName), agentName }))
        .with("docker", () => ({
            kind: "docker" as const,
            containerName: dockerContainerName(agentName),
            agentName
        }))
        .exhaustive();
}

// ============================================================================
// Backend functions
// ============================================================================

export async function getBackendState(backend: ContainerBackend): Promise<AgentState> {
    return match(backend)
        .with({ kind: "k3s" }, (b) => getPodState(b.podName))
        .with({ kind: "docker" }, (b) => getDockerContainerState(b.containerName))
        .exhaustive();
}

export async function isBackendRunning(backend: ContainerBackend): Promise<boolean> {
    return (await getBackendState(backend)).kind === "running";
}

export async function startBackend(
    backend: ContainerBackend,
    spec: BackendStartSpec
): Promise<Result<void, string>> {
    return match(backend)
        .with({ kind: "k3s" }, async (b) => {
            const state = await getPodState(b.podName);
            if (state.kind === "stopped") {
                await deletePodAndService(b.podName);
            }

            return startPod(
                {
                    agentName: spec.agentName,
                    worktreePath: spec.worktreePath,
                    bareRepoPath: spec.bareRepoPath,
                    config: { ...spec.config, containerImage: spec.imageName },
                    imageCachePath: spec.imageCachePath,
                    gitUser: spec.gitUser,
                    strategyVolumes: spec.strategyVolumes
                },
                createPodBuildContext()
            );
        })
        .with({ kind: "docker" }, async (b) => {
            await exec(`docker rm -f ${b.containerName}`, {
                captureOutput: true,
                rejectOnNonZeroExit: false
            });

            const container = buildContainerSpec(spec);

            const runResult = await tryExec(
                buildDockerRunCommand(b.containerName, spec.imageName, container),
                "Failed to start Docker container"
            );
            if (!runResult.ok) return Err(runResult.error);

            for (const cmd of container.environmentSetup) {
                await exec(`docker exec ${b.containerName} bash -c ${shellEscape(cmd)}`, {
                    rejectOnNonZeroExit: false
                });
            }

            return Ok(undefined);
        })
        .exhaustive();
}

export async function stopBackend(backend: ContainerBackend): Promise<Result<void, string>> {
    return match(backend)
        .with({ kind: "k3s" }, async (b) => {
            await stopPod(b.agentName);
            return Ok(undefined);
        })
        .with({ kind: "docker" }, async (b) => {
            await exec(`docker rm -f ${b.containerName}`, {
                captureOutput: true,
                rejectOnNonZeroExit: false
            });
            return Ok(undefined);
        })
        .exhaustive();
}

export interface ExecCommandOptions {
    readonly interactive?: boolean;
}

export function buildExecCommand(
    backend: ContainerBackend,
    command?: string,
    options: ExecCommandOptions = {}
): string {
    const { interactive = true } = options;
    return match(backend)
        .with({ kind: "k3s" }, (b) => kubectlExecCommand(b.agentName, command, { interactive }))
        .with({ kind: "docker" }, (b) => {
            const cmd = command ?? "bash";
            const flags = interactive ? "-it" : "-i";
            return `docker exec ${flags} ${b.containerName} runuser -u agent -- ${cmd}`;
        })
        .exhaustive();
}

export interface BackendLogsOptions {
    readonly follow?: boolean;
    readonly init?: boolean;
}

export function buildLogsCommand(
    backend: ContainerBackend,
    options: BackendLogsOptions = {}
): Result<string, string> {
    const { follow = false, init = false } = options;
    return match(backend)
        .with({ kind: "k3s" }, (b) => {
            const container = init ? "-c setup" : "-c agent";
            const followFlag = follow ? " -f" : "";
            return Ok(`kubectl logs ${b.podName} ${container}${followFlag}`);
        })
        .with({ kind: "docker" }, (b) => {
            if (init) {
                return Err("--init is only supported with k3s backend");
            }
            const followFlag = follow ? " -f" : "";
            return Ok(`docker logs${followFlag} ${b.containerName}`);
        })
        .exhaustive();
}

export async function getBackendLogs(
    backend: ContainerBackend,
    options: BackendLogsOptions = {}
): Promise<Result<string, string>> {
    const cmdResult = buildLogsCommand(backend, options);
    if (!cmdResult.ok) return cmdResult;

    const { follow = false } = options;
    const result = await exec(cmdResult.value, {
        captureOutput: !follow,
        rejectOnNonZeroExit: false
    });
    if (follow) return Ok("");
    if (result.code !== 0) return Err(`Failed to get logs: ${result.stderr.trim()}`);
    return Ok(result.stdout);
}

export async function getBackendServicePorts(
    backend: ContainerBackend
): Promise<readonly AllocatedPort[]> {
    return match(backend)
        .with({ kind: "k3s" }, (b) => getServicePorts(b.agentName))
        .with({ kind: "docker" }, (b) => queryDockerPortsLabel(b.containerName))
        .exhaustive();
}

// ============================================================================
// Docker helpers (internal)
// ============================================================================

function dockerContainerName(agentName: AgentName): string {
    return `agentbox-${agentName}`;
}

async function getDockerContainerState(containerName: string): Promise<AgentState> {
    const result = await exec(`docker inspect --format='{{.State.Status}}' ${containerName}`, {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (result.code !== 0) return { kind: "not-found" };
    const status = result.stdout.trim();
    if (status === "running") return { kind: "running" };
    return { kind: "stopped" };
}

export function parsePortsLabel(raw: string): readonly AllocatedPort[] {
    if (raw == null || raw.trim() === "") return [];
    try {
        const json: unknown = JSON.parse(raw);
        if (!Array.isArray(json)) return [];
        return json.flatMap((item) => {
            const result = AllocatedPortSchema.safeParse(item);
            return result.success ? [result.data] : [];
        });
    } catch {
        return [];
    }
}

async function queryDockerPortsLabel(containerName: string): Promise<readonly AllocatedPort[]> {
    const result = await exec(
        `docker inspect --format='{{index .Config.Labels "agentbox.ports"}}' ${containerName}`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false
        }
    );
    if (result.code !== 0) return [];
    return parsePortsLabel(result.stdout.trim());
}

export function buildDockerRunCommand(
    containerName: string,
    imageName: string,
    container: ContainerSpec
): string {
    const volumeFlags: readonly string[] = container.volumes.map(
        (v) =>
            `-v ${shellEscape(v.hostPath)}:${shellEscape(v.containerPath)}${v.readOnly ? ":ro" : ""}`
    );

    const envFlags: readonly string[] = container.env.map(
        (e) => `-e ${e.name}=${shellEscape(e.value)}`
    );

    const portFlags: readonly string[] = container.ports.map((p) => {
        const hostPort = p.port;
        const containerPort = p.targetPort ?? p.port;
        return `-p ${hostPort}:${containerPort}`;
    });

    const ports: readonly AllocatedPort[] = container.ports.map((p) => ({
        name: p.name,
        nodePort: p.port,
        targetPort: p.targetPort ?? p.port
    }));

    const portsLabel = `--label agentbox.ports=${shellEscape(JSON.stringify(ports))}`;

    return (
        `docker run -d --name ${containerName} --privileged ` +
        [...volumeFlags, ...envFlags, ...portFlags].join(" ") +
        ` ${portsLabel}` +
        ` -w /workspace ${imageName} sleep infinity`
    );
}
