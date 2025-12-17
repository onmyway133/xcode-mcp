import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({});

export function registerListDeviceTypes(server: McpServer) {
    server.registerTool(
        'simulator_list_device_types',
        {
            description: 'List all available simulator device types',
            inputSchema,
        },
        async () => {
            try {
                const deviceTypes = await Simulator.listDeviceTypes();

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ deviceTypes }, null, 2),
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
