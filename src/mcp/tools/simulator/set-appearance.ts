import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    mode: z.enum(['light', 'dark']).describe('Appearance mode to set'),
});

export function registerSetAppearance(server: McpServer) {
    server.registerTool(
        'simulator_set_appearance',
        {
            description: 'Set the appearance mode (light/dark) of a simulator',
            inputSchema,
        },
        async ({ deviceId, mode }) => {
            try {
                const result = await Simulator.setAppearance(deviceId, mode);

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
