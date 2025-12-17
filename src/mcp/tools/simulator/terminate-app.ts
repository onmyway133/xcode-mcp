import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator'),
    bundleId: z.string().describe('The bundle identifier of the app to terminate'),
});

export function registerTerminateApp(server: McpServer) {
    server.registerTool(
        'simulator_terminate_app',
        {
            description: 'Terminate a running app on a simulator',
            inputSchema,
        },
        async ({ deviceId, bundleId }) => {
            try {
                await Simulator.terminateApp(deviceId, bundleId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `App ${bundleId} terminated on simulator ${deviceId}`,
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
