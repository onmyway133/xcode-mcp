import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator'),
    mediaPath: z.string().describe('Absolute path to the media file (photo or video)'),
});

export function registerAddMedia(server: McpServer) {
    server.registerTool(
        'simulator_add_media',
        {
            description: 'Add a photo or video to a simulator\'s photo library',
            inputSchema,
        },
        async ({ deviceId, mediaPath }) => {
            try {
                await Simulator.addMedia(deviceId, mediaPath);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `Media added to simulator ${deviceId}`,
                            }, null, 2),
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
