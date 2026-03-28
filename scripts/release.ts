import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const ROOT = path.resolve(import.meta.dir, "..");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function die(msg: string): never {
    console.error(`\x1b[31merror:\x1b[0m ${msg}`);
    process.exit(1);
}

function info(msg: string): void {
    console.log(`\x1b[36m→\x1b[0m ${msg}`);
}

async function run(cmd: string[], opts?: { cwd?: string; capture?: boolean }): Promise<string> {
    const proc = Bun.spawn(cmd, {
        cwd: opts?.cwd ?? ROOT,
        stdout: opts?.capture ? "pipe" : "inherit",
        stderr: opts?.capture ? "pipe" : "inherit",
    });
    const exitCode = await proc.exited;
    if (exitCode !== 0) {
        die(`Command failed (exit ${exitCode}): ${cmd.join(" ")}`);
    }
    if (opts?.capture && proc.stdout) {
        return await new Response(proc.stdout).text();
    }
    return "";
}

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
let version: string | undefined;
let notes: string | undefined;

for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--notes") {
        notes = args[++i];
        if (!notes) die("--notes requires a value");
    } else if (!arg.startsWith("-")) {
        if (version) die("Unexpected extra argument");
        version = arg;
    } else {
        die(`Unknown flag: ${arg}`);
    }
}

if (!version) {
    die("Usage: bun run release <version> [--notes \"...\"]");
}

if (!/^\d+\.\d+\.\d+$/.test(version)) {
    die(`Invalid semver version: ${version}`);
}

// ---------------------------------------------------------------------------
// 1. Clean working tree
// ---------------------------------------------------------------------------

info("Checking for clean working tree...");
const status = await run(["git", "status", "--porcelain"], { capture: true });
if (status.trim().length > 0) {
    die("Working tree is not clean. Commit or stash changes first.");
}

// ---------------------------------------------------------------------------
// 2. Update version in package.json
// ---------------------------------------------------------------------------

info(`Bumping version to ${version}...`);
const pkgPath = path.join(ROOT, "package.json");
const pkgJson = await Bun.file(pkgPath).text();
const updatedPkgJson = pkgJson.replace(/"version":\s*"[^"]*"/, `"version": "${version}"`);
await Bun.write(pkgPath, updatedPkgJson);

// ---------------------------------------------------------------------------
// 3. Run checks
// ---------------------------------------------------------------------------

info("Running fmt...");
await run(["bun", "run", "fmt"]);

info("Running lint...");
await run(["bun", "run", "lint"]);

info("Running typecheck...");
await run(["bun", "run", "typecheck"]);

info("Running tests...");
await run(["bun", "run", "test"]);

// ---------------------------------------------------------------------------
// 4. Build
// ---------------------------------------------------------------------------

info("Building...");
await run(["bun", "run", "build"]);

// ---------------------------------------------------------------------------
// 5. Release notes
// ---------------------------------------------------------------------------

if (!notes) {
    const tmpFile = path.join(os.tmpdir(), `agentbox-release-${version}.md`);
    await Bun.write(tmpFile, `# Release v${version}\n\n`);

    const editor = process.env.EDITOR ?? "vi";
    info(`Opening ${editor} for release notes...`);
    await run([editor, tmpFile]);

    notes = (await Bun.file(tmpFile).text()).trim();
    fs.unlinkSync(tmpFile);

    if (!notes) {
        die("Empty release notes — aborting.");
    }
}

// ---------------------------------------------------------------------------
// 6. Commit, tag, push
// ---------------------------------------------------------------------------

info("Committing...");
await run(["git", "add", "-A"]);
await run(["git", "commit", "-m", `release: v${version}`]);

info(`Tagging v${version}...`);
await run(["git", "tag", `v${version}`]);

info("Pushing...");
await run(["git", "push"]);
await run(["git", "push", "--tags"]);

// ---------------------------------------------------------------------------
// 7. GitHub release
// ---------------------------------------------------------------------------

info("Publishing to npm...");
await run(["npm", "publish", "--access", "public"]);

info("Creating GitHub release...");
await run([
    "gh",
    "release",
    "create",
    `v${version}`,
    "--title",
    `v${version}`,
    "--notes",
    notes,
]);

info(`Released v${version}!`);
