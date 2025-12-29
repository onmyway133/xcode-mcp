import { executeSimctl } from './core.js';
import type { InstalledApp } from '../../types.js';

export async function getBootedSimulator(): Promise<string | null> {
    const result = await executeSimctl('list devices -j');

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list devices: ${result.stderr}`);
    }

    const data = JSON.parse(result.stdout);

    for (const runtimeDevices of Object.values(data.devices)) {
        for (const device of runtimeDevices as any[]) {
            if (device.state === 'Booted') {
                return device.udid;
            }
        }
    }

    return null;
}

export async function getBootedSimulators(): Promise<string[]> {
    const result = await executeSimctl('list devices -j');

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list devices: ${result.stderr}`);
    }

    const data = JSON.parse(result.stdout);
    const bootedDevices: string[] = [];

    for (const runtimeDevices of Object.values(data.devices)) {
        for (const device of runtimeDevices as any[]) {
            if (device.state === 'Booted') {
                bootedDevices.push(device.udid);
            }
        }
    }

    return bootedDevices;
}

export async function listInstalledApps(deviceId: string): Promise<InstalledApp[]> {
    const result = await executeSimctl(`listapps "${deviceId}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list apps: ${result.stderr}`);
    }

    const apps: InstalledApp[] = [];
    const lines = result.stdout.split('\n');

    let currentApp: Partial<InstalledApp> = {};
    let indentLevel = 0;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        if (line.match(/^\s{4}"[^"]+"\s*=\s*\{/)) {
            const bundleIdMatch = line.match(/"([^"]+)"/);
            if (bundleIdMatch) {
                if (currentApp.bundleId) {
                    apps.push(currentApp as InstalledApp);
                }
                currentApp = { bundleId: bundleIdMatch[1] };
                indentLevel = 1;
            }
        } else if (indentLevel > 0) {
            const keyValueMatch = trimmedLine.match(/^"?(\w+)"?\s*=\s*"?([^";]+)"?;?$/);
            if (keyValueMatch) {
                const [, key, value] = keyValueMatch;
                switch (key) {
                    case 'CFBundleDisplayName':
                    case 'CFBundleName':
                        if (!currentApp.name) {
                            currentApp.name = value;
                        }
                        break;
                    case 'CFBundleShortVersionString':
                        currentApp.shortVersion = value;
                        break;
                    case 'CFBundleVersion':
                        currentApp.version = value;
                        break;
                    case 'Path':
                        currentApp.path = value;
                        break;
                    case 'DataContainer':
                        currentApp.dataContainer = value;
                        break;
                    case 'ApplicationType':
                        currentApp.type = value.toLowerCase() === 'user' ? 'user' : 'system';
                        break;
                }
            }

            if (trimmedLine === '};') {
                indentLevel = 0;
            }
        }
    }

    if (currentApp.bundleId) {
        apps.push(currentApp as InstalledApp);
    }

    return apps.filter(app => app.bundleId);
}

export async function getAppInfo(
    deviceId: string,
    bundleId: string
): Promise<InstalledApp> {
    const result = await executeSimctl(`appinfo "${deviceId}" "${bundleId}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to get app info: ${result.stderr}`);
    }

    const app: InstalledApp = {
        bundleId,
        name: bundleId,
    };

    const lines = result.stdout.split('\n');
    for (const line of lines) {
        const trimmedLine = line.trim();
        const keyValueMatch = trimmedLine.match(/^"?(\w+)"?\s*=\s*"?([^";]+)"?;?$/);
        if (keyValueMatch) {
            const [, key, value] = keyValueMatch;
            switch (key) {
                case 'CFBundleDisplayName':
                case 'CFBundleName':
                    if (app.name === bundleId) {
                        app.name = value;
                    }
                    break;
                case 'CFBundleShortVersionString':
                    app.shortVersion = value;
                    break;
                case 'CFBundleVersion':
                    app.version = value;
                    break;
                case 'Path':
                    app.path = value;
                    break;
                case 'DataContainer':
                    app.dataContainer = value;
                    break;
                case 'ApplicationType':
                    app.type = value.toLowerCase() === 'user' ? 'user' : 'system';
                    break;
            }
        }
    }

    return app;
}
