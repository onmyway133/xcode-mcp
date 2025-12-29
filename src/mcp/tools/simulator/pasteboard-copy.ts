import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    text: z.string().describe('Text to copy to the simulator pasteboard'),
});

export function registerPasteboardCopy(server: McpServer) {
    server.registerTool(
        'simulator_pasteboard_copy',
        {
            description: 'Copy text to the pasteboard (clipboard) of a simulator',
            inputSchema,
        },
        async ({ deviceId, text }) => {
            try {
                const result = await Simulator.copyToPasteboard(deviceId, text);

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
