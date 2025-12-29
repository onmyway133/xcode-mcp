import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    direction: z.enum(['host-to-device', 'device-to-host']).describe('Direction to sync the pasteboard'),
});

export function registerPasteboardSync(server: McpServer) {
    server.registerTool(
        'simulator_pasteboard_sync',
        {
            description: 'Sync the pasteboard between the host machine and a simulator',
            inputSchema,
        },
        async ({ deviceId, direction }) => {
            try {
                const result = await Simulator.syncPasteboard(deviceId, direction);

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
