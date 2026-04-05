import { describe, test, expect } from "bun:test";

import { nixStrategy } from "./strategies";

describe("nixStrategy", () => {
    describe("shellInit", () => {
        test("returns a conditional source that skips when file is missing", () => {
            const strategy = nixStrategy();
            const inits = strategy.shellInit!();
            expect(inits).toHaveLength(1);
            expect(inits[0]).toBe(
                "[ -f /workspace/.nix-dev-env.sh ] && source /workspace/.nix-dev-env.sh"
            );
        });
    });
});
