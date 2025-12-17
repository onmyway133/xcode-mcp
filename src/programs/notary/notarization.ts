import { buildCredentialsArgs, executeNotarytool, executeStapler } from './core.js';
import type {
    SubmitOptions,
    NotarizationSubmitResult,
    NotarizationStatusResult,
    NotarizationHistoryOptions,
    NotarizationHistoryEntry,
    StapleResult,
    NotarizationCredentials,
} from './types.js';
import { existsSync } from 'fs';

export async function submit(
    filePath: string,
    options: SubmitOptions = {}
): Promise<NotarizationSubmitResult> {
    if (!existsSync(filePath)) {
        return {
            success: false,
            message: `File not found: ${filePath}`,
        };
    }

    const args = ['submit', `"${filePath}"`];
    args.push(...buildCredentialsArgs(options));

    if (options.wait) {
        args.push('--wait');
        if (options.timeout) {
            args.push('--timeout', `${options.timeout}s`);
        }
    }

    const result = await executeNotarytool(args);

    if (result.exitCode !== 0) {
        return {
            success: false,
            message: result.stderr || result.stdout,
        };
    }

    const idMatch = result.stdout.match(/id:\s*([a-f0-9-]+)/i);
    const statusMatch = result.stdout.match(/status:\s*(\w+)/i);

    return {
        success: true,
        submissionId: idMatch?.[1],
        status: statusMatch?.[1],
        message: result.stdout,
    };
}

export async function checkStatus(
    submissionId: string,
    credentials: NotarizationCredentials = {}
): Promise<NotarizationStatusResult> {
    const args = ['info', submissionId];
    args.push(...buildCredentialsArgs(credentials));

    const result = await executeNotarytool(args);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to check status: ${result.stderr}`);
    }

    const statusMatch = result.stdout.match(/status:\s*(\w+)/i);

    return {
        status: statusMatch?.[1] || 'Unknown',
        submissionId,
        message: result.stdout,
    };
}

export async function getLog(
    submissionId: string,
    credentials: NotarizationCredentials = {}
): Promise<object> {
    const args = ['log', submissionId];
    args.push(...buildCredentialsArgs(credentials));

    const result = await executeNotarytool(args);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to get log: ${result.stderr}`);
    }

    try {
        return JSON.parse(result.stdout);
    } catch {
        return { rawLog: result.stdout };
    }
}

export async function getHistory(
    options: NotarizationHistoryOptions = {}
): Promise<NotarizationHistoryEntry[]> {
    const args = ['history'];
    args.push(...buildCredentialsArgs(options));

    if (options.limit) {
        args.push('-n', `${options.limit}`);
    }

    const result = await executeNotarytool(args);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to get history: ${result.stderr}`);
    }

    const entries: NotarizationHistoryEntry[] = [];
    const lines = result.stdout.split('\n');

    for (const line of lines) {
        const match = line.match(/([a-f0-9-]+)\s+(\S+)\s+(\S+)\s+(.+)/i);
        if (match) {
            entries.push({
                id: match[1],
                name: match[4].trim(),
                status: match[2],
                createdDate: match[3],
            });
        }
    }

    return entries;
}

export async function staple(filePath: string): Promise<StapleResult> {
    if (!existsSync(filePath)) {
        return {
            success: false,
            message: `File not found: ${filePath}`,
        };
    }

    const result = await executeStapler(['staple', `"${filePath}"`]);

    if (result.exitCode !== 0) {
        return {
            success: false,
            message: result.stderr || result.stdout,
        };
    }

    return {
        success: true,
        message: 'Notarization ticket stapled successfully',
    };
}

export async function validateStaple(filePath: string): Promise<StapleResult> {
    if (!existsSync(filePath)) {
        return {
            success: false,
            message: `File not found: ${filePath}`,
        };
    }

    const result = await executeStapler(['validate', `"${filePath}"`]);

    return {
        success: result.exitCode === 0,
        message: result.exitCode === 0
            ? 'Staple is valid'
            : result.stderr || result.stdout,
    };
}

export async function notarizeAndStaple(
    filePath: string,
    options: SubmitOptions = {}
): Promise<NotarizationSubmitResult & { stapled?: boolean }> {
    const submitResult = await submit(filePath, {
        ...options,
        wait: true,
    });

    if (!submitResult.success) {
        return submitResult;
    }

    if (submitResult.status?.toLowerCase() === 'accepted') {
        const stapleResult = await staple(filePath);
        return {
            ...submitResult,
            stapled: stapleResult.success,
        };
    }

    return submitResult;
}

export async function storeCredentials(
    profile: string,
    appleId: string,
    teamId: string
): Promise<void> {
    const args = [
        'store-credentials',
        `"${profile}"`,
        '--apple-id', `"${appleId}"`,
        '--team-id', `"${teamId}"`,
    ];

    const result = await executeNotarytool(args);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to store credentials: ${result.stderr}`);
    }
}
