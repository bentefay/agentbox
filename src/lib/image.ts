import * as crypto from "crypto";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { match } from "ts-pattern";

import { exec, tryExec, shellEscape } from "./exec";
import type { Result } from "./result";
import { Ok } from "./result";

export const DEFAULT_IMAGE_NAME = "agentbox-agent:local";

const DEFAULT_DOCKERFILE = `FROM cruizba/ubuntu-dind:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \\
    git \\
    curl \\
    ca-certificates \\
    && rm -rf /var/lib/apt/lists/*

RUN userdel -r ubuntu 2>/dev/null || true \\
    && useradd -m -s /bin/bash -u 1000 agent \\
    && usermod -aG docker agent

RUN git config --system --add safe.directory /workspace

ENV HOME=/home/agent
ENV TERM=xterm-256color

WORKDIR /workspace
`;

// Tag includes a hash of the Dockerfile content so the image is rebuilt
// when the embedded Dockerfile changes (e.g. after an agentbox upgrade).
const DOCKERFILE_HASH = crypto
    .createHash("sha256")
    .update(DEFAULT_DOCKERFILE)
    .digest("hex")
    .slice(0, 12);
export const TAGGED_IMAGE_NAME = `${DEFAULT_IMAGE_NAME}-${DOCKERFILE_HASH}`;

async function imageExistsInContainerd(imageName: string): Promise<boolean> {
    const result = await exec(
        `k3s ctr images check name==${shellEscape(`docker.io/library/${imageName}`)}`,
        {
            captureOutput: true,
            rejectOnNonZeroExit: false,
        }
    );
    return result.code === 0 && result.stdout.includes(imageName);
}

async function imageExistsInDocker(imageName: string): Promise<boolean> {
    const result = await exec(`docker image inspect ${shellEscape(imageName)}`, {
        captureOutput: true,
        rejectOnNonZeroExit: false,
    });
    return result.code === 0;
}

export async function buildAgentImage(
    customImage?: string,
    backendKind?: "k3s" | "docker"
): Promise<Result<string, string>> {
    if (customImage) return Ok(customImage);

    const kind = backendKind ?? "k3s";

    // Skip build if image with this Dockerfile hash already exists in the target backend
    const alreadyCached = await match(kind)
        .with("k3s", () => imageExistsInContainerd(TAGGED_IMAGE_NAME))
        .with("docker", () => imageExistsInDocker(TAGGED_IMAGE_NAME))
        .exhaustive();

    if (alreadyCached) return Ok(TAGGED_IMAGE_NAME);

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "agentbox-"));

    fs.writeFileSync(path.join(tmpDir, "Dockerfile"), DEFAULT_DOCKERFILE);

    const buildResult = await tryExec(
        `docker build -t ${TAGGED_IMAGE_NAME} ${shellEscape(tmpDir)}`,
        "Docker build failed"
    );
    if (!buildResult.ok) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        return buildResult;
    }

    // Only import into k3s containerd when using the k3s backend
    const importResult = await match(kind)
        .with("k3s", () =>
            tryExec(
                `docker save ${TAGGED_IMAGE_NAME} | k3s ctr images import -`,
                "k3s image import failed"
            )
        )
        .with("docker", () => Promise.resolve(Ok(undefined)))
        .exhaustive();

    fs.rmSync(tmpDir, { recursive: true, force: true });

    if (!importResult.ok) return importResult;
    return Ok(TAGGED_IMAGE_NAME);
}
