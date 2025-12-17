import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator'),
    url: z.string().describe('The URL to open (supports http, https, custom schemes)'),
});

export function registerOpenUrl(server: McpServer) {
    server.registerTool(
        'simulator_open_url',
        {
            description: 'Open a URL on a simulator (web links or deep links)',
            inputSchema,
        },
        async ({ deviceId, url }) => {
            try {
                await Simulator.openUrl(deviceId, url);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `URL "${url}" opened on simulator ${deviceId}`,
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
