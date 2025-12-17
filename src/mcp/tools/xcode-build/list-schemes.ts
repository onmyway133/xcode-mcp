import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    projectPath: z.string().describe('Absolute path to .xcodeproj or .xcworkspace file'),
});

export function registerListSchemes(server: McpServer) {
    server.registerTool(
        'xcode_list_schemes',
        {
            description: 'List all schemes in an Xcode project or workspace',
            inputSchema,
        },
        async ({ projectPath }) => {
            try {
                const schemes = await XcodeBuild.listSchemes(projectPath);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ schemes }, null, 2),
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
