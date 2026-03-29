import { describe, test, expect } from "bun:test";

import { Ok, Err, isOk, collectResults } from "./result";
import type { Result } from "./result";

describe("Ok", () => {
    test("produces a value with ok: true", () => {
        const result: Result<number, string> = Ok(42);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value).toBe(42);
        }
    });

    test("works with string values", () => {
        const result: Result<string, string> = Ok("hello");
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value).toBe("hello");
        }
    });

    test("works with complex objects", () => {
        const data = { name: "test", items: [1, 2, 3] };
        const result: Result<typeof data, string> = Ok(data);
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value).toEqual(data);
        }
    });
});

describe("Err", () => {
    test("produces a value with ok: false", () => {
        const result: Result<number, string> = Err("something went wrong");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe("something went wrong");
        }
    });

    test("works with Error objects", () => {
        const err = new Error("fail");
        const result: Result<number, Error> = Err(err);
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error).toBe(err);
        }
    });
});

describe("Result discriminated union", () => {
    test("narrows correctly in conditional checks", () => {
        const succeed: Result<number, string> = Ok(10);
        const fail: Result<number, string> = Err("bad");

        if (succeed.ok) {
            expect(succeed.value).toBe(10);
        } else {
            throw new Error("should not reach");
        }

        if (!fail.ok) {
            expect(fail.error).toBe("bad");
        } else {
            throw new Error("should not reach");
        }
    });
});

describe("isOk", () => {
    test("returns true for Ok values", () => {
        const result: Result<number, string> = Ok(42);
        expect(isOk(result)).toBe(true);
    });

    test("returns false for Err values", () => {
        const result: Result<number, string> = Err("bad");
        expect(isOk(result)).toBe(false);
    });

    test("narrows type when used as a filter predicate", () => {
        const results: readonly Result<number, string>[] = [Ok(1), Err("x"), Ok(3)];
        const okValues = results.filter(isOk).map((r) => r.value);
        expect(okValues).toEqual([1, 3]);
    });
});

describe("collectResults", () => {
    test("returns Ok with all values when all results are Ok", () => {
        const results: readonly Result<number, string>[] = [Ok(1), Ok(2), Ok(3)];
        const collected = collectResults(results);
        expect(collected.ok).toBe(true);
        if (collected.ok) {
            expect(collected.value).toEqual([1, 2, 3]);
        }
    });

    test("returns the first Err when one result is Err", () => {
        const results: readonly Result<number, string>[] = [Ok(1), Err("fail"), Ok(3)];
        const collected = collectResults(results);
        expect(collected.ok).toBe(false);
        if (!collected.ok) {
            expect(collected.error).toBe("fail");
        }
    });

    test("returns Ok with empty array for empty input", () => {
        const collected = collectResults([]);
        expect(collected.ok).toBe(true);
        if (collected.ok) {
            expect(collected.value).toEqual([]);
        }
    });

    test("returns the first Err when multiple results are Err", () => {
        const results: readonly Result<number, string>[] = [Ok(1), Err("first"), Err("second")];
        const collected = collectResults(results);
        expect(collected.ok).toBe(false);
        if (!collected.ok) {
            expect(collected.error).toBe("first");
        }
    });
});
