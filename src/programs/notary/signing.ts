import { executeCodesign, executeSpctl, executeSecurity } from './core.js';
import type {
    SignCodeOptions,
    SignCodeResult,
    VerifyCodeResult,
    SigningIdentity,
} from './types.js';
import { existsSync } from 'fs';

export async function signCode(
    path: string,
    identity: string,
    options: SignCodeOptions = {}
): Promise<SignCodeResult> {
    if (!existsSync(path)) {
        return {
            success: false,
            message: `File not found: ${path}`,
        };
    }

    const args: string[] = ['--sign', `"${identity}"`];

    if (options.entitlements) {
        args.push('--entitlements', `"${options.entitlements}"`);
    }
    if (options.deep) {
        args.push('--deep');
    }
    if (options.force) {
        args.push('--force');
    }
    if (options.timestamp !== false) {
        args.push('--timestamp');
    }
    if (options.hardened !== false) {
        args.push('--options', 'runtime');
    }

    args.push(`"${path}"`);

    const result = await executeCodesign(args);

    if (result.exitCode !== 0) {
        return {
            success: false,
            message: result.stderr || result.stdout,
        };
    }

    return {
        success: true,
        message: 'Code signed successfully',
    };
}

export async function verifyCode(path: string): Promise<VerifyCodeResult> {
    if (!existsSync(path)) {
        return {
            valid: false,
            details: `File not found: ${path}`,
        };
    }

    const codesignResult = await executeCodesign([
        '--verify',
        '--verbose=4',
        `"${path}"`,
    ]);

    const spctlResult = await executeSpctl([
        '--assess',
        '--verbose=4',
        `"${path}"`,
    ]);

    const valid = codesignResult.exitCode === 0;
    const details = [
        'Codesign verification:',
        codesignResult.stdout || codesignResult.stderr,
        '',
        'Gatekeeper assessment:',
        spctlResult.stdout || spctlResult.stderr,
    ].join('\n');

    return {
        valid,
        details,
    };
}

export async function listSigningIdentities(): Promise<SigningIdentity[]> {
    const result = await executeSecurity([
        'find-identity',
        '-v',
        '-p', 'codesigning',
    ]);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list signing identities: ${result.stderr}`);
    }

    const identities: SigningIdentity[] = [];
    const lines = result.stdout.split('\n');

    for (const line of lines) {
        const match = line.match(/\d+\)\s+([A-F0-9]+)\s+"(.+)"/);
        if (match) {
            identities.push({
                hash: match[1],
                name: match[2],
            });
        }
    }

    return identities;
}
