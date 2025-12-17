import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator to erase'),
});

export function registerEraseSimulator(server: McpServer) {
    server.registerTool(
        'simulator_erase',
        {
            description: 'Erase all content and settings from a simulator',
            inputSchema,
        },
        async ({ deviceId }) => {
            try {
                await Simulator.erase(deviceId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `Simulator ${deviceId} erased successfully`,
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
