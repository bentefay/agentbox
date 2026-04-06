import * as os from "os";
import * as path from "path";

import { z } from "zod";

import type { AgentboxConfig } from "./config";
import type { ContainerVolume } from "./container-spec";
import { buildContainerSpec } from "./container-spec";
import { exec, shellEscape, tryExec } from "./exec";
import type { AgentName, BareRepoPath } from "./git";
import { DEFAULT_IMAGE_NAME } from "./image";
import type { Result } from "./result";
import { Ok } from "./result";
import type { YamlValue } from "./yaml";
import { toYamlDocuments } from "./yaml";

const KUBECONFIG = path.join(os.homedir(), ".kube/config");
const NAMESPACE = "agents";

export function kubectl(cmd: string): string {
    return `KUBECONFIG=${KUBECONFIG} kubectl -n ${NAMESPACE} ${cmd}`;
}

export async function ensureNamespace(): Promise<void> {
    const result = await exec(kubectl(`get namespace ${NAMESPACE}`), {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (result.code !== 0) {
        await exec(`KUBECONFIG=${KUBECONFIG} kubectl create namespace ${NAMESPACE}`, {
            rejectOnNonZeroExit: false
        });
    }
}

export function podName(agentName: AgentName): string {
    return `agent-${agentName}`;
}

export type PodState =
    | { readonly kind: "running" }
    | { readonly kind: "stopped" }
    | { readonly kind: "not-found" };

export async function getPodState(name: string): Promise<PodState> {
    const result = await exec(kubectl(`get pod ${name} -o jsonpath='{.status.phase}'`), {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (result.code !== 0 || !result.stdout.trim()) return { kind: "not-found" };
    const phase = result.stdout.trim().replace(/^'|'$/g, "");
    return phase === "Running" ? { kind: "running" } : { kind: "stopped" };
}

export async function deletePodAndService(name: string): Promise<void> {
    await Promise.all([
        exec(kubectl(`delete pod ${name} --force --grace-period=0 --ignore-not-found`), {
            rejectOnNonZeroExit: false
        }),
        exec(kubectl(`delete service ${name} --ignore-not-found`), { rejectOnNonZeroExit: false })
    ]);
}

export interface PodSpec {
    readonly agentName: AgentName;
    readonly worktreePath: string;
    readonly bareRepoPath: BareRepoPath;
    readonly config: AgentboxConfig;
    readonly imageCachePath?: string;
    readonly gitUser?: { readonly name: string; readonly email: string };
    readonly strategyVolumes?: readonly {
        readonly hostPath: string;
        readonly containerPath: string;
        readonly readOnly?: boolean;
    }[];
}

export interface PodBuildContext {
    readonly cpuCount: number;
}

export function createPodBuildContext(): PodBuildContext {
    return {
        cpuCount: os.cpus().length
    };
}

// ============================================================================
// Volume naming — maps ContainerVolume[] to k8s-specific named volumes
// ============================================================================

interface NamedVolume {
    readonly name: string;
    readonly hostPath: string;
    readonly containerPath: string;
    readonly readOnly?: boolean;
    readonly type: string;
}

const KNOWN_VOLUME_MAP: ReadonlyMap<string, { readonly name: string; readonly type: string }> =
    new Map([
        ["/workspace", { name: "workspace", type: "Directory" }],
        ["/home/agent/.claude", { name: "claude-config", type: "DirectoryOrCreate" }],
        ["/usr/local/bin/claude", { name: "claude-cli", type: "File" }],
        ["/home/agent/.claude.json", { name: "claude-json", type: "File" }],
        ["/nix", { name: "nix", type: "Directory" }],
        ["/cache", { name: "docker-image-cache", type: "Directory" }]
    ]);

/** Sanitize a path segment into a valid k8s volume name (lowercase alphanumeric + hyphens). */
function sanitizeSegment(segment: string): string {
    return segment
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

/** Derive a deterministic volume name from a container path's last segment, prefixed with "user-". */
function deriveUserVolumeName(containerPath: string): string {
    const segment = path.basename(containerPath);
    const sanitized = sanitizeSegment(segment);
    return `user-${sanitized || "vol"}`;
}

/** Maps ContainerVolume[] (from buildContainerSpec) to k8s-specific named volumes with hostPath types. */
export function assignVolumeNames(volumes: readonly ContainerVolume[]): readonly NamedVolume[] {
    // First pass: compute candidate names
    const candidates = volumes.map((v) => {
        const known = KNOWN_VOLUME_MAP.get(v.containerPath);
        if (known != null) {
            return { volume: v, name: known.name, type: known.type };
        }
        if (v.hostPath === v.containerPath) {
            return { volume: v, name: "bare-repo", type: "Directory" };
        }
        return {
            volume: v,
            name: deriveUserVolumeName(v.containerPath),
            type: "DirectoryOrCreate"
        };
    });

    // Second pass: deduplicate names by appending index for collisions
    const nameCounts = new Map<string, number>();
    return candidates.map((c) => {
        const count = nameCounts.get(c.name) ?? 0;
        nameCounts.set(c.name, count + 1);
        const name = count === 0 ? c.name : `${c.name}-${count}`;
        return {
            hostPath: c.volume.hostPath,
            containerPath: c.volume.containerPath,
            readOnly: c.volume.readOnly,
            name,
            type: c.type
        };
    });
}

// ============================================================================
// Pod + Service YAML generation — structured objects serialized via toYaml
// ============================================================================

function buildVolumeMounts(
    namedVolumes: readonly NamedVolume[],
    worktreeParent: string
): readonly YamlValue[] {
    return [
        { name: "worktree-link", mountPath: worktreeParent },
        ...namedVolumes.map((v) =>
            v.readOnly
                ? { name: v.name, mountPath: v.containerPath, readOnly: true }
                : { name: v.name, mountPath: v.containerPath }
        )
    ];
}

function buildVolumes(namedVolumes: readonly NamedVolume[]): readonly YamlValue[] {
    return [
        { name: "worktree-link", emptyDir: {} },
        ...namedVolumes.map((v) => ({
            name: v.name,
            hostPath: { path: v.hostPath, type: v.type }
        }))
    ];
}

export function buildPodYaml(spec: PodSpec, ctx: PodBuildContext): string {
    const name = podName(spec.agentName);
    const worktreeParent = path.dirname(spec.worktreePath);
    const memoryGi = spec.config.resources?.memoryGi ?? 16;
    const cpuLimit = spec.config.resources?.cpuLimit ?? ctx.cpuCount;
    const containerImage = spec.config.containerImage ?? DEFAULT_IMAGE_NAME;

    const initScript = `mkdir -p ${shellEscape(worktreeParent)} && ln -sfn /workspace ${shellEscape(spec.worktreePath)}`;

    const container = buildContainerSpec(spec);

    const startupCommands = [
        "mknod /dev/loop-control c 10 237 2>/dev/null",
        "for i in $(seq 0 7); do mknod /dev/loop$i b 7 $i 2>/dev/null; done",
        "truncate -s 20G /tmp/docker.img && mkfs.ext4 -q /tmp/docker.img && mount -o loop /tmp/docker.img /var/lib/docker",
        ...container.environmentSetup,
        "chown -R agent:agent /home/agent/.local 2>/dev/null",
        "exec /usr/local/bin/entrypoint.sh sleep infinity"
    ].join("; ");

    const namedVolumes = assignVolumeNames(container.volumes);
    const allMounts = buildVolumeMounts(namedVolumes, worktreeParent);
    const allVolumes = buildVolumes(namedVolumes);

    const env =
        container.env.length > 0
            ? container.env.map((e) => ({ name: e.name, value: e.value }))
            : undefined;

    const podDoc = {
        apiVersion: "v1",
        kind: "Pod",
        metadata: {
            name,
            labels: {
                app: "agent",
                "agent-name": spec.agentName
            }
        },
        spec: {
            runtimeClassName: "kata",
            restartPolicy: "Never",
            initContainers: [
                {
                    name: "setup",
                    image: containerImage,
                    command: ["bash", "-c", initScript],
                    securityContext: { runAsUser: 0 },
                    volumeMounts: [
                        { name: "worktree-link", mountPath: worktreeParent },
                        { name: "workspace", mountPath: "/workspace" }
                    ]
                }
            ],
            containers: [
                {
                    name: "agent",
                    image: containerImage,
                    workingDir: "/workspace",
                    command: ["bash", "-c", startupCommands],
                    securityContext: { privileged: true },
                    resources: {
                        requests: { memory: `${memoryGi}Gi`, cpu: "1" },
                        limits: { memory: `${memoryGi}Gi`, cpu: `${cpuLimit}` }
                    },
                    ...(env != null ? { env } : {}),
                    volumeMounts: allMounts
                }
            ],
            volumes: allVolumes
        }
    };

    const servicePorts =
        container.ports.length > 0
            ? container.ports.map((p) => ({
                  name: p.name,
                  port: p.port,
                  targetPort: p.targetPort ?? p.port
              }))
            : [];

    const serviceDoc = {
        apiVersion: "v1",
        kind: "Service",
        metadata: { name },
        spec: {
            type: "NodePort",
            selector: { "agent-name": spec.agentName },
            ports: servicePorts
        }
    };

    return toYamlDocuments([podDoc, serviceDoc]);
}

export async function startPod(spec: PodSpec, ctx: PodBuildContext): Promise<Result<void, string>> {
    await ensureNamespace();
    const yaml = buildPodYaml(spec, ctx);
    const applyResult = await tryExec(
        `cat <<'K8S_EOF' | ${kubectl("apply -f -")}\n${yaml}\nK8S_EOF`,
        "kubectl apply failed"
    );
    if (!applyResult.ok) return applyResult;
    const name = podName(spec.agentName);
    const waitResult = await tryExec(
        kubectl(`wait --for=condition=Ready pod/${name} --timeout=120s`),
        "Pod failed to become ready"
    );
    if (!waitResult.ok) return waitResult;
    return Ok(undefined);
}

export async function stopPod(agentName: AgentName): Promise<void> {
    await deletePodAndService(podName(agentName));
}

export const AllocatedPortSchema = z.object({
    name: z.string(),
    nodePort: z.number(),
    targetPort: z.number()
});

export type AllocatedPort = z.infer<typeof AllocatedPortSchema>;

export async function getServicePorts(agentName: AgentName): Promise<readonly AllocatedPort[]> {
    const name = podName(agentName);
    const result = await exec(kubectl(`get service ${name} -o jsonpath='{.spec.ports}'`), {
        captureOutput: true,
        rejectOnNonZeroExit: false
    });
    if (result.code !== 0 || !result.stdout.trim()) return [];
    try {
        const raw = result.stdout.trim().replace(/^'|'$/g, "");
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

export interface KubectlExecOptions {
    readonly interactive?: boolean;
}

export function kubectlExecCommand(
    agentName: AgentName,
    command?: string,
    options: KubectlExecOptions = {}
): string {
    const { interactive = true } = options;
    const name = podName(agentName);
    const cmd = command ?? "bash";
    const flags = interactive ? "-it" : "-i";
    return kubectl(`exec ${flags} ${name} -c agent -- runuser -u agent -- ${cmd}`);
}
