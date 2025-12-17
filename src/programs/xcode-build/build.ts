import { buildXcodebuildArgs, parseErrors, parseWarnings, executeXcodebuild } from './core.js';
import type { BuildResult } from '../../types.js';
import type { BuildOptions, ArchiveOptions, ExportOptions } from './types.js';

export async function build(projectPath: string, options: BuildOptions = {}): Promise<BuildResult> {
    const startTime = Date.now();
    const args = buildXcodebuildArgs(projectPath, 'build', options);

    if (options.clean) {
        args.unshift('clean');
    }

    const result = await executeXcodebuild(args);

    const duration = Date.now() - startTime;
    const errors = parseErrors(result.stdout + result.stderr);
    const warnings = parseWarnings(result.stdout + result.stderr);

    return {
        success: result.exitCode === 0,
        output: result.stdout,
        errors,
        warnings,
        duration,
    };
}

export async function buildForTesting(
    projectPath: string,
    options: {
        scheme: string;
        destination?: string;
        configuration?: string;
        derivedDataPath?: string;
    }
): Promise<BuildResult> {
    const startTime = Date.now();
    const args = buildXcodebuildArgs(projectPath, 'build-for-testing', options);

    const result = await executeXcodebuild(args);

    const duration = Date.now() - startTime;
    const errors = parseErrors(result.stdout + result.stderr);
    const warnings = parseWarnings(result.stdout + result.stderr);

    return {
        success: result.exitCode === 0,
        output: result.stdout,
        errors,
        warnings,
        duration,
    };
}

export async function clean(
    projectPath: string,
    options: {
        scheme?: string;
        target?: string;
        configuration?: string;
    } = {}
): Promise<BuildResult> {
    const startTime = Date.now();
    const args = buildXcodebuildArgs(projectPath, 'clean', options);

    const result = await executeXcodebuild(args);

    const duration = Date.now() - startTime;

    return {
        success: result.exitCode === 0,
        output: result.stdout,
        errors: [],
        warnings: [],
        duration,
    };
}

export async function analyze(
    projectPath: string,
    options: {
        scheme?: string;
        target?: string;
        configuration?: string;
    } = {}
): Promise<BuildResult> {
    const startTime = Date.now();
    const args = buildXcodebuildArgs(projectPath, 'analyze', options);

    const result = await executeXcodebuild(args);

    const duration = Date.now() - startTime;
    const errors = parseErrors(result.stdout + result.stderr);
    const warnings = parseWarnings(result.stdout + result.stderr);

    return {
        success: result.exitCode === 0,
        output: result.stdout,
        errors,
        warnings,
        duration,
    };
}

export async function archive(projectPath: string, options: ArchiveOptions): Promise<BuildResult> {
    const startTime = Date.now();
    const args = buildXcodebuildArgs(projectPath, 'archive', options);
    args.push(`-archivePath "${options.archivePath}"`);

    const result = await executeXcodebuild(args);

    const duration = Date.now() - startTime;
    const errors = parseErrors(result.stdout + result.stderr);
    const warnings = parseWarnings(result.stdout + result.stderr);

    return {
        success: result.exitCode === 0,
        output: result.stdout,
        errors,
        warnings,
        duration,
    };
}

export async function exportArchive(options: ExportOptions): Promise<BuildResult> {
    const startTime = Date.now();
    const args = [
        '-exportArchive',
        `-archivePath "${options.archivePath}"`,
        `-exportPath "${options.exportPath}"`,
        `-exportOptionsPlist "${options.exportOptionsPlist}"`,
    ];

    const result = await executeXcodebuild(args);

    const duration = Date.now() - startTime;
    const errors = parseErrors(result.stdout + result.stderr);
    const warnings = parseWarnings(result.stdout + result.stderr);

    return {
        success: result.exitCode === 0,
        output: result.stdout,
        errors,
        warnings,
        duration,
    };
}
