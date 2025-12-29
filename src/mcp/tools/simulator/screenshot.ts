import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    outputPath: z.string().describe('Absolute path where the screenshot will be saved (e.g., /path/to/screenshot.png)'),
});

export function registerScreenshot(server: McpServer) {
    server.registerTool(
        'simulator_screenshot',
        {
            description: 'Capture a screenshot from a simulator',
            inputSchema,
        },
        async ({ deviceId, outputPath }) => {
            try {
                const result = await Simulator.screenshot(deviceId, outputPath);

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
