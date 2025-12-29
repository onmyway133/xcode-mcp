import { CommandExecutor } from '../command-executor.js';
import { executeSimctl } from './core.js';
import type { AppInstallResult } from '../../types.js';
import type { AppContainerType } from './types.js';
import { existsSync } from 'fs';
import { join } from 'path';

async function getBundleIdFromApp(appPath: string): Promise<string | undefined> {
    const plistPath = join(appPath, 'Info.plist');

    if (!existsSync(plistPath)) {
        return undefined;
    }

    const result = await CommandExecutor.execute(`plutil -convert json -o - "${plistPath}"`);

    if (result.exitCode !== 0) {
        return undefined;
    }

    try {
        const data = JSON.parse(result.stdout);
        return data.CFBundleIdentifier;
    } catch {
        return undefined;
    }
}

export async function installApp(
    deviceId: string,
    appPath: string
): Promise<AppInstallResult> {
    if (!existsSync(appPath)) {
        return {
            success: false,
            message: `App not found at path: ${appPath}`,
        };
    }

    const result = await executeSimctl(`install "${deviceId}" "${appPath}"`);

    if (result.exitCode !== 0) {
        return {
            success: false,
            message: result.stderr,
        };
    }

    const bundleId = await getBundleIdFromApp(appPath);

    return {
        success: true,
        message: 'App installed successfully',
        bundleId,
    };
}

export async function uninstallApp(
    deviceId: string,
    bundleId: string
): Promise<void> {
    const result = await executeSimctl(`uninstall "${deviceId}" "${bundleId}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to uninstall app: ${result.stderr}`);
    }
}

export async function launchApp(
    deviceId: string,
    bundleId: string,
    waitForDebugger = false
): Promise<void> {
    const waitFlag = waitForDebugger ? '-w' : '';
    const result = await executeSimctl(`launch ${waitFlag} "${deviceId}" "${bundleId}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to launch app: ${result.stderr}`);
    }
}

export async function terminateApp(
    deviceId: string,
    bundleId: string
): Promise<void> {
    const result = await executeSimctl(`terminate "${deviceId}" "${bundleId}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to terminate app: ${result.stderr}`);
    }
}

export async function getAppContainer(
    deviceId: string,
    bundleId: string,
    containerType: AppContainerType = 'data'
): Promise<string> {
    const result = await executeSimctl(
        `get_app_container "${deviceId}" "${bundleId}" ${containerType}`
    );

    if (result.exitCode !== 0) {
        throw new Error(`Failed to get app container: ${result.stderr}`);
    }

    return result.stdout.trim();
}

export async function openAppContainer(
    deviceId: string,
    bundleId: string,
    containerType: AppContainerType = 'data'
): Promise<{ success: boolean; path: string; message: string }> {
    const containerPath = await getAppContainer(deviceId, bundleId, containerType);

    const openResult = await CommandExecutor.execute(`open "${containerPath}"`);

    if (openResult.exitCode !== 0) {
        return {
            success: false,
            path: containerPath,
            message: `Failed to open Finder: ${openResult.stderr}`,
        };
    }

    return {
        success: true,
        path: containerPath,
        message: `Opened ${containerType} container in Finder`,
    };
}

export async function spawn(
    deviceId: string,
    command: string,
    args: string[] = []
): Promise<string> {
    const argsStr = args.map((a) => `"${a}"`).join(' ');
    const result = await executeSimctl(`spawn "${deviceId}" ${command} ${argsStr}`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to spawn command: ${result.stderr}`);
    }

    return result.stdout;
}
