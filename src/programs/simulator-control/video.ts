import { spawn, ChildProcess } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import type { VideoRecordingResult } from '../../types.js';
import type { VideoRecordingOptions } from './types.js';

interface ActiveRecording {
    process: ChildProcess;
    outputPath: string;
    deviceId: string;
    startTime: number;
    codec: string;
}

let activeRecording: ActiveRecording | null = null;

export function isRecording(): boolean {
    return activeRecording !== null;
}

export function getRecordingInfo(): { deviceId: string; outputPath: string; duration: number } | null {
    if (!activeRecording) {
        return null;
    }
    return {
        deviceId: activeRecording.deviceId,
        outputPath: activeRecording.outputPath,
        duration: Date.now() - activeRecording.startTime,
    };
}

export async function startRecording(
    deviceId: string,
    outputPath: string,
    options: VideoRecordingOptions = {}
): Promise<{ success: boolean; message: string; outputPath: string }> {
    if (activeRecording) {
        return {
            success: false,
            message: `Recording already in progress for device ${activeRecording.deviceId}`,
            outputPath: activeRecording.outputPath,
        };
    }

    if (existsSync(outputPath) && !options.force) {
        return {
            success: false,
            message: `Output file already exists: ${outputPath}. Use force option to overwrite.`,
            outputPath,
        };
    }

    if (existsSync(outputPath) && options.force) {
        unlinkSync(outputPath);
    }

    const args = ['simctl', 'io', deviceId, 'recordVideo'];

    if (options.codec) {
        args.push(`--codec=${options.codec}`);
    }
    if (options.mask) {
        args.push(`--mask=${options.mask}`);
    }
    if (options.display) {
        args.push(`--display=${options.display}`);
    }

    args.push(outputPath);

    return new Promise((resolve) => {
        const child = spawn('xcrun', args, {
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        let started = false;
        let errorMessage = '';

        child.stderr?.on('data', (data: Buffer) => {
            const output = data.toString();
            if (output.includes('Recording started')) {
                started = true;
                activeRecording = {
                    process: child,
                    outputPath,
                    deviceId,
                    startTime: Date.now(),
                    codec: options.codec || 'hevc',
                };
                resolve({
                    success: true,
                    message: 'Recording started successfully',
                    outputPath,
                });
            } else {
                errorMessage += output;
            }
        });

        child.on('error', (err) => {
            resolve({
                success: false,
                message: `Failed to start recording: ${err.message}`,
                outputPath,
            });
        });

        child.on('close', (code) => {
            if (!started) {
                resolve({
                    success: false,
                    message: errorMessage || `Recording process exited with code ${code}`,
                    outputPath,
                });
            }
        });

        setTimeout(() => {
            if (!started && !errorMessage) {
                activeRecording = {
                    process: child,
                    outputPath,
                    deviceId,
                    startTime: Date.now(),
                    codec: options.codec || 'hevc',
                };
                resolve({
                    success: true,
                    message: 'Recording started (assumed)',
                    outputPath,
                });
            }
        }, 3000);
    });
}

export async function stopRecording(): Promise<VideoRecordingResult> {
    if (!activeRecording) {
        return {
            success: false,
            filePath: '',
            duration: 0,
            message: 'No active recording to stop',
        };
    }

    const { process: child, outputPath, startTime } = activeRecording;

    return new Promise((resolve) => {
        child.on('close', () => {
            const duration = Date.now() - startTime;
            activeRecording = null;

            const fileExists = existsSync(outputPath);
            resolve({
                success: fileExists,
                filePath: outputPath,
                duration,
                message: fileExists
                    ? 'Recording saved successfully'
                    : 'Recording stopped but file may not have been saved',
            });
        });

        child.kill('SIGINT');
    });
}
