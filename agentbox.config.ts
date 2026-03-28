import { bunStrategy, claudeStrategy, defineConfig } from "agentbox";

export default defineConfig({
    tmuxModes: [
        {
            name: "dev",
            windows: [
                {
                    name: "agent",
                    panes: [{ command: "claude --dangerously-skip-permissions" }],
                },
                {
                    name: "test",
                    panes: [{ command: "bun test --watch" }],
                },
                {
                    name: "devtools",
                    panes: [
                        {
                            command: [
                                "docker build -t claude-devtools https://github.com/matt1398/claude-devtools.git",
                                "&&",
                                "docker run --rm",
                                "  -p 3456:3456",
                                "  -v /home/agent/.claude:/data/.claude:ro",
                                "  -e HOST=0.0.0.0",
                                "  -e PORT=3456",
                                "  claude-devtools",
                            ].join(" "),
                            sleepSeconds: 5,
                        },
                    ],
                },
                { name: "shell", panes: [{ command: "" }] },
            ],
        },
    ],

    dependencyStrategies: [claudeStrategy(), bunStrategy()],

    resources: { memoryGi: 8, cpuLimit: 4 },

    servicePorts: [{ name: "devtools", port: 3456 }],
});
