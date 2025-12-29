// Core utilities
export {
    executeSimctl,
    extractOSVersion,
    extractDeviceType,
    inferProductFamily,
} from './core.js';

// Device management
export {
    listDevices,
    listRuntimes,
    listDeviceTypes,
    boot,
    shutdown,
    erase,
    create,
    deleteDevice,
    openSimulatorApp,
} from './device.js';

// App management
export {
    installApp,
    uninstallApp,
    launchApp,
    terminateApp,
    getAppContainer,
    openAppContainer,
    spawn,
} from './app.js';

// IO operations
export {
    screenshot,
    recordVideo,
    openUrl,
    addMedia,
    pushNotification,
} from './io.js';

// System operations
export {
    setLocation,
    clearLocation,
    setStatusBar,
    clearStatusBar,
    privacy,
    getLogs,
} from './system.js';

// Video recording (stateful)
export {
    startRecording,
    stopRecording,
    isRecording,
    getRecordingInfo,
} from './video.js';

// UI settings
export {
    setAppearance,
    getAppearance,
    setContentSize,
    getContentSize,
    setIncreaseContrast,
    getIncreaseContrast,
} from './ui-settings.js';
export type { AppearanceMode, ContentSize } from './ui-settings.js';

// Pasteboard
export {
    copyToPasteboard,
    pasteFromPasteboard,
    syncPasteboard,
} from './pasteboard.js';
export type { SyncDirection } from './pasteboard.js';

// Query functions
export {
    getBootedSimulator,
    getBootedSimulators,
    listInstalledApps,
    getAppInfo,
} from './query.js';

// Types
export * from './types.js';
