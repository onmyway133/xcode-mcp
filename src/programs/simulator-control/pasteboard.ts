import { spawn } from 'child_process';
import { executeSimctl } from './core.js';
import type { PasteboardResult } from '../../types.js';

export type SyncDirection = 'host-to-device' | 'device-to-host';

export async function copyToPasteboard(
    deviceId: string,
    text: string
): Promise<PasteboardResult> {
    return new Promise((resolve) => {
        const child = spawn('xcrun', ['simctl', 'pbcopy', deviceId], {
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stderr = '';

        child.stderr?.on('data', (data: Buffer) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve({
                    success: true,
                    deviceId,
                    message: 'Text copied to pasteboard',
                });
            } else {
                resolve({
                    success: false,
                    deviceId,
                    message: stderr || `Failed with exit code ${code}`,
                });
            }
        });

        child.on('error', (err) => {
            resolve({
                success: false,
                deviceId,
                message: `Failed to copy to pasteboard: ${err.message}`,
            });
        });

        child.stdin?.write(text);
        child.stdin?.end();
    });
}

export async function pasteFromPasteboard(
    deviceId: string
): Promise<PasteboardResult> {
    const result = await executeSimctl(`pbpaste "${deviceId}"`);

    if (result.exitCode !== 0) {
        return {
            success: false,
            deviceId,
            message: result.stderr || 'Failed to paste from pasteboard',
        };
    }

    return {
        success: true,
        deviceId,
        content: result.stdout,
    };
}

export async function syncPasteboard(
    deviceId: string,
    direction: SyncDirection
): Promise<PasteboardResult> {
    const flag = direction === 'host-to-device' ? '--host-to-device' : '--device-to-host';
    const result = await executeSimctl(`pbsync "${deviceId}" ${flag}`);

    if (result.exitCode !== 0) {
        return {
            success: false,
            deviceId,
            message: result.stderr || 'Failed to sync pasteboard',
        };
    }

    return {
        success: true,
        deviceId,
        message: `Pasteboard synced ${direction.replace('-', ' ')}`,
    };
}
