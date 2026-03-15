import * as fs from "fs";

import * as p from "@clack/prompts";

import { resolveCacheImages } from "../config";
import { getAgentsDirPaths } from "../git";
import { resolveConfig } from "./resolve-config";

export async function cmdCache(): Promise<number> {
    const resolved = await resolveConfig();
    if (resolved == null) return 1;
    const { config, repoPath } = resolved;
    const { ensureImageCache } = await import("../cache");
    const paths = getAgentsDirPaths(repoPath);

    if (!config.cacheImages) {
        p.log.info("No cache images configured");
        return 0;
    }

    p.intro("agent · cache");
    const cacheSpinner = p.spinner();
    cacheSpinner.start("Resolving image list...");
    const images = await resolveCacheImages(config.cacheImages);
    if (images.length === 0) {
        cacheSpinner.stop("No images to cache");
        p.outro("Done");
        return 0;
    }
    cacheSpinner.stop(`Found ${images.length} image${images.length === 1 ? "" : "s"}`);

    const pullSpinner = p.spinner();
    pullSpinner.start("Caching docker images...");
    const result = await ensureImageCache(paths.agentsDir, images);
    if (!result.ok) {
        pullSpinner.stop("Failed");
        p.log.error(result.error);
        p.log.info("Ensure Docker is running and the configured images are pullable");
        p.outro("Aborted");
        return 1;
    }
    if (result.value) {
        const stats = fs.statSync(result.value);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(0);
        pullSpinner.stop(
            `Cached ${images.length} image${images.length === 1 ? "" : "s"} (${sizeMB} MB)`
        );
    } else {
        pullSpinner.stop("Docker images already cached");
    }
    p.outro("Done");
    return 0;
}
