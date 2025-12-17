import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    name: z.string().describe('Name for the new simulator'),
    deviceType: z.string().describe('Device type identifier (e.g., "com.apple.CoreSimulator.SimDeviceType.iPhone-15")'),
    runtime: z.string().describe('Runtime identifier (e.g., "com.apple.CoreSimulator.SimRuntime.iOS-17-0")'),
});

export function registerCreateSimulator(server: McpServer) {
    server.registerTool(
        'simulator_create',
        {
            description: 'Create a new simulator device',
            inputSchema,
        },
        async ({ name, deviceType, runtime }) => {
            try {
                const udid = await Simulator.create(name, deviceType, runtime);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                udid,
                                message: `Simulator "${name}" created with UDID: ${udid}`,
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
