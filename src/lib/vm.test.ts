import { describe, test, expect } from "bun:test";

import { getFixSteps, renderFixStep } from "./vm";
import type { VmCheckKind, FixStep } from "./vm";

/** Helper: create a set of failing check kinds. */
function failing(...kinds: readonly VmCheckKind[]): ReadonlySet<VmCheckKind> {
    return new Set(kinds);
}

/** All check kinds — represents a fully broken state. */
const ALL_KINDS: ReadonlySet<VmCheckKind> = new Set<VmCheckKind>([
    "kataInstall",
    "modules",
    "shimSymlink",
    "kataConfig",
    "k3sInstall",
    "k3sRunning",
    "containerdSocketAccess",
    "containerdConfig",
    "kubeconfig",
    "runtimeClass",
    "traefikDisabled"
]);

/** No failures — fully working. */
const NONE: ReadonlySet<VmCheckKind> = new Set();

function stepKinds(steps: readonly FixStep[]): readonly string[] {
    return steps.map((s) => s.kind);
}

describe("getFixSteps", () => {
    test("returns 9 steps for fully broken state (startK3s and disableTraefik excluded by k3sInstall)", () => {
        const steps = getFixSteps(ALL_KINDS);
        // When k3sInstall is failing, startK3s and disableTraefik are excluded
        // but socketAccess, kubeconfig, containerdConfig, runtimeClass are included via || k3sInstall
        expect(steps).toHaveLength(9);
        expect(stepKinds(steps)).toEqual([
            "installKata",
            "loadModules",
            "shimSymlink",
            "configureKata",
            "installK3s",
            // startK3s excluded (k3sInstall is failing)
            // disableTraefik excluded (k3sInstall is failing)
            "socketAccess",
            "kubeconfig",
            "containerdConfig",
            "runtimeClass"
        ]);
    });

    test("returns 0 steps for fully working state", () => {
        const steps = getFixSteps(NONE);
        expect(steps).toHaveLength(0);
    });

    test("startK3s only when k3sRunning failing && k3sInstall not failing", () => {
        const steps = getFixSteps(failing("k3sRunning"));
        expect(stepKinds(steps)).toContain("startK3s");
    });

    test("startK3s excluded when k3sInstall is failing", () => {
        const steps = getFixSteps(failing("k3sRunning", "k3sInstall"));
        expect(stepKinds(steps)).not.toContain("startK3s");
    });

    test("disableTraefik only when traefikDisabled failing && k3sInstall not failing", () => {
        const steps = getFixSteps(failing("traefikDisabled"));
        expect(stepKinds(steps)).toContain("disableTraefik");
    });

    test("disableTraefik excluded when k3sInstall is failing", () => {
        const steps = getFixSteps(failing("traefikDisabled", "k3sInstall"));
        expect(stepKinds(steps)).not.toContain("disableTraefik");
    });

    test("socketAccess included when k3sInstall failing even if socket is accessible", () => {
        const steps = getFixSteps(failing("k3sInstall"));
        expect(stepKinds(steps)).toContain("socketAccess");
    });

    test("kubeconfig included when k3sInstall failing even if kubeconfig exists", () => {
        const steps = getFixSteps(failing("k3sInstall"));
        expect(stepKinds(steps)).toContain("kubeconfig");
    });

    test("containerdConfig included when k3sInstall failing even if already configured", () => {
        const steps = getFixSteps(failing("k3sInstall"));
        expect(stepKinds(steps)).toContain("containerdConfig");
    });

    test("runtimeClass included when k3sInstall failing even if already exists", () => {
        const steps = getFixSteps(failing("k3sInstall"));
        expect(stepKinds(steps)).toContain("runtimeClass");
    });

    test("only kata-related steps when only kata needs fixing", () => {
        const steps = getFixSteps(failing("kataInstall", "modules", "shimSymlink", "kataConfig"));
        expect(stepKinds(steps)).toEqual([
            "installKata",
            "loadModules",
            "shimSymlink",
            "configureKata"
        ]);
    });
});

describe("renderFixStep", () => {
    test("installKata renders download and extract commands", () => {
        const lines = renderFixStep({ kind: "installKata" });
        expect(lines[0]).toContain("Install Kata Containers");
        expect(lines.some((l) => l.includes("curl -fSL"))).toBe(true);
        expect(lines.some((l) => l.includes("tar --use-compress-program=unzstd"))).toBe(true);
        expect(lines.some((l) => l.includes("chmod 755"))).toBe(true);
        // Ends with empty string for blank line
        expect(lines[lines.length - 1]).toBe("");
    });

    test("loadModules renders modprobe for each required module", () => {
        const lines = renderFixStep({ kind: "loadModules" });
        expect(lines[0]).toContain("Load kernel modules");
        expect(lines.some((l) => l.includes("modprobe vhost_vsock"))).toBe(true);
        expect(lines.some((l) => l.includes("modprobe vhost"))).toBe(true);
        expect(lines.some((l) => l.includes("modules-load.d/kata.conf"))).toBe(true);
    });

    test("shimSymlink renders ln -sf command", () => {
        const lines = renderFixStep({ kind: "shimSymlink" });
        expect(lines.some((l) => l.includes("ln -sf"))).toBe(true);
        expect(lines.some((l) => l.includes("containerd-shim-kata-v2"))).toBe(true);
    });

    test("configureKata renders sed commands for cloud hypervisor config", () => {
        const lines = renderFixStep({ kind: "configureKata" });
        expect(lines[0]).toContain("Configure Kata for Cloud Hypervisor");
        expect(lines.some((l) => l.includes("configuration-clh.toml"))).toBe(true);
        expect(lines.some((l) => l.includes("virtio_fs_cache"))).toBe(true);
        expect(lines.some((l) => l.includes("enable_virtio_mem"))).toBe(true);
    });

    test("installK3s renders k3s install with traefik disabled", () => {
        const lines = renderFixStep({ kind: "installK3s" });
        expect(lines.some((l) => l.includes("get.k3s.io"))).toBe(true);
        expect(lines.some((l) => l.includes("--disable traefik"))).toBe(true);
    });

    test("startK3s renders systemctl start", () => {
        const lines = renderFixStep({ kind: "startK3s" });
        expect(lines).toEqual(["# Start k3s", "sudo systemctl start k3s", ""]);
    });

    test("socketAccess renders systemd override for socket permissions", () => {
        const lines = renderFixStep({ kind: "socketAccess" });
        expect(lines.some((l) => l.includes("groupadd -f k3s"))).toBe(true);
        expect(lines.some((l) => l.includes("usermod -aG k3s"))).toBe(true);
        expect(lines.some((l) => l.includes("socket-perms.conf"))).toBe(true);
        expect(lines.some((l) => l.includes("daemon-reload"))).toBe(true);
    });

    test("kubeconfig renders kube config copy", () => {
        const lines = renderFixStep({ kind: "kubeconfig" });
        expect(lines.some((l) => l.includes("mkdir -p ~/.kube"))).toBe(true);
        expect(lines.some((l) => l.includes("k3s.yaml"))).toBe(true);
        expect(lines.some((l) => l.includes("chown"))).toBe(true);
    });

    test("containerdConfig renders containerd template", () => {
        const lines = renderFixStep({ kind: "containerdConfig" });
        expect(lines.some((l) => l.includes("config.toml.tmpl"))).toBe(true);
        expect(lines.some((l) => l.includes("containerd.runtimes.kata"))).toBe(true);
        expect(lines.some((l) => l.includes("restart k3s"))).toBe(true);
    });

    test("runtimeClass renders kubectl apply", () => {
        const lines = renderFixStep({ kind: "runtimeClass" });
        expect(lines.some((l) => l.includes("kubectl apply"))).toBe(true);
        expect(lines.some((l) => l.includes("RuntimeClass"))).toBe(true);
        expect(lines.some((l) => l.includes("name: kata"))).toBe(true);
    });

    test("every step ends with empty string for trailing blank line", () => {
        const allSteps: readonly FixStep[] = [
            { kind: "installKata" },
            { kind: "loadModules" },
            { kind: "shimSymlink" },
            { kind: "configureKata" },
            { kind: "installK3s" },
            { kind: "startK3s" },
            { kind: "disableTraefik" },
            { kind: "socketAccess" },
            { kind: "kubeconfig" },
            { kind: "containerdConfig" },
            { kind: "runtimeClass" }
        ];
        for (const step of allSteps) {
            const lines = renderFixStep(step);
            expect(lines[lines.length - 1]).toBe("");
        }
    });
});

describe("buildFixScript end-to-end", () => {
    // buildFixScript is not exported, but we can compose getFixSteps + renderFixStep
    // to verify the same output
    function buildFixScript(failing: ReadonlySet<VmCheckKind>): string {
        const steps = getFixSteps(failing);
        const lines = [
            "#!/usr/bin/env bash",
            "set -euo pipefail",
            "",
            ...steps.flatMap(renderFixStep)
        ];
        return lines.join("\n");
    }

    test("fully working state produces minimal script", () => {
        const script = buildFixScript(NONE);
        expect(script).toBe("#!/usr/bin/env bash\nset -euo pipefail\n");
    });

    test("fully broken state produces script with shebang and all sections", () => {
        const script = buildFixScript(ALL_KINDS);
        expect(script).toContain("#!/usr/bin/env bash");
        expect(script).toContain("set -euo pipefail");
        expect(script).toContain("Install Kata Containers");
        expect(script).toContain("Load kernel modules");
        expect(script).toContain("Install k3s");
        expect(script).toContain("Grant user access");
        expect(script).toContain("Set up kubeconfig");
        expect(script).toContain("Configure k3s containerd");
        expect(script).toContain("Create Kata RuntimeClass");
    });

    test("single fix produces script with only that section", () => {
        const script = buildFixScript(failing("modules"));
        expect(script).toContain("modprobe vhost_vsock");
        expect(script).not.toContain("Install Kata");
        expect(script).not.toContain("Install k3s");
    });
});
