import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    enabled: z.boolean().describe('Whether to enable or disable increased contrast'),
});

export function registerSetIncreaseContrast(server: McpServer) {
    server.registerTool(
        'simulator_set_increase_contrast',
        {
            description: 'Enable or disable the Increase Contrast accessibility setting on a simulator',
            inputSchema,
        },
        async ({ deviceId, enabled }) => {
            try {
                const result = await Simulator.setIncreaseContrast(deviceId, enabled);

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
