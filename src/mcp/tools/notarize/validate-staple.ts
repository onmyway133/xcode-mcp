import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    filePath: z.string().describe('Absolute path to the file to validate'),
});

export function registerValidateStaple(server: McpServer) {
    server.registerTool(
        'notarize_validate_staple',
        {
            description: 'Validate that a notarization ticket is properly stapled',
            inputSchema,
        },
        async ({ filePath }) => {
            try {
                const result = await Notary.validateStaple(filePath);

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
