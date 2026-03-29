// Minimal YAML serializer for k8s manifests.
// Handles strings, numbers, booleans, null, arrays, and objects.
// No external YAML library needed.

export type YamlValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | readonly YamlValue[]
    | { readonly [key: string]: YamlValue };

type YamlObject = { readonly [key: string]: YamlValue };

function isArray(value: unknown): value is readonly YamlValue[] {
    return Array.isArray(value);
}

/** Returns true if the value should be rendered as a block (on the next line) rather than inline. */
function isBlock(value: YamlValue): boolean {
    if (value == null || typeof value !== "object") return false;
    if (isArray(value)) return value.length > 0;
    return Object.keys(value).length > 0;
}

function serializeValue(value: YamlValue, indent: number): string {
    if (value == null) return "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "number") return String(value);
    if (typeof value === "string") return serializeString(value);
    if (isArray(value)) return serializeArray(value, indent);
    return serializeObject(value, indent);
}

function serializeString(value: string): string {
    // Use JSON quoting for strings that could be misinterpreted or contain special chars
    if (
        value === "" ||
        value === "true" ||
        value === "false" ||
        value === "null" ||
        /[\n\r:#{}[\],&*?|>!'"%@`]/.test(value) ||
        /^\d/.test(value)
    ) {
        return JSON.stringify(value);
    }
    return value;
}

function serializeArray(arr: readonly YamlValue[], indent: number): string {
    if (arr.length === 0) return "[]";
    const pad = " ".repeat(indent);
    return arr
        .map((item) => {
            if (item != null && typeof item === "object" && !isArray(item)) {
                // Object items: first key on same line as dash, rest indented
                const entries = Object.entries(item);
                if (entries.length === 0) return `${pad}- {}`;
                const lines = entries.map(([k, v], i) => {
                    const prefix = i === 0 ? `${pad}- ` : `${pad}  `;
                    if (isBlock(v)) {
                        const serialized = serializeScalarOrBlock(v, indent + 4);
                        return `${prefix}${k}:\n${serialized}`;
                    }
                    return `${prefix}${k}: ${serializeValue(v, indent + 4)}`;
                });
                return lines.join("\n");
            }
            return `${pad}- ${serializeValue(item, indent + 2)}`;
        })
        .join("\n");
}

function serializeObject(obj: YamlObject, indent: number): string {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "{}";
    const pad = " ".repeat(indent);
    return entries
        .map(([k, v]) => {
            if (isBlock(v)) {
                return `${pad}${k}:\n${serializeScalarOrBlock(v, indent + 2)}`;
            }
            return `${pad}${k}: ${serializeValue(v, indent + 2)}`;
        })
        .join("\n");
}

function serializeScalarOrBlock(value: YamlValue, indent: number): string {
    if (value == null || typeof value !== "object") return serializeValue(value, indent);
    if (isArray(value)) return serializeArray(value, indent);
    return serializeObject(value, indent);
}

/** Serialize a plain JS object to a YAML string. */
export function toYaml(value: YamlValue): string {
    if (value != null && typeof value === "object" && !isArray(value)) {
        return serializeObject(value, 0);
    }
    return serializeValue(value, 0);
}

/** Serialize multiple documents separated by `---`. */
export function toYamlDocuments(docs: readonly YamlValue[]): string {
    return docs.map(toYaml).join("\n---\n");
}
