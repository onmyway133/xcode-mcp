import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    projectPath: z.string().describe('Absolute path to .xcodeproj or .xcworkspace file'),
    scheme: z.string().optional().describe('The scheme to build'),
    target: z.string().optional().describe('The target to build'),
    configuration: z.string().optional().describe('Build configuration (e.g., Debug, Release)'),
    sdk: z.string().optional().describe('SDK to use (e.g., iphoneos, iphonesimulator)'),
    destination: z.string().optional().describe('Build destination (e.g., "platform=iOS Simulator,name=iPhone 15")'),
    derivedDataPath: z.string().optional().describe('Custom derived data path'),
    clean: z.boolean().optional().default(false).describe('Clean before building'),
    additionalArgs: z.array(z.string()).optional().describe('Additional xcodebuild arguments'),
});

export function registerBuildProject(server: McpServer) {
    server.registerTool(
        'xcode_build_project',
        {
            description: 'Build an Xcode project or workspace',
            inputSchema,
        },
        async ({ projectPath, scheme, target, configuration, sdk, destination, derivedDataPath, clean, additionalArgs }) => {
            try {
                const result = await XcodeBuild.build(projectPath, {
                    scheme,
                    target,
                    configuration,
                    sdk,
                    destination,
                    derivedDataPath,
                    clean,
                    additionalArgs,
                });

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                const enhancedError = XcodeBuild.enhanceXcodebuildError(error.message);
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ error: enhancedError }, null, 2),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );
}
