import { describe, expect, test } from "bun:test";

import { stripDigest, dedupeAndSort, getCachePaths, isCacheValid } from "./cache";

describe("stripDigest", () => {
    test("preserves a plain image reference", () => {
        expect(stripDigest("postgres:16")).toBe("postgres:16");
    });

    test("preserves a reference without a digest", () => {
        expect(stripDigest("redis:7-alpine")).toBe("redis:7-alpine");
    });

    test("strips a sha256 digest suffix", () => {
        expect(stripDigest("postgres:16@sha256:abc123def456")).toBe("postgres:16");
    });

    test("strips a full-length sha256 digest", () => {
        const ref =
            "myregistry.io/myimage:latest@sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
        expect(stripDigest(ref)).toBe("myregistry.io/myimage:latest");
    });

    test("does not strip non-sha256 suffixes", () => {
        expect(stripDigest("image:tag@md5:abc123")).toBe("image:tag@md5:abc123");
    });
});

describe("dedupeAndSort", () => {
    test("returns sorted unique images", () => {
        expect(dedupeAndSort(["redis:7", "postgres:16", "redis:7"])).toEqual([
            "postgres:16",
            "redis:7"
        ]);
    });

    test("returns empty array for no images", () => {
        expect(dedupeAndSort([])).toEqual([]);
    });

    test("returns single image unchanged", () => {
        expect(dedupeAndSort(["postgres:16"])).toEqual(["postgres:16"]);
    });
});

describe("isCacheValid", () => {
    test("returns true when manifests match and tarball exists", () => {
        expect(isCacheValid(["postgres:16", "redis:7"], ["postgres:16", "redis:7"], true)).toBe(
            true
        );
    });

    test("returns false when cached is null", () => {
        expect(isCacheValid(null, ["postgres:16"], true)).toBe(false);
    });

    test("returns false when tarball does not exist", () => {
        expect(isCacheValid(["postgres:16"], ["postgres:16"], false)).toBe(false);
    });

    test("returns false when manifests differ in length", () => {
        expect(isCacheValid(["postgres:16"], ["postgres:16", "redis:7"], true)).toBe(false);
    });

    test("returns false when manifests differ in content", () => {
        expect(isCacheValid(["postgres:16", "redis:6"], ["postgres:16", "redis:7"], true)).toBe(
            false
        );
    });

    test("returns true for empty arrays when tarball exists", () => {
        expect(isCacheValid([], [], true)).toBe(true);
    });
});

describe("getCachePaths", () => {
    test("constructs paths under the agents directory", () => {
        const paths = getCachePaths("/home/user/.agents");
        expect(paths.cacheDir).toBe("/home/user/.agents/cache");
        expect(paths.tarball).toBe("/home/user/.agents/cache/docker-images.tar");
        expect(paths.manifest).toBe("/home/user/.agents/cache/docker-images.manifest");
    });

    test("handles trailing slash in agents dir", () => {
        const paths = getCachePaths("/tmp/agents/");
        expect(paths.cacheDir).toBe("/tmp/agents/cache");
    });
});
