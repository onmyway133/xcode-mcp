import { executeSimctl } from '../simulator-control/core.js';
import type { KeychainAction } from './types.js';

export async function keychain(
    deviceId: string,
    action: KeychainAction,
    certPath?: string
): Promise<void> {
    const args = ['keychain', `"${deviceId}"`, action];

    if (certPath) {
        args.push(`"${certPath}"`);
    }

    const result = await executeSimctl(args.join(' '));

    if (result.exitCode !== 0) {
        throw new Error(`Failed to modify keychain: ${result.stderr}`);
    }
}

export async function addRootCert(
    deviceId: string,
    certPath: string
): Promise<void> {
    return keychain(deviceId, 'add-root-cert', certPath);
}

export async function resetKeychain(deviceId: string): Promise<void> {
    return keychain(deviceId, 'reset');
}
