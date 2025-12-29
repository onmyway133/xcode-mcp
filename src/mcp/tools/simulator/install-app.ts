import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    appPath: z.string().describe('Absolute path to the .app bundle'),
});

export function registerInstallApp(server: McpServer) {
    server.registerTool(
        'simulator_install_app',
        {
            description: 'Install an app on a simulator',
            inputSchema,
        },
        async ({ deviceId, appPath }) => {
            try {
                const result = await Simulator.installApp(deviceId, appPath);

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
