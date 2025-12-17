import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator to boot'),
    openSimulatorApp: z.boolean().optional().default(true).describe('Open Simulator.app after booting'),
});

export function registerBootSimulator(server: McpServer) {
    server.registerTool(
        'simulator_boot',
        {
            description: 'Boot a simulator device',
            inputSchema,
        },
        async ({ deviceId, openSimulatorApp }) => {
            try {
                await Simulator.boot(deviceId);

                if (openSimulatorApp) {
                    await Simulator.openSimulatorApp();
                }

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `Simulator ${deviceId} booted successfully`,
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
