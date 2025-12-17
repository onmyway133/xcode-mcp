import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    path: z.string().describe('Absolute path to the signed file or bundle'),
});

export function registerVerifyCode(server: McpServer) {
    server.registerTool(
        'notarize_verify_code',
        {
            description: 'Verify the code signature of a file or bundle',
            inputSchema,
        },
        async ({ path }) => {
            try {
                const result = await Notary.verifyCode(path);

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
