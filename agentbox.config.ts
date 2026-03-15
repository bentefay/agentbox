import { defineConfig } from "agentbox";

export default defineConfig({
    tmuxModes: [
        {
            name: "dev",
            windows: [
                {
                    name: "agent",
                    panes: [{ command: "claude --dangerously-skip-permissions" }],
                },
                { name: "shell", panes: [{ command: "" }] },
            ],
        },
    ],

    dependencyStrategies: [],

    resources: { memoryGi: 8 },
});
