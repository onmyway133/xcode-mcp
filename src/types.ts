// Xcode Build Types
export interface BuildSettings {
    target: string;
    configuration: string;
    sdk: string;
    settings: Record<string, string>;
}

export interface BuildResult {
    success: boolean;
    output: string;
    errors: string[];
    warnings: string[];
    duration: number;
}

export interface TestResult {
    success: boolean;
    testsRun: number;
    testsPassed: number;
    testsFailed: number;
    testsSkipped: number;
    duration: number;
    details: TestCaseResult[];
}

export interface TestCaseResult {
    testName: string;
    className: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    failureMessage?: string;
}

export interface InfoPlistContent {
    filePath: string;
    content: Record<string, any>;
}

export interface XcodeProject {
    projectPath: string;
    targets: string[];
    schemes: string[];
    configurations: string[];
}

// Simulator Types
export interface Simulator {
    udid: string;
    name: string;
    state: SimulatorState;
    deviceTypeIdentifier: string;
    runtime: string;
    isAvailable: boolean;
    osVersion: string;
    deviceType: string;
}

export type SimulatorState = 'Shutdown' | 'Booted' | 'Creating' | 'Booting' | 'ShuttingDown';

export interface SimulatorRuntime {
    identifier: string;
    name: string;
    version: string;
    buildVersion: string;
    isAvailable: boolean;
}

export interface SimulatorDeviceType {
    identifier: string;
    name: string;
    productFamily: string;
}

export interface AppInstallResult {
    success: boolean;
    message: string;
    bundleId?: string;
}

export interface ScreenshotResult {
    success: boolean;
    filePath: string;
    message: string;
}

export interface VideoRecordingResult {
    success: boolean;
    filePath: string;
    duration: number;
    message: string;
}

// Notarize Types
export interface NotarizeCredentials {
    appleId: string;
    teamId: string;
    password?: string;
    keychainProfile?: string;
}

export interface NotarizeSubmission {
    submissionId: string;
    status: NotarizeStatus;
    message: string;
    createdDate?: string;
}

export type NotarizeStatus =
    | 'In Progress'
    | 'Accepted'
    | 'Invalid'
    | 'Rejected'
    | 'Unknown';

export interface NotarizeHistory {
    submissions: NotarizeSubmission[];
}

export interface StapleResult {
    success: boolean;
    message: string;
    filePath: string;
}

// Device Compatibility Types
export interface DeviceInfo {
    name: string;
    identifier: string;
    releaseYear: number;
    screenSize: string;
    screenResolution: string;
    ppi: number;
    minOSVersion: string;
    maxOSVersion: string;
    chipset: string;
    deviceType: 'iPhone' | 'iPad' | 'iPod' | 'Apple Watch' | 'Apple TV';
}

export interface IOSVersionInfo {
    version: string;
    releaseDate: string;
    supportedDevices: string[];
    marketShare?: number;
}

export interface CompatibilityReport {
    minOSVersion: string;
    maxOSVersion: string;
    supportedDevices: DeviceInfo[];
    droppedDevices: DeviceInfo[];
}

// Command Execution Types
export interface CommandResult {
    stdout: string;
    stderr: string;
    exitCode: number;
}

// UI Settings Types
export interface AppearanceResult {
    success: boolean;
    deviceId: string;
    appearance: 'light' | 'dark';
}

export interface ContentSizeResult {
    success: boolean;
    deviceId: string;
    size: string;
}

export interface IncreaseContrastResult {
    success: boolean;
    deviceId: string;
    enabled: boolean;
}

// Pasteboard Types
export interface PasteboardResult {
    success: boolean;
    deviceId: string;
    content?: string;
    message?: string;
}

// App Query Types
export interface InstalledApp {
    bundleId: string;
    name: string;
    version?: string;
    shortVersion?: string;
    path?: string;
    dataContainer?: string;
    type?: 'user' | 'system';
}
