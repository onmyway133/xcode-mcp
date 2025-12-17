import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    appPath: z.string().describe('Absolute path to the .app bundle'),
    outputPath: z.string().describe('Absolute path for the output .dmg file'),
    volumeName: z.string().optional().describe('Volume name for the DMG'),
});

export function registerCreateDmg(server: McpServer) {
    server.registerTool(
        'notarize_create_dmg',
        {
            description: 'Create a DMG disk image from an app bundle',
            inputSchema,
        },
        async ({ appPath, outputPath, volumeName }) => {
            try {
                const result = await Notary.createDmg(appPath, outputPath, volumeName);

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
