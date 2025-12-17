import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({});

export function registerGetDeveloperPath(server: McpServer) {
    server.registerTool(
        'xcode_get_developer_path',
        {
            description:
                'Get the currently active Xcode developer directory path. ' +
                'Use this to check which Xcode installation is currently selected. ' +
                'If it shows /Library/Developer/CommandLineTools, you need to run xcode_select to switch to Xcode.app.',
            inputSchema,
        },
        async () => {
            try {
                const result = await XcodeBuild.getDeveloperPath();

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ error: error.message }, null, 2),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );
}
