import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    filePath: z.string().describe('Absolute path to the file to staple'),
});

export function registerStaple(server: McpServer) {
    server.registerTool(
        'notarize_staple',
        {
            description: 'Staple the notarization ticket to a file',
            inputSchema,
        },
        async ({ filePath }) => {
            try {
                const result = await Notary.staple(filePath);

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
