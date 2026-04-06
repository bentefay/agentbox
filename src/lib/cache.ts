import * as fs from "fs";
import * as path from "path";

import { exec, tryExec, shellEscape } from "./exec";
import type { Result } from "./result";
import { Ok } from "./result";

export interface CachePaths {
    readonly cacheDir: string;
    readonly tarball: string;
    readonly manifest: string;
}

export function getCachePaths(agentsDir: string): CachePaths {
    const cacheDir = path.join(agentsDir, "cache");
    return {
        cacheDir,
        tarball: path.join(cacheDir, "docker-images.tar"),
        manifest: path.join(cacheDir, "docker-images.manifest")
    };
}

function readManifest(manifestPath: string): string[] | null {
    try {
        const content = fs.readFileSync(manifestPath, "utf-8").trim();
        return content ? content.split("\n").sort() : null;
    } catch {
        return null;
    }
}

function writeManifest(manifestPath: string, images: string[]): void {
    fs.writeFileSync(manifestPath, images.sort().join("\n") + "\n");
}

export function isCacheValid(
    cached: readonly string[] | null,
    currentImages: readonly string[],
    tarballExists: boolean
): boolean {
    if (cached == null) return false;
    if (!tarballExists) return false;
    if (cached.length !== currentImages.length) return false;
    return cached.every((img, i) => img === currentImages[i]);
}

export function stripDigest(ref: string): string {
    return ref.replace(/@sha256:[a-f0-9]+$/, "");
}

export function dedupeAndSort(images: readonly string[]): string[] {
    return [...new Set(images)].sort();
}

export async function ensureImageCache(
    agentsDir: string,
    images: readonly string[]
): Promise<Result<string | null, string>> {
    const sorted = dedupeAndSort(images);
    if (sorted.length === 0) return Ok(null);

    const paths = getCachePaths(agentsDir);
    const cached = readManifest(paths.manifest);

    // Check if cache is up to date
    if (isCacheValid(cached, sorted, fs.existsSync(paths.tarball))) {
        return Ok(paths.tarball);
    }

    // Rebuild cache
    fs.mkdirSync(paths.cacheDir, { recursive: true });

    // Pull images in parallel
    await Promise.all(
        sorted.map((image) =>
            exec(`docker pull ${shellEscape(image)}`, { rejectOnNonZeroExit: false })
        )
    );

    // Tag digest-pinned images with short tags in parallel
    await Promise.all(
        sorted
            .filter((image) => stripDigest(image) !== image)
            .map((image) =>
                exec(`docker tag ${shellEscape(image)} ${shellEscape(stripDigest(image))}`, {
                    rejectOnNonZeroExit: false
                })
            )
    );

    // Save to tarball
    const saveRefs = sorted.map(stripDigest);
    const imageArgs = saveRefs.map((img) => shellEscape(img)).join(" ");
    const saveResult = await tryExec(
        `docker save ${imageArgs} -o ${shellEscape(paths.tarball)}`,
        "Docker save failed"
    );
    if (!saveResult.ok) return saveResult;

    writeManifest(paths.manifest, sorted);
    return Ok(paths.tarball);
}
