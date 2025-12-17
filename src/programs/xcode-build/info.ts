import { CommandExecutor } from '../command-executor.js';
import { getProjectArgument, executeXcodebuild } from './core.js';
import type { BuildSettings, InfoPlistContent, XcodeProject } from '../../types.js';
import { existsSync } from 'fs';
import { dirname, join } from 'path';

function parseSchemesList(output: string): string[] {
    const schemesMatch = output.match(/Schemes:\s*([\s\S]*?)(?=\n\s*\n|$)/);
    if (!schemesMatch) return [];

    return schemesMatch[1]
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

function parseTargetsList(output: string): string[] {
    const targetsMatch = output.match(/Targets:\s*([\s\S]*?)(?=\n\s*\n|$)/);
    if (!targetsMatch) return [];

    return targetsMatch[1]
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

function parseConfigurationsList(output: string): string[] {
    const configMatch = output.match(/Build Configurations:\s*([\s\S]*?)(?=\n\s*\n|$)/);
    if (!configMatch) return [];

    return configMatch[1]
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

function parseBuildSettingsText(output: string): BuildSettings[] {
    const settings: Record<string, string> = {};
    const lines = output.split('\n');

    for (const line of lines) {
        const match = line.match(/^\s+(\w+)\s+=\s+(.*)$/);
        if (match) {
            settings[match[1]] = match[2];
        }
    }

    return [{
        target: '',
        configuration: '',
        sdk: '',
        settings,
    }];
}

function parseSDKsList(output: string): string[] {
    const sdks: string[] = [];
    const lines = output.split('\n');

    for (const line of lines) {
        const match = line.match(/-sdk\s+(\S+)/);
        if (match) {
            sdks.push(match[1]);
        }
    }

    return sdks;
}

async function findInfoPlist(projectPath: string): Promise<string> {
    const projectDir = dirname(projectPath);
    const possiblePaths = [
        join(projectDir, 'Info.plist'),
        join(projectDir, 'Sources', 'Info.plist'),
        join(projectDir, 'Resources', 'Info.plist'),
    ];

    for (const path of possiblePaths) {
        if (existsSync(path)) {
            return path;
        }
    }

    const result = await CommandExecutor.execute(
        `find "${projectDir}" -name "Info.plist" -type f | head -1`
    );

    if (result.stdout) {
        return result.stdout.trim();
    }

    throw new Error('Info.plist not found in project');
}

export async function listSchemes(projectPath: string): Promise<string[]> {
    const projectArg = getProjectArgument(projectPath);
    const result = await CommandExecutor.execute(`xcodebuild -list ${projectArg} -json`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list schemes: ${result.stderr}`);
    }

    try {
        const data = JSON.parse(result.stdout);
        return data.project?.schemes || data.workspace?.schemes || [];
    } catch {
        return parseSchemesList(result.stdout);
    }
}

export async function listTargets(projectPath: string): Promise<string[]> {
    const projectArg = getProjectArgument(projectPath);
    const result = await CommandExecutor.execute(`xcodebuild -list ${projectArg} -json`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list targets: ${result.stderr}`);
    }

    try {
        const data = JSON.parse(result.stdout);
        return data.project?.targets || [];
    } catch {
        return parseTargetsList(result.stdout);
    }
}

export async function listConfigurations(projectPath: string): Promise<string[]> {
    const projectArg = getProjectArgument(projectPath);
    const result = await CommandExecutor.execute(`xcodebuild -list ${projectArg} -json`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list configurations: ${result.stderr}`);
    }

    try {
        const data = JSON.parse(result.stdout);
        return data.project?.configurations || [];
    } catch {
        return parseConfigurationsList(result.stdout);
    }
}

export async function getBuildSettings(
    projectPath: string,
    options: {
        scheme?: string;
        target?: string;
        configuration?: string;
    } = {}
): Promise<BuildSettings[]> {
    const args: string[] = [getProjectArgument(projectPath), '-showBuildSettings'];

    if (options.scheme) {
        args.push(`-scheme "${options.scheme}"`);
    }
    if (options.target) {
        args.push(`-target "${options.target}"`);
    }
    if (options.configuration) {
        args.push(`-configuration "${options.configuration}"`);
    }

    args.push('-json');

    const result = await executeXcodebuild(args);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to get build settings: ${result.stderr}`);
    }

    try {
        const data = JSON.parse(result.stdout);
        return data.map((item: any) => ({
            target: item.target || '',
            configuration: item.buildConfiguration || '',
            sdk: item.buildSDK || '',
            settings: item.buildSettings || {},
        }));
    } catch {
        return parseBuildSettingsText(result.stdout);
    }
}

export async function getInfoPlist(projectPath: string, plistPath?: string): Promise<InfoPlistContent> {
    let resolvedPath = plistPath;

    if (!resolvedPath) {
        resolvedPath = await findInfoPlist(projectPath);
    }

    if (!existsSync(resolvedPath)) {
        throw new Error(`Info.plist not found at: ${resolvedPath}`);
    }

    const result = await CommandExecutor.execute(`plutil -convert json -o - "${resolvedPath}"`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to read Info.plist: ${result.stderr}`);
    }

    return {
        filePath: resolvedPath,
        content: JSON.parse(result.stdout),
    };
}

export async function getProjectInfo(projectPath: string): Promise<XcodeProject> {
    const schemes = await listSchemes(projectPath);
    const targets = await listTargets(projectPath);
    const configurations = await listConfigurations(projectPath);

    return {
        projectPath,
        targets,
        schemes,
        configurations,
    };
}

export async function listSDKs(): Promise<string[]> {
    const result = await CommandExecutor.execute('xcodebuild -showsdks -json');

    if (result.exitCode !== 0) {
        throw new Error(`Failed to list SDKs: ${result.stderr}`);
    }

    try {
        const data = JSON.parse(result.stdout);
        return data.map((sdk: any) => sdk.canonicalName || sdk.sdk);
    } catch {
        return parseSDKsList(result.stdout);
    }
}

export async function getXcodeVersion(): Promise<{
    version: string;
    build: string;
    path: string;
    isCommandLineToolsActive?: boolean;
}> {
    const pathResult = await CommandExecutor.execute('xcode-select -p');
    const activePath = pathResult.stdout.trim();
    const isCommandLineToolsActive = activePath === '/Library/Developer/CommandLineTools';

    // If Command Line Tools is active, try to get version from Xcode.app directly
    if (isCommandLineToolsActive) {
        const xcodeApp = '/Applications/Xcode.app';
        const existsResult = await CommandExecutor.execute(`test -d "${xcodeApp}" && echo "exists"`);

        if (existsResult.stdout.includes('exists')) {
            const versionResult = await CommandExecutor.execute(
                `defaults read "${xcodeApp}/Contents/Info" CFBundleShortVersionString 2>/dev/null || echo "Unknown"`
            );
            const buildResult = await CommandExecutor.execute(
                `defaults read "${xcodeApp}/Contents/version" ProductBuildVersion 2>/dev/null || echo "Unknown"`
            );

            return {
                version: versionResult.stdout.trim(),
                build: buildResult.stdout.trim(),
                path: xcodeApp,
                isCommandLineToolsActive: true,
            };
        }

        // No Xcode.app found, return Command Line Tools info
        return {
            version: 'N/A (Command Line Tools)',
            build: 'N/A',
            path: activePath,
            isCommandLineToolsActive: true,
        };
    }

    // Normal case: Xcode.app is active
    const versionResult = await CommandExecutor.execute('xcodebuild -version');
    const versionMatch = versionResult.stdout.match(/Xcode\s+(\S+)/);
    const buildMatch = versionResult.stdout.match(/Build version\s+(\S+)/);

    return {
        version: versionMatch?.[1] || 'Unknown',
        build: buildMatch?.[1] || 'Unknown',
        path: activePath,
    };
}

export async function getDeveloperPath(): Promise<{
    path: string;
    isCommandLineTools: boolean;
    suggestion?: string;
}> {
    const result = await CommandExecutor.execute('xcode-select -p');

    if (result.exitCode !== 0) {
        throw new Error(`Failed to get developer path: ${result.stderr}`);
    }

    const path = result.stdout.trim();
    const isCommandLineTools = path === '/Library/Developer/CommandLineTools';

    return {
        path,
        isCommandLineTools,
        suggestion: isCommandLineTools
            ? 'The active developer directory is Command Line Tools. Run xcode_select to switch to Xcode.app for full xcodebuild functionality.'
            : undefined,
    };
}

export async function selectXcode(xcodePathOrApp?: string): Promise<{
    success: boolean;
    previousPath: string;
    newPath: string;
    message: string;
}> {
    const previousResult = await CommandExecutor.execute('xcode-select -p');
    const previousPath = previousResult.stdout.trim();

    let developerPath: string;

    if (!xcodePathOrApp) {
        developerPath = '/Applications/Xcode.app/Contents/Developer';
    } else if (xcodePathOrApp.endsWith('.app')) {
        developerPath = `${xcodePathOrApp}/Contents/Developer`;
    } else if (xcodePathOrApp.endsWith('/Contents/Developer')) {
        developerPath = xcodePathOrApp;
    } else {
        developerPath = xcodePathOrApp;
    }

    const result = await CommandExecutor.execute(`sudo xcode-select -s "${developerPath}"`);

    if (result.exitCode !== 0) {
        if (result.stderr.includes('sudo') || result.stderr.includes('password')) {
            throw new Error(
                'This command requires sudo privileges. Please run the following command manually in your terminal:\n\n' +
                `sudo xcode-select -s "${developerPath}"`
            );
        }
        throw new Error(`Failed to select Xcode: ${result.stderr}`);
    }

    const newResult = await CommandExecutor.execute('xcode-select -p');
    const newPath = newResult.stdout.trim();

    return {
        success: true,
        previousPath,
        newPath,
        message: `Successfully switched from ${previousPath} to ${newPath}`,
    };
}

export async function listXcodeInstallations(): Promise<{
    installations: Array<{
        path: string;
        version: string;
        build: string;
        isActive: boolean;
    }>;
    activeInstallation: string;
}> {
    const currentPathResult = await CommandExecutor.execute('xcode-select -p');
    const activePath = currentPathResult.stdout.trim();

    const findResult = await CommandExecutor.execute(
        'mdfind "kMDItemCFBundleIdentifier == \'com.apple.dt.Xcode\'"'
    );

    const installations: Array<{
        path: string;
        version: string;
        build: string;
        isActive: boolean;
    }> = [];

    if (findResult.stdout) {
        const paths = findResult.stdout.trim().split('\n').filter(Boolean);

        for (const appPath of paths) {
            const versionResult = await CommandExecutor.execute(
                `defaults read "${appPath}/Contents/Info" CFBundleShortVersionString 2>/dev/null || echo "Unknown"`
            );
            const buildResult = await CommandExecutor.execute(
                `defaults read "${appPath}/Contents/version" ProductBuildVersion 2>/dev/null || echo "Unknown"`
            );

            const developerPath = `${appPath}/Contents/Developer`;

            installations.push({
                path: appPath,
                version: versionResult.stdout.trim(),
                build: buildResult.stdout.trim(),
                isActive: activePath === developerPath,
            });
        }
    }

    if (installations.length === 0) {
        const defaultPath = '/Applications/Xcode.app';
        const existsResult = await CommandExecutor.execute(`test -d "${defaultPath}" && echo "exists"`);

        if (existsResult.stdout.includes('exists')) {
            installations.push({
                path: defaultPath,
                version: 'Unknown',
                build: 'Unknown',
                isActive: activePath === `${defaultPath}/Contents/Developer`,
            });
        }
    }

    return {
        installations,
        activeInstallation: activePath,
    };
}
