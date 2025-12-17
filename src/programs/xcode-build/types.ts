export interface BuildOptions {
    scheme?: string;
    target?: string;
    configuration?: string;
    sdk?: string;
    destination?: string;
    derivedDataPath?: string;
    clean?: boolean;
    additionalArgs?: string[];
}

export interface TestOptions {
    scheme: string;
    destination?: string;
    configuration?: string;
    testPlan?: string;
    onlyTesting?: string[];
    skipTesting?: string[];
    resultBundlePath?: string;
    derivedDataPath?: string;
}

export interface ArchiveOptions {
    scheme: string;
    archivePath: string;
    configuration?: string;
    destination?: string;
}

export interface ExportOptions {
    archivePath: string;
    exportPath: string;
    exportOptionsPlist: string;
}
