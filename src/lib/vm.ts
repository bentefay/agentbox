import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { match } from "ts-pattern";

import { exec } from "./exec";
import { kubectl, ensureNamespace } from "./k8s";
import { Ok, Err } from "./result";
import type { Result } from "./result";
import { toYaml } from "./yaml";

const KATA_INSTALL_DIR = "/opt/kata";
const KATA_SHIM_PATH = `${KATA_INSTALL_DIR}/bin/containerd-shim-kata-v2`;
const KATA_CONFIG_DIR = "/etc/kata-containers";
const KATA_CONFIG_PATH = `${KATA_CONFIG_DIR}/configuration.toml`;
const SHIM_SYMLINK_PATH = "/usr/local/bin/containerd-shim-kata-v2";
const MODULES_LOAD_PATH = "/etc/modules-load.d/kata.conf";
const K3S_CONTAINERD_TMPL = "/var/lib/rancher/k3s/agent/etc/containerd/config.toml.tmpl";
const CONTAINERD_SOCKET_PATH = "/run/k3s/containerd/containerd.sock";
const KUBECONFIG_PATH = path.join(os.homedir(), ".kube/config");
const REQUIRED_MODULES = ["vhost_vsock", "vhost"];
const KATA_VERSION = "3.27.0";

// --- VmCheckKind: discriminated union replacing boolean bag ---

export type VmCheckKind =
    | "kataInstall"
    | "modules"
    | "shimSymlink"
    | "kataConfig"
    | "k3sInstall"
    | "k3sRunning"
    | "containerdSocketAccess"
    | "containerdConfig"
    | "kubeconfig"
    | "runtimeClass"
    | "traefikDisabled";

interface VmCheck {
    readonly kind: VmCheckKind;
    readonly name: string;
    readonly detect: () => Promise<boolean> | boolean;
}

const VM_CHECKS: readonly VmCheck[] = [
    { kind: "kataInstall", name: "Kata Containers installed", detect: () => isKataInstalled() },
    {
        kind: "modules",
        name: "Kernel modules loaded (vhost_vsock, vhost)",
        detect: () => modulesAreLoaded(),
    },
    {
        kind: "shimSymlink",
        name: "Kata shim symlinked for containerd",
        detect: () => isShimSymlinked(),
    },
    {
        kind: "kataConfig",
        name: "Kata configured for Cloud Hypervisor",
        detect: () => isKataConfigured(),
    },
    { kind: "k3sInstall", name: "k3s installed", detect: () => commandExists("k3s") },
    { kind: "k3sRunning", name: "k3s running", detect: () => systemdActive("k3s") },
    {
        kind: "containerdSocketAccess",
        name: "k3s containerd socket accessible",
        detect: () => isSocketAccessible(),
    },
    {
        kind: "containerdConfig",
        name: "k3s containerd configured for Kata",
        detect: () => isContainerdConfigured(),
    },
    {
        kind: "kubeconfig",
        name: "Kubeconfig accessible",
        detect: () => isFileReadable(KUBECONFIG_PATH),
    },
    { kind: "runtimeClass", name: "Kata RuntimeClass created", detect: () => runtimeClassExists() },
    {
        kind: "traefikDisabled",
        name: "Traefik disabled (ports 80/443 free)",
        detect: () => isTraefikDisabled(),
    },
];

// --- Public types ---

export interface VmCheckResult {
    readonly kind: VmCheckKind;
    readonly name: string;
    readonly ok: boolean;
}

export interface VmDiagnosis {
    readonly checks: readonly VmCheckResult[];
    readonly allGood: boolean;
    readonly fixScript: string | null;
}

// --- Diagnosis ---

async function diagnose(): Promise<readonly VmCheckResult[]> {
    const results = await Promise.all(
        VM_CHECKS.map(
            async (check): Promise<VmCheckResult> => ({
                kind: check.kind,
                name: check.name,
                ok: await check.detect(),
            })
        )
    );
    return results;
}

function failingKinds(checks: readonly VmCheckResult[]): ReadonlySet<VmCheckKind> {
    return new Set(checks.filter((c) => !c.ok).map((c) => c.kind));
}

export async function checkVm(): Promise<VmDiagnosis> {
    const checks = await diagnose();
    const allGood = checks.every((c) => c.ok);
    const fixScript = allGood ? null : buildFixScript(failingKinds(checks));

    return { checks, allGood, fixScript };
}

// --- Individual checks ---

async function commandExists(cmd: string): Promise<boolean> {
    const result = await exec(`which ${cmd}`, { captureOutput: true, rejectOnNonZeroExit: false });
    return result.code === 0;
}

async function systemdActive(service: string): Promise<boolean> {
    const result = await exec(`systemctl is-active ${service}`, {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });
    return result.stdout.trim() === "active";
}

function isKataInstalled(): boolean {
    return fileExists(KATA_SHIM_PATH) && fileExists(`${KATA_INSTALL_DIR}/bin/cloud-hypervisor`);
}

async function modulesAreLoaded(): Promise<boolean> {
    const result = await exec("lsmod", { captureOutput: true, rejectOnNonZeroExit: false });
    if (result.code !== 0) return false;
    return REQUIRED_MODULES.every((m) => result.stdout.includes(m));
}

function isShimSymlinked(): boolean {
    try {
        return (
            fs.existsSync(SHIM_SYMLINK_PATH) && fs.existsSync(fs.realpathSync(SHIM_SYMLINK_PATH))
        );
    } catch {
        return false;
    }
}

async function isKataConfigured(): Promise<boolean> {
    const content = readFileSafe(KATA_CONFIG_PATH);
    if (!content) return false;
    return (
        /\[hypervisor\.clh\]/.test(content) &&
        /virtio_fs_cache\s*=\s*"auto"/.test(content) &&
        /enable_virtio_mem\s*=\s*true/.test(content)
    );
}

async function isContainerdConfigured(): Promise<boolean> {
    const content = readFileSafe(K3S_CONTAINERD_TMPL);
    if (content) {
        return (
            content.includes("containerd.runtimes.kata") &&
            content.includes("io.containerd.kata.v2")
        );
    }
    return (await systemdActive("k3s")) && (await runtimeClassExists());
}

function isSocketAccessible(): boolean {
    try {
        fs.accessSync(CONTAINERD_SOCKET_PATH, fs.constants.R_OK | fs.constants.W_OK);
        return true;
    } catch {
        return false;
    }
}

async function isTraefikDisabled(): Promise<boolean> {
    if (!isFileReadable(KUBECONFIG_PATH)) return true;
    const result = await exec(
        `KUBECONFIG=${KUBECONFIG_PATH} kubectl get helmchart traefik -n kube-system -o name 2>/dev/null`,
        { captureOutput: true, rejectOnNonZeroExit: false }
    );
    return result.code !== 0 || result.stdout.trim() === "";
}

async function runtimeClassExists(): Promise<boolean> {
    if (!isFileReadable(KUBECONFIG_PATH)) return false;
    const result = await exec(
        `KUBECONFIG=${KUBECONFIG_PATH} kubectl get runtimeclass kata -o name`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        }
    );
    return result.code === 0;
}

// --- Helpers ---

function fileExists(p: string): boolean {
    return fs.existsSync(p);
}

function isFileReadable(p: string): boolean {
    try {
        fs.accessSync(p, fs.constants.R_OK);
        return true;
    } catch {
        return false;
    }
}

function readFileSafe(p: string): string | null {
    try {
        return fs.readFileSync(p, "utf-8");
    } catch {
        return null;
    }
}

// --- Smoke test ---

const SMOKE_TEST_POD_NAME = "agentbox-smoke-test";

const SMOKE_TEST_POD_SPEC = {
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
        name: SMOKE_TEST_POD_NAME,
    },
    spec: {
        runtimeClassName: "kata",
        restartPolicy: "Never",
        containers: [
            {
                name: "test",
                image: "alpine",
                command: ["sh", "-c", "echo ok"],
            },
        ],
    },
} as const;

export async function smokeTest(): Promise<Result<void, string>> {
    await ensureNamespace();

    // Clean up any previous smoke test pod
    await exec(kubectl(`delete pod ${SMOKE_TEST_POD_NAME} --ignore-not-found`), {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });

    // Create the pod
    const podYaml = toYaml(SMOKE_TEST_POD_SPEC);
    const apply = await exec(`cat <<'K8S_EOF' | ${kubectl("apply -f -")}\n${podYaml}\nK8S_EOF`, {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });

    if (apply.code !== 0) {
        return Err(`Failed to create smoke test pod: ${(apply.stdout + apply.stderr).trim()}`);
    }

    // Wait for completion (up to 60s)
    const wait = await exec(
        kubectl(
            `wait --for=jsonpath='{.status.phase}'=Succeeded pod/${SMOKE_TEST_POD_NAME} --timeout=60s`
        ),
        { captureOutput: true, rejectOnNonZeroExit: false }
    );

    // Get logs
    const logs = await exec(kubectl(`logs ${SMOKE_TEST_POD_NAME}`), {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });

    // Clean up
    await exec(kubectl(`delete pod ${SMOKE_TEST_POD_NAME} --ignore-not-found`), {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });

    if (logs.code === 0 && logs.stdout.trim() === "ok") {
        return Ok(undefined);
    }

    const output = (logs.stdout + logs.stderr + wait.stderr).trim();
    return Err(
        output
            ? `Smoke test failed: ${output}`
            : "Smoke test failed: pod did not produce expected output"
    );
}

export interface VmVerification {
    readonly diagnosis: VmDiagnosis;
    readonly smokeTestPassed: boolean | null;
    readonly smokeTestError: string | null;
}

export async function verifyVm(): Promise<VmVerification> {
    const diagnosis = await checkVm();

    if (!diagnosis.allGood) {
        return { diagnosis, smokeTestPassed: null, smokeTestError: null };
    }

    const result = await smokeTest();

    if (result.ok) {
        return { diagnosis, smokeTestPassed: true, smokeTestError: null };
    }

    return { diagnosis, smokeTestPassed: false, smokeTestError: result.error };
}

// --- Fix script generation ---

export type FixStep =
    | { readonly kind: "installKata" }
    | { readonly kind: "loadModules" }
    | { readonly kind: "shimSymlink" }
    | { readonly kind: "configureKata" }
    | { readonly kind: "installK3s" }
    | { readonly kind: "startK3s" }
    | { readonly kind: "disableTraefik" }
    | { readonly kind: "socketAccess" }
    | { readonly kind: "kubeconfig" }
    | { readonly kind: "containerdConfig" }
    | { readonly kind: "runtimeClass" };

export function getFixSteps(failing: ReadonlySet<VmCheckKind>): readonly FixStep[] {
    const has = (kind: VmCheckKind): boolean => failing.has(kind);
    return [
        ...(has("kataInstall") ? [{ kind: "installKata" } as const] : []),
        ...(has("modules") ? [{ kind: "loadModules" } as const] : []),
        ...(has("shimSymlink") ? [{ kind: "shimSymlink" } as const] : []),
        ...(has("kataConfig") ? [{ kind: "configureKata" } as const] : []),
        ...(has("k3sInstall") ? [{ kind: "installK3s" } as const] : []),
        ...(has("k3sRunning") && !has("k3sInstall") ? [{ kind: "startK3s" } as const] : []),
        ...(has("traefikDisabled") && !has("k3sInstall")
            ? [{ kind: "disableTraefik" } as const]
            : []),
        ...(has("containerdSocketAccess") || has("k3sInstall")
            ? [{ kind: "socketAccess" } as const]
            : []),
        ...(has("kubeconfig") || has("k3sInstall") ? [{ kind: "kubeconfig" } as const] : []),
        ...(has("containerdConfig") || has("k3sInstall")
            ? [{ kind: "containerdConfig" } as const]
            : []),
        ...(has("runtimeClass") || has("k3sInstall") ? [{ kind: "runtimeClass" } as const] : []),
    ];
}

export function renderFixStep(step: FixStep): readonly string[] {
    return match(step)
        .with({ kind: "installKata" }, () => {
            const tarball = `kata-static-${KATA_VERSION}-amd64.tar.zst`;
            const url = `https://github.com/kata-containers/kata-containers/releases/download/${KATA_VERSION}/${tarball}`;
            return [
                `# Install Kata Containers ${KATA_VERSION}`,
                `curl -fSL -o /tmp/${tarball} ${url}`,
                `sudo mkdir -p ${KATA_INSTALL_DIR}`,
                `sudo tar --use-compress-program=unzstd -xf /tmp/${tarball} --strip-components=3 -C ${KATA_INSTALL_DIR} ./opt/kata`,
                `sudo chmod 755 ${KATA_INSTALL_DIR}/bin/cloud-hypervisor`,
                `rm /tmp/${tarball}`,
                "",
            ];
        })
        .with({ kind: "loadModules" }, () => [
            "# Load kernel modules for Kata",
            ...REQUIRED_MODULES.map((m) => `sudo modprobe ${m}`),
            `printf '%s\\n' ${REQUIRED_MODULES.join(" ")} | sudo tee ${MODULES_LOAD_PATH}`,
            "",
        ])
        .with({ kind: "shimSymlink" }, () => [
            "# Symlink Kata shim for containerd discovery",
            `sudo ln -sf ${KATA_SHIM_PATH} ${SHIM_SYMLINK_PATH}`,
            "",
        ])
        .with({ kind: "configureKata" }, () => {
            const clhTemplate = `${KATA_INSTALL_DIR}/share/defaults/kata-containers/configuration-clh.toml`;
            return [
                "# Configure Kata for Cloud Hypervisor",
                `sudo mkdir -p ${KATA_CONFIG_DIR}`,
                `sudo sed -e 's|^path = ".*cloud-hypervisor.*"|path = "${KATA_INSTALL_DIR}/bin/cloud-hypervisor"|' \\`,
                `  -e 's|^virtio_fs_cache =.*|virtio_fs_cache = "auto"|' \\`,
                `  ${clhTemplate} | sudo tee ${KATA_CONFIG_PATH} > /dev/null`,
                `sudo sed -i '/^default_memory = /a enable_virtio_mem = true' ${KATA_CONFIG_PATH}`,
                "",
            ];
        })
        .with({ kind: "installK3s" }, () => [
            "# Install k3s (Traefik disabled)",
            'curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server --disable traefik" sudo -E sh -',
            "",
        ])
        .with({ kind: "startK3s" }, () => ["# Start k3s", "sudo systemctl start k3s", ""])
        .with({ kind: "disableTraefik" }, () => [
            "# Disable Traefik",
            `KUBECONFIG=${KUBECONFIG_PATH} kubectl delete helmchart traefik traefik-crd -n kube-system --ignore-not-found`,
            "sudo mkdir -p /etc/rancher/k3s",
            "sudo tee /etc/rancher/k3s/config.yaml <<'EOF'\ndisable:\n  - traefik\nEOF",
            "sudo systemctl restart k3s",
            "",
        ])
        .with({ kind: "socketAccess" }, () => [
            "# Grant user access to k3s containerd socket",
            "sudo groupadd -f k3s",
            "sudo usermod -aG k3s $(whoami)",
            "sudo mkdir -p /etc/systemd/system/k3s.service.d",
            "sudo tee /etc/systemd/system/k3s.service.d/socket-perms.conf <<'EOF'",
            "[Service]",
            "ExecStartPost=/bin/sh -c 'chown root:k3s /run/k3s/containerd/containerd.sock && chmod 0660 /run/k3s/containerd/containerd.sock'",
            "EOF",
            "sudo systemctl daemon-reload",
            "sudo systemctl restart k3s",
            "",
        ])
        .with({ kind: "kubeconfig" }, () => [
            "# Set up kubeconfig",
            "mkdir -p ~/.kube",
            "sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config",
            "sudo chown $(id -u):$(id -g) ~/.kube/config",
            "",
        ])
        .with({ kind: "containerdConfig" }, () => [
            "# Configure k3s containerd with Kata runtime",
            `sudo tee ${K3S_CONTAINERD_TMPL} <<'CONTAINERD_EOF'`,
            buildContainerdTemplate().trimEnd(),
            "CONTAINERD_EOF",
            "sudo systemctl restart k3s",
            "",
        ])
        .with({ kind: "runtimeClass" }, () => [
            "# Create Kata RuntimeClass",
            "KUBECONFIG=~/.kube/config kubectl apply -f - <<'EOF'",
            "apiVersion: node.k8s.io/v1\nkind: RuntimeClass\nmetadata:\n  name: kata\nhandler: kata",
            "EOF",
            "",
        ])
        .exhaustive();
}

function buildFixScript(failing: ReadonlySet<VmCheckKind>): string {
    const steps = getFixSteps(failing);
    const lines = ["#!/usr/bin/env bash", "set -euo pipefail", "", ...steps.flatMap(renderFixStep)];
    return lines.join("\n");
}

function buildContainerdTemplate(): string {
    return `version = 3
root = "/var/lib/rancher/k3s/agent/containerd"
state = "/run/k3s/containerd"

[grpc]
  address = "/run/k3s/containerd/containerd.sock"

[plugins.'io.containerd.internal.v1.opt']
  path = "/var/lib/rancher/k3s/agent/containerd"

[plugins.'io.containerd.grpc.v1.cri']
  stream_server_address = "127.0.0.1"
  stream_server_port = "10010"

[plugins.'io.containerd.cri.v1.runtime']
  enable_selinux = false
  enable_unprivileged_ports = true
  enable_unprivileged_icmp = true

[plugins.'io.containerd.cri.v1.images']
  snapshotter = "overlayfs"
  disable_snapshot_annotations = true

[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  runtime_type = "io.containerd.runc.v2"

[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
  SystemdCgroup = true

[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.kata]
  runtime_type = "io.containerd.kata.v2"
  privileged_without_host_devices = true

[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.kata.options]
  ConfigPath = "${KATA_CONFIG_PATH}"

[plugins.'io.containerd.cri.v1.images'.registry]
  config_path = "/var/lib/rancher/k3s/agent/etc/containerd/certs.d"
`;
}
