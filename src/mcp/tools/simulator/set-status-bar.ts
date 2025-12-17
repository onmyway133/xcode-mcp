import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().describe('The UDID of the simulator'),
    time: z.string().optional().describe('Time to display (e.g., "9:41")'),
    dataNetwork: z.string().optional().describe('Data network type (e.g., "wifi", "3g", "4g", "lte", "5g")'),
    wifiMode: z.string().optional().describe('WiFi mode (e.g., "active", "searching", "failed")'),
    wifiBars: z.number().optional().describe('Number of WiFi bars (0-3)'),
    cellularMode: z.string().optional().describe('Cellular mode (e.g., "active", "searching", "failed")'),
    cellularBars: z.number().optional().describe('Number of cellular bars (0-4)'),
    batteryState: z.string().optional().describe('Battery state (e.g., "charging", "charged", "discharging")'),
    batteryLevel: z.number().optional().describe('Battery level (0-100)'),
});

export function registerSetStatusBar(server: McpServer) {
    server.registerTool(
        'simulator_set_status_bar',
        {
            description: 'Override the status bar appearance on a simulator (useful for screenshots)',
            inputSchema,
        },
        async ({ deviceId, time, dataNetwork, wifiMode, wifiBars, cellularMode, cellularBars, batteryState, batteryLevel }) => {
            try {
                await Simulator.setStatusBar(deviceId, {
                    time,
                    dataNetwork,
                    wifiMode,
                    wifiBars,
                    cellularMode,
                    cellularBars,
                    batteryState,
                    batteryLevel,
                });

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `Status bar updated on simulator ${deviceId}`,
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
