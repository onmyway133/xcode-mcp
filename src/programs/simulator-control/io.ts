import { executeSimctl } from './core.js';
import type { ScreenshotResult, VideoRecordingResult } from '../../types.js';
import type { VideoRecordingOptions } from './types.js';
import { spawn as spawnProcess } from 'child_process';
import { existsSync } from 'fs';

export async function screenshot(
    deviceId: string,
    outputPath: string
): Promise<ScreenshotResult> {
    const result = await executeSimctl(`io "${deviceId}" screenshot "${outputPath}"`);

    if (result.exitCode !== 0) {
        return {
            success: false,
            filePath: outputPath,
            message: result.stderr,
        };
    }

    return {
        success: true,
        filePath: outputPath,
        message: 'Screenshot captured successfully',
    };
}

export async function recordVideo(
    deviceId: string,
    outputPath: string,
    options: VideoRecordingOptions = {}
): Promise<{ stop: () => Promise<VideoRecordingResult> }> {
    const args = [`xcrun simctl io "${deviceId}" recordVideo`];

    if (options.codec) {
        args.push(`--codec "${options.codec}"`);
    }
    if (options.mask) {
        args.push(`--mask "${options.mask}"`);
    }
    args.push(`"${outputPath}"`);

    const startTime = Date.now();

    const child = spawnProcess('sh', ['-c', args.join(' ')], {
        detached: true,
    });

    return {
        stop: async () => {
            child.kill('SIGINT');

            return new Promise((resolve) => {
                child.on('close', () => {
                    const duration = Date.now() - startTime;
                    resolve({
                        success: true,
                        filePath: outputPath,
                        duration,
                        message: 'Video recording saved successfully',
                    });
                });
            });
        },
    };
}

export async function openUrl(
    deviceId: string,
    url: string
): Promise<void> {
    const result = await executeSimctl(`openurl "${deviceId}" "${url}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to open URL: ${result.stderr}`);
    }
}

export async function addMedia(
    deviceId: string,
    mediaPath: string
): Promise<void> {
    if (!existsSync(mediaPath)) {
        throw new Error(`Media file not found: ${mediaPath}`);
    }

    const result = await executeSimctl(`addmedia "${deviceId}" "${mediaPath}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to add media: ${result.stderr}`);
    }
}

export async function pushNotification(
    deviceId: string,
    bundleId: string,
    payload: object
): Promise<void> {
    const payloadJson = JSON.stringify(payload);
    const result = await executeSimctl(`push "${deviceId}" "${bundleId}" - <<< '${payloadJson}'`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to push notification: ${result.stderr}`);
    }
}
