import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    appPath: z.string().describe('Absolute path to the .app bundle'),
    outputPath: z.string().describe('Absolute path for the output .zip file'),
});

export function registerCreateZip(server: McpServer) {
    server.registerTool(
        'notarize_create_zip',
        {
            description: 'Create a ZIP archive from an app bundle for notarization',
            inputSchema,
        },
        async ({ appPath, outputPath }) => {
            try {
                const result = await Notary.createZip(appPath, outputPath);

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
