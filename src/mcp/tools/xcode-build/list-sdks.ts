import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({});

export function registerListSDKs(server: McpServer) {
    server.registerTool(
        'xcode_list_sdks',
        {
            description: 'List all available SDKs in Xcode',
            inputSchema,
        },
        async () => {
            try {
                const sdks = await XcodeBuild.listSDKs();

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ sdks }, null, 2),
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
