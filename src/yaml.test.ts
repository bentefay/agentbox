import { describe, test, expect } from "bun:test";

import { toYaml, toYamlDocuments } from "./yaml";

describe("toYaml", () => {
    test("serializes simple scalars", () => {
        expect(toYaml("hello")).toBe("hello");
        expect(toYaml(42)).toBe("42");
        expect(toYaml(true)).toBe("true");
        expect(toYaml(false)).toBe("false");
        expect(toYaml(null)).toBe("null");
    });

    test("quotes strings that look like numbers", () => {
        expect(toYaml("123")).toBe('"123"');
    });

    test("quotes strings with special characters", () => {
        expect(toYaml("hello: world")).toBe('"hello: world"');
        expect(toYaml("")).toBe('""');
        expect(toYaml("true")).toBe('"true"');
        expect(toYaml("false")).toBe('"false"');
        expect(toYaml("null")).toBe('"null"');
    });

    test("serializes flat object", () => {
        expect(toYaml({ name: "test", value: 42 })).toBe("name: test\nvalue: 42");
    });

    test("serializes nested object", () => {
        const result = toYaml({
            metadata: {
                name: "my-pod",
                labels: { app: "agent" },
            },
        });
        expect(result).toBe("metadata:\n  name: my-pod\n  labels:\n    app: agent");
    });

    test("serializes empty array as []", () => {
        expect(toYaml({ ports: [] })).toBe("ports: []");
    });

    test("serializes empty object as {}", () => {
        expect(toYaml({ emptyDir: {} })).toBe("emptyDir: {}");
    });

    test("serializes array of scalars", () => {
        const result = toYaml({ items: ["a", "b", "c"] });
        expect(result).toBe("items:\n  - a\n  - b\n  - c");
    });

    test("serializes array of objects with compact dash notation", () => {
        const result = toYaml({
            env: [
                { name: "FOO", value: "bar" },
                { name: "BAZ", value: "qux" },
            ],
        });
        expect(result).toBe("env:\n  - name: FOO\n    value: bar\n  - name: BAZ\n    value: qux");
    });

    test("serializes nested objects inside arrays", () => {
        const result = toYaml({
            volumes: [
                {
                    name: "workspace",
                    hostPath: { path: "/data", type: "Directory" },
                },
            ],
        });
        expect(result).toBe(
            "volumes:\n  - name: workspace\n    hostPath:\n      path: /data\n      type: Directory"
        );
    });

    test("quotes JSON-encoded strings correctly", () => {
        const result = toYaml({
            command: ["bash", "-c", "echo hello && sleep infinity"],
        });
        expect(result).toContain('"echo hello && sleep infinity"');
    });

    test("handles memory strings like 16Gi", () => {
        const result = toYaml({ memory: "16Gi" });
        expect(result).toBe('memory: "16Gi"');
    });

    test("handles boolean values in objects", () => {
        const result = toYaml({ readOnly: true, privileged: false });
        expect(result).toBe("readOnly: true\nprivileged: false");
    });
});

describe("toYamlDocuments", () => {
    test("separates multiple documents with ---", () => {
        const result = toYamlDocuments([
            { apiVersion: "v1", kind: "Pod" },
            { apiVersion: "v1", kind: "Service" },
        ]);
        expect(result).toContain("kind: Pod");
        expect(result).toContain("---");
        expect(result).toContain("kind: Service");
    });
});
