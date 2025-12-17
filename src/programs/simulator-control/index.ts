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

// Types
export * from './types.js';
