import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    bundleId: z.string().describe('The bundle identifier of the app to launch'),
    waitForDebugger: z.boolean().optional().default(false).describe('Wait for debugger to attach'),
});

export function registerLaunchApp(server: McpServer) {
    server.registerTool(
        'simulator_launch_app',
        {
            description: 'Launch an app on a simulator',
            inputSchema,
        },
        async ({ deviceId, bundleId, waitForDebugger }) => {
            try {
                await Simulator.launchApp(deviceId, bundleId, waitForDebugger);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `App ${bundleId} launched on simulator ${deviceId}`,
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
