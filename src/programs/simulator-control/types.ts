export interface StatusBarOptions {
    time?: string;
    dataNetwork?: string;
    wifiMode?: string;
    wifiBars?: number;
    cellularMode?: string;
    cellularBars?: number;
    batteryState?: string;
    batteryLevel?: number;
}

export interface VideoRecordingOptions {
    codec?: string;
    mask?: string;
}

export type PrivacyAction = 'grant' | 'revoke' | 'reset';
export type AppContainerType = 'app' | 'data' | 'groups';
