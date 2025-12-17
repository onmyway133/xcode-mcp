import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    projectPath: z.string().describe('Absolute path to .xcodeproj or .xcworkspace file'),
    scheme: z.string().optional().describe('The scheme to clean'),
    target: z.string().optional().describe('The target to clean'),
    configuration: z.string().optional().describe('Build configuration'),
});

export function registerCleanProject(server: McpServer) {
    server.registerTool(
        'xcode_clean_project',
        {
            description: 'Clean build artifacts for an Xcode project',
            inputSchema,
        },
        async ({ projectPath, scheme, target, configuration }) => {
            try {
                const result = await XcodeBuild.clean(projectPath, {
                    scheme,
                    target,
                    configuration,
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
