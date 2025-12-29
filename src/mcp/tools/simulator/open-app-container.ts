import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    bundleId: z.string().describe('The bundle identifier of the app'),
    containerType: z.enum(['app', 'data', 'groups']).optional().default('data').describe('Type of container to open'),
});

export function registerOpenAppContainer(server: McpServer) {
    server.registerTool(
        'simulator_open_app_container',
        {
            description: 'Open an app\'s container folder in Finder',
            inputSchema,
        },
        async ({ deviceId, bundleId, containerType }) => {
            try {
                const result = await Simulator.openAppContainer(deviceId, bundleId, containerType);

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
