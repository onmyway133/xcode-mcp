import { CommandExecutor } from '../command-executor.js';
import type { NotarizationCredentials } from './types.js';

export function buildCredentialsArgs(credentials: NotarizationCredentials): string[] {
    const args: string[] = [];

    if (credentials.keychainProfile) {
        args.push('--keychain-profile', `"${credentials.keychainProfile}"`);
    } else {
        if (credentials.appleId) {
            args.push('--apple-id', `"${credentials.appleId}"`);
        }
        if (credentials.teamId) {
            args.push('--team-id', `"${credentials.teamId}"`);
        }
        if (credentials.password) {
            args.push('--password', `"${credentials.password}"`);
        }
    }

    return args;
}

export async function executeNotarytool(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return CommandExecutor.execute(`xcrun notarytool ${args.join(' ')}`);
}

export async function executeCodesign(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return CommandExecutor.execute(`codesign ${args.join(' ')}`);
}

export async function executeStapler(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return CommandExecutor.execute(`xcrun stapler ${args.join(' ')}`);
}

export async function executeSpctl(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return CommandExecutor.execute(`spctl ${args.join(' ')}`);
}

export async function executeDitto(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return CommandExecutor.execute(`ditto ${args.join(' ')}`);
}

export async function executeHdiutil(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return CommandExecutor.execute(`hdiutil ${args.join(' ')}`);
}

export async function executeSecurity(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return CommandExecutor.execute(`security ${args.join(' ')}`);
}
