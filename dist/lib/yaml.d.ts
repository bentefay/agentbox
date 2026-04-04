export type YamlValue = string | number | boolean | null | undefined | readonly YamlValue[] | {
    readonly [key: string]: YamlValue;
};
/** Serialize a plain JS object to a YAML string. */
export declare function toYaml(value: YamlValue): string;
/** Serialize multiple documents separated by `---`. */
export declare function toYamlDocuments(docs: readonly YamlValue[]): string;
