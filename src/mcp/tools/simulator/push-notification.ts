import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator'),
    bundleId: z.string().describe('The bundle identifier of the app to receive the notification'),
    payload: z.record(z.string(), z.any()).describe('The notification payload (APNS format)'),
});

export function registerPushNotification(server: McpServer) {
    server.registerTool(
        'simulator_push_notification',
        {
            description: 'Send a push notification to an app on a simulator',
            inputSchema,
        },
        async ({ deviceId, bundleId, payload }) => {
            try {
                await Simulator.pushNotification(deviceId, bundleId, payload);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `Push notification sent to ${bundleId} on simulator ${deviceId}`,
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
