import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator to delete'),
});

export function registerDeleteSimulator(server: McpServer) {
    server.registerTool(
        'simulator_delete',
        {
            description: 'Delete a simulator device',
            inputSchema,
        },
        async ({ deviceId }) => {
            try {
                await Simulator.deleteDevice(deviceId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `Simulator ${deviceId} deleted successfully`,
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
