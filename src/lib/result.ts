export type Result<T, E> =
    | { readonly ok: true; readonly value: T }
    | { readonly ok: false; readonly error: E };

export function Ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
    return { ok: false, error };
}

/** Type guard that narrows a Result to its Ok variant. Useful with `.filter(isOk)`. */
export function isOk<T, E>(
    result: Result<T, E>
): result is { readonly ok: true; readonly value: T } {
    return result.ok;
}

/**
 * Collect an array of Results into a single Result.
 * Returns Ok with all values if every element is Ok, or the first Err encountered.
 */
export function collectResults<T, E>(results: readonly Result<T, E>[]): Result<readonly T[], E> {
    const values: T[] = [];
    for (const result of results) {
        if (!result.ok) return result;
        values.push(result.value);
    }
    return Ok(values);
}
