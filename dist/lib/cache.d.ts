import type { Result } from "./result";
export interface CachePaths {
    readonly cacheDir: string;
    readonly tarball: string;
    readonly manifest: string;
}
export declare function getCachePaths(agentsDir: string): CachePaths;
export declare function isCacheValid(cached: readonly string[] | null, currentImages: readonly string[], tarballExists: boolean): boolean;
export declare function stripDigest(ref: string): string;
export declare function dedupeAndSort(images: readonly string[]): string[];
export declare function ensureImageCache(agentsDir: string, images: readonly string[]): Promise<Result<string | null, string>>;
