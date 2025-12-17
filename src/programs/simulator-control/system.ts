import { executeSimctl } from './core.js';
import type { StatusBarOptions, PrivacyAction } from './types.js';

export async function setLocation(
    deviceId: string,
    latitude: number,
    longitude: number
): Promise<void> {
    const result = await executeSimctl(`location "${deviceId}" set ${latitude},${longitude}`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to set location: ${result.stderr}`);
    }
}

export async function clearLocation(deviceId: string): Promise<void> {
    const result = await executeSimctl(`location "${deviceId}" clear`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to clear location: ${result.stderr}`);
    }
}

export async function setStatusBar(
    deviceId: string,
    options: StatusBarOptions
): Promise<void> {
    const args = ['status_bar', `"${deviceId}"`, 'override'];

    if (options.time) args.push(`--time "${options.time}"`);
    if (options.dataNetwork) args.push(`--dataNetwork "${options.dataNetwork}"`);
    if (options.wifiMode) args.push(`--wifiMode "${options.wifiMode}"`);
    if (options.wifiBars !== undefined) args.push(`--wifiBars ${options.wifiBars}`);
    if (options.cellularMode) args.push(`--cellularMode "${options.cellularMode}"`);
    if (options.cellularBars !== undefined) args.push(`--cellularBars ${options.cellularBars}`);
    if (options.batteryState) args.push(`--batteryState "${options.batteryState}"`);
    if (options.batteryLevel !== undefined) args.push(`--batteryLevel ${options.batteryLevel}`);

    const result = await executeSimctl(args.join(' '));

    if (result.exitCode !== 0) {
        throw new Error(`Failed to set status bar: ${result.stderr}`);
    }
}

export async function clearStatusBar(deviceId: string): Promise<void> {
    const result = await executeSimctl(`status_bar "${deviceId}" clear`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to clear status bar: ${result.stderr}`);
    }
}

export async function privacy(
    deviceId: string,
    action: PrivacyAction,
    service: string,
    bundleId?: string
): Promise<void> {
    const bundleArg = bundleId ? `"${bundleId}"` : '';
    const result = await executeSimctl(`privacy "${deviceId}" ${action} ${service} ${bundleArg}`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to modify privacy settings: ${result.stderr}`);
    }
}

export async function getLogs(
    deviceId: string,
    predicate?: string
): Promise<string> {
    const predicateArg = predicate ? `--predicate '${predicate}'` : '';
    const result = await executeSimctl(
        `spawn "${deviceId}" log show ${predicateArg} --last 5m`
    );

    return result.stdout;
}
