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
    codec?: 'h264' | 'hevc';
    mask?: 'ignored' | 'alpha' | 'black';
    display?: 'internal' | 'external';
    force?: boolean;
}

export type PrivacyAction = 'grant' | 'revoke' | 'reset';
export type AppContainerType = 'app' | 'data' | 'groups';
