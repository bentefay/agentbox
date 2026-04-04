export type Result<T, E> = {
    readonly ok: true;
    readonly value: T;
} | {
    readonly ok: false;
    readonly error: E;
};
export declare function Ok<T>(value: T): Result<T, never>;
export declare function Err<E>(error: E): Result<never, E>;
/** Type guard that narrows a Result to its Ok variant. Useful with `.filter(isOk)`. */
export declare function isOk<T, E>(result: Result<T, E>): result is {
    readonly ok: true;
    readonly value: T;
};
/**
 * Collect an array of Results into a single Result.
 * Returns Ok with all values if every element is Ok, or the first Err encountered.
 */
export declare function collectResults<T, E>(results: readonly Result<T, E>[]): Result<readonly T[], E>;
