import { CommandExecutor } from '../command-executor.js';
import { executeSimctl, extractOSVersion, extractDeviceType, inferProductFamily } from './core.js';
import type { Simulator, SimulatorRuntime, SimulatorDeviceType } from '../../types.js';

export async function listDevices(): Promise<Simulator[]> {
    const result = await executeSimctl('list devices -j');

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list simulators: ${result.stderr}`);
    }

    const data = JSON.parse(result.stdout);
    const devices: Simulator[] = [];

    for (const [runtime, runtimeDevices] of Object.entries(data.devices)) {
        const osVersion = extractOSVersion(runtime);
        const deviceType = extractDeviceType(runtime);

        for (const device of runtimeDevices as any[]) {
            devices.push({
                udid: device.udid,
                name: device.name,
                state: device.state,
                deviceTypeIdentifier: device.deviceTypeIdentifier || '',
                runtime,
                isAvailable: device.isAvailable,
                osVersion,
                deviceType,
            });
        }
    }

    return devices;
}

export async function listRuntimes(): Promise<SimulatorRuntime[]> {
    const result = await executeSimctl('list runtimes -j');

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list runtimes: ${result.stderr}`);
    }

    const data = JSON.parse(result.stdout);
    return data.runtimes.map((runtime: any) => ({
        identifier: runtime.identifier,
        name: runtime.name,
        version: runtime.version,
        buildVersion: runtime.buildversion || runtime.buildVersion || '',
        isAvailable: runtime.isAvailable,
    }));
}

export async function listDeviceTypes(): Promise<SimulatorDeviceType[]> {
    const result = await executeSimctl('list devicetypes -j');

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list device types: ${result.stderr}`);
    }

    const data = JSON.parse(result.stdout);
    return data.devicetypes.map((deviceType: any) => ({
        identifier: deviceType.identifier,
        name: deviceType.name,
        productFamily: deviceType.productFamily || inferProductFamily(deviceType.name),
    }));
}

export async function boot(deviceId: string): Promise<void> {
    const result = await executeSimctl(`boot "${deviceId}"`);

    if (result.exitCode !== 0 && !result.stderr.includes('current state: Booted')) {
        throw new Error(`Failed to boot simulator: ${result.stderr}`);
    }
}

export async function shutdown(deviceId: string): Promise<void> {
    const result = await executeSimctl(`shutdown "${deviceId}"`);

    if (result.exitCode !== 0 && !result.stderr.includes('current state: Shutdown')) {
        throw new Error(`Failed to shutdown simulator: ${result.stderr}`);
    }
}

export async function erase(deviceId: string): Promise<void> {
    const result = await executeSimctl(`erase "${deviceId}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to erase simulator: ${result.stderr}`);
    }
}

export async function create(
    name: string,
    deviceType: string,
    runtime: string
): Promise<string> {
    const result = await executeSimctl(`create "${name}" "${deviceType}" "${runtime}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to create simulator: ${result.stderr}`);
    }

    return result.stdout.trim();
}

export async function deleteDevice(deviceId: string): Promise<void> {
    const result = await executeSimctl(`delete "${deviceId}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to delete simulator: ${result.stderr}`);
    }
}

export async function openSimulatorApp(): Promise<void> {
    const result = await CommandExecutor.execute('open -a Simulator');

    if (result.exitCode !== 0) {
        throw new Error(`Failed to open Simulator app: ${result.stderr}`);
    }
}
