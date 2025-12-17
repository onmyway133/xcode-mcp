import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({});

export function registerGetXcodeVersion(server: McpServer) {
    server.registerTool(
        'xcode_get_version',
        {
            description: 'Get the installed Xcode version and path',
            inputSchema,
        },
        async () => {
            try {
                const version = await XcodeBuild.getXcodeVersion();

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(version, null, 2),
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
