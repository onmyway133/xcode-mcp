import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import type { CommandResult } from '../types.js';

const execAsync = promisify(exec);

export class CommandExecutor {
    static async execute(command: string, options: { cwd?: string; timeout?: number } = {}): Promise<CommandResult> {
        const { cwd, timeout = 300000 } = options;

        try {
            const { stdout, stderr } = await execAsync(command, {
                cwd,
                timeout,
                maxBuffer: 50 * 1024 * 1024,
            });

            return {
                stdout: stdout.trim(),
                stderr: stderr.trim(),
                exitCode: 0,
            };
        } catch (error: any) {
            return {
                stdout: error.stdout?.trim() || '',
                stderr: error.stderr?.trim() || error.message,
                exitCode: error.code || 1,
            };
        }
    }

    static async executeWithStreaming(
        command: string,
        args: string[],
        options: { cwd?: string; onStdout?: (data: string) => void; onStderr?: (data: string) => void } = {}
    ): Promise<CommandResult> {
        const { cwd, onStdout, onStderr } = options;

        return new Promise((resolve) => {
            const child = spawn(command, args, { cwd, shell: true });

            let stdout = '';
            let stderr = '';

            child.stdout?.on('data', (data) => {
                const text = data.toString();
                stdout += text;
                onStdout?.(text);
            });

            child.stderr?.on('data', (data) => {
                const text = data.toString();
                stderr += text;
                onStderr?.(text);
            });

            child.on('close', (code) => {
                resolve({
                    stdout: stdout.trim(),
                    stderr: stderr.trim(),
                    exitCode: code || 0,
                });
            });

            child.on('error', (error) => {
                resolve({
                    stdout: stdout.trim(),
                    stderr: error.message,
                    exitCode: 1,
                });
            });
        });
    }
}
