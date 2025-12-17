import { CommandExecutor } from '../command-executor.js';

export async function executeSimctl(args: string): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return CommandExecutor.execute(`xcrun simctl ${args}`);
}

export function extractOSVersion(runtime: string): string {
    const match = runtime.match(/iOS[- ](\d+[\d.]*)/i);
    return match ? match[1] : 'Unknown';
}

export function extractDeviceType(runtime: string): string {
    if (runtime.includes('iOS')) return 'iOS';
    if (runtime.includes('watchOS')) return 'watchOS';
    if (runtime.includes('tvOS')) return 'tvOS';
    if (runtime.includes('visionOS')) return 'visionOS';
    return 'Unknown';
}

export function inferProductFamily(name: string): string {
    if (name.includes('iPhone')) return 'iPhone';
    if (name.includes('iPad')) return 'iPad';
    if (name.includes('Watch')) return 'Apple Watch';
    if (name.includes('TV')) return 'Apple TV';
    if (name.includes('Vision')) return 'Apple Vision';
    return 'Unknown';
}
