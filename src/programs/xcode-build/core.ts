import { CommandExecutor } from '../command-executor.js';

const COMMAND_LINE_TOOLS_ERROR = "active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance";

export function isCommandLineToolsError(errorMessage: string): boolean {
    return errorMessage.includes(COMMAND_LINE_TOOLS_ERROR) ||
        errorMessage.includes('requires Xcode, but active developer directory') ||
        errorMessage.includes('is a command line tools instance');
}

export function enhanceXcodebuildError(errorMessage: string): string {
    if (isCommandLineToolsError(errorMessage)) {
        return (
            `${errorMessage}\n\n` +
            '⚠️  SOLUTION: The active developer directory is set to Command Line Tools instead of Xcode.\n\n' +
            'To fix this, either:\n' +
            '1. Use the xcode_select tool to switch to Xcode.app\n' +
            '2. Or run this command in your terminal:\n' +
            '   sudo xcode-select -s /Applications/Xcode.app/Contents/Developer\n\n' +
            'You can use xcode_get_developer_path to check the current setting, or\n' +
            'xcode_list_installations to see available Xcode installations.'
        );
    }
    return errorMessage;
}

export function getProjectArgument(projectPath: string): string {
    if (projectPath.endsWith('.xcworkspace')) {
        return `-workspace "${projectPath}"`;
    }
    return `-project "${projectPath}"`;
}

export function buildXcodebuildArgs(
    projectPath: string,
    action: string,
    options: {
        scheme?: string;
        target?: string;
        configuration?: string;
        sdk?: string;
        destination?: string;
        derivedDataPath?: string;
        additionalArgs?: string[];
    }
): string[] {
    const args: string[] = [getProjectArgument(projectPath)];

    if (options.scheme) {
        args.push(`-scheme "${options.scheme}"`);
    }
    if (options.target) {
        args.push(`-target "${options.target}"`);
    }
    if (options.configuration) {
        args.push(`-configuration "${options.configuration}"`);
    }
    if (options.sdk) {
        args.push(`-sdk "${options.sdk}"`);
    }
    if (options.destination) {
        args.push(`-destination "${options.destination}"`);
    }
    if (options.derivedDataPath) {
        args.push(`-derivedDataPath "${options.derivedDataPath}"`);
    }

    args.push(action);

    if (options.additionalArgs) {
        args.push(...options.additionalArgs);
    }

    return args;
}

export function parseErrors(output: string): string[] {
    const errorRegex = /error:\s*(.+)/gi;
    const errors: string[] = [];
    let match;

    while ((match = errorRegex.exec(output)) !== null) {
        errors.push(match[1].trim());
    }

    return [...new Set(errors)];
}

export function parseWarnings(output: string): string[] {
    const warningRegex = /warning:\s*(.+)/gi;
    const warnings: string[] = [];
    let match;

    while ((match = warningRegex.exec(output)) !== null) {
        warnings.push(match[1].trim());
    }

    return [...new Set(warnings)];
}

export async function executeXcodebuild(args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return CommandExecutor.execute(`xcodebuild ${args.join(' ')}`);
}
