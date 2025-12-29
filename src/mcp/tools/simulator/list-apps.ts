import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
});

export function registerListApps(server: McpServer) {
    server.registerTool(
        'simulator_list_apps',
        {
            description: 'List all installed applications on a simulator',
            inputSchema,
        },
        async ({ deviceId }) => {
            try {
                const apps = await Simulator.listInstalledApps(deviceId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                count: apps.length,
                                apps,
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
