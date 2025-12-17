import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    state: z.enum(['Booted', 'Shutdown', 'all']).optional().default('all').describe('Filter by simulator state'),
    osType: z.string().optional().describe('Filter by OS type (e.g., iOS, watchOS, tvOS)'),
});

export function registerListSimulators(server: McpServer) {
    server.registerTool(
        'simulator_list',
        {
            description: 'List all available iOS/watchOS/tvOS simulators',
            inputSchema,
        },
        async ({ state, osType }) => {
            try {
                let devices = await Simulator.listDevices();

                if (state && state !== 'all') {
                    devices = devices.filter((d) => d.state === state);
                }

                if (osType) {
                    devices = devices.filter((d) =>
                        d.deviceType.toLowerCase().includes(osType.toLowerCase())
                    );
                }

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ simulators: devices, count: devices.length }, null, 2),
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
