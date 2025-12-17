import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator'),
    action: z.enum(['grant', 'revoke', 'reset']).describe('The privacy action to perform'),
    service: z.string().describe('The privacy service (e.g., "all", "calendar", "camera", "contacts", "location", "microphone", "photos")'),
    bundleId: z.string().optional().describe('The bundle identifier of the app (required for grant/revoke)'),
});

export function registerPrivacy(server: McpServer) {
    server.registerTool(
        'simulator_privacy',
        {
            description: 'Manage privacy permissions for apps on a simulator',
            inputSchema,
        },
        async ({ deviceId, action, service, bundleId }) => {
            try {
                await Simulator.privacy(deviceId, action, service, bundleId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `Privacy ${action} for ${service} on simulator ${deviceId}`,
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
