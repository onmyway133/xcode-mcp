import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    bundleId: z.string().describe('The bundle identifier of the app to uninstall'),
});

export function registerUninstallApp(server: McpServer) {
    server.registerTool(
        'simulator_uninstall_app',
        {
            description: 'Uninstall an app from a simulator',
            inputSchema,
        },
        async ({ deviceId, bundleId }) => {
            try {
                await Simulator.uninstallApp(deviceId, bundleId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `App ${bundleId} uninstalled from simulator ${deviceId}`,
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
