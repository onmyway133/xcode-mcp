import { CommandExecutor } from '../command-executor.js';
import { executeDitto, executeHdiutil } from './core.js';
import type { CreateArchiveResult } from './types.js';
import { existsSync } from 'fs';
import { basename, dirname, join } from 'path';

export async function createZip(
    appPath: string,
    outputPath: string
): Promise<CreateArchiveResult> {
    if (!existsSync(appPath)) {
        return {
            success: false,
            filePath: outputPath,
            message: `App not found: ${appPath}`,
        };
    }

    const result = await executeDitto([
        '-c', '-k',
        '--keepParent',
        `"${appPath}"`,
        `"${outputPath}"`,
    ]);

    if (result.exitCode !== 0) {
        return {
            success: false,
            filePath: outputPath,
            message: result.stderr || result.stdout,
        };
    }

    return {
        success: true,
        filePath: outputPath,
        message: 'ZIP archive created successfully',
    };
}

export async function createDmg(
    appPath: string,
    outputPath: string,
    volumeName?: string
): Promise<CreateArchiveResult> {
    if (!existsSync(appPath)) {
        return {
            success: false,
            filePath: outputPath,
            message: `App not found: ${appPath}`,
        };
    }

    const appName = basename(appPath, '.app');
    const volume = volumeName || appName;
    const tempDir = join(dirname(outputPath), `.${appName}-dmg-temp`);

    // Create temp directory
    await CommandExecutor.execute(`mkdir -p "${tempDir}"`);

    // Copy app to temp directory
    const copyResult = await executeDitto([
        `"${appPath}"`,
        `"${join(tempDir, basename(appPath))}"`,
    ]);

    if (copyResult.exitCode !== 0) {
        await CommandExecutor.execute(`rm -rf "${tempDir}"`);
        return {
            success: false,
            filePath: outputPath,
            message: `Failed to copy app: ${copyResult.stderr}`,
        };
    }

    // Create DMG
    const result = await executeHdiutil([
        'create',
        '-volname', `"${volume}"`,
        '-srcfolder', `"${tempDir}"`,
        '-ov',
        '-format', 'UDZO',
        `"${outputPath}"`,
    ]);

    // Cleanup temp directory
    await CommandExecutor.execute(`rm -rf "${tempDir}"`);

    if (result.exitCode !== 0) {
        return {
            success: false,
            filePath: outputPath,
            message: result.stderr || result.stdout,
        };
    }

    return {
        success: true,
        filePath: outputPath,
        message: 'DMG disk image created successfully',
    };
}
