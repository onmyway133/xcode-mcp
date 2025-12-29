import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    bundleId: z.string().describe('The bundle identifier of the app (e.g., com.apple.mobilesafari)'),
});

export function registerAppInfo(server: McpServer) {
    server.registerTool(
        'simulator_app_info',
        {
            description: 'Get detailed information about an installed application on a simulator',
            inputSchema,
        },
        async ({ deviceId, bundleId }) => {
            try {
                const appInfo = await Simulator.getAppInfo(deviceId, bundleId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                app: appInfo,
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
