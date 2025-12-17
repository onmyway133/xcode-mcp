import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator'),
    bundleId: z.string().describe('The bundle identifier of the app'),
    containerType: z.enum(['app', 'data', 'groups']).optional().default('data').describe('Type of container to get'),
});

export function registerGetAppContainer(server: McpServer) {
    server.registerTool(
        'simulator_get_app_container',
        {
            description: 'Get the path to an app\'s container on a simulator',
            inputSchema,
        },
        async ({ deviceId, bundleId, containerType }) => {
            try {
                const path = await Simulator.getAppContainer(deviceId, bundleId, containerType);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                containerPath: path,
                                containerType,
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
