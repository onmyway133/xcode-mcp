import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({});

export function registerListXcodeInstallations(server: McpServer) {
    server.registerTool(
        'xcode_list_installations',
        {
            description:
                'List all Xcode installations found on the system. ' +
                'Useful for finding available Xcode versions before using xcode_select.',
            inputSchema,
        },
        async () => {
            try {
                const result = await XcodeBuild.listXcodeInstallations();

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
