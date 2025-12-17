import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    projectPath: z.string().describe('Absolute path to .xcodeproj or .xcworkspace file'),
    scheme: z.string().optional().describe('The scheme to get settings for'),
    target: z.string().optional().describe('The target to get settings for'),
    configuration: z.string().optional().describe('Build configuration'),
});

export function registerGetBuildSettings(server: McpServer) {
    server.registerTool(
        'xcode_get_build_settings',
        {
            description: 'Get build settings for an Xcode project',
            inputSchema,
        },
        async ({ projectPath, scheme, target, configuration }) => {
            try {
                const settings = await XcodeBuild.getBuildSettings(projectPath, {
                    scheme,
                    target,
                    configuration,
                });

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(settings, null, 2),
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
