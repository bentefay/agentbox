export declare function cmdNew(opts: {
    readonly branch?: string;
    readonly base?: string;
    readonly mode?: string;
    readonly noTmux: boolean;
    readonly trust: boolean;
    readonly untrusted: boolean;
    readonly useLocalBranch: boolean;
    readonly noFocus: boolean;
}): Promise<number>;
