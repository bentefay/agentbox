import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import * as p from "@clack/prompts";

import { checkVm, smokeTest } from "../vm";

export async function cmdCheckVm(): Promise<number> {
    p.intro("agent \u00b7 check-vm");

    const diagnosis = await checkVm();

    for (const check of diagnosis.checks) {
        if (check.ok) {
            p.log.success(check.name);
        } else {
            p.log.error(check.name);
        }
    }

    if (!diagnosis.allGood) {
        if (diagnosis.fixScript) {
            const scriptPath = path.join(os.tmpdir(), "agentbox-setup-vm.sh");
            fs.writeFileSync(scriptPath, diagnosis.fixScript, { mode: 0o755 });
            p.note(scriptPath, "Fix script written");
            p.outro("Run the fix script to resolve issues");
        }
        return 1;
    }

    // All config checks passed — run smoke test
    const spin = p.spinner();
    spin.start("Running Kata VM smoke test...");

    const result = await smokeTest();

    if (result.ok) {
        spin.stop("Kata VM smoke test passed");
        p.outro("All checks passed");
        return 0;
    }

    spin.stop("Kata VM smoke test failed");
    if (result.error) {
        p.log.message(result.error);
    }
    p.outro("Config checks passed but smoke test failed");
    return 1;
}
