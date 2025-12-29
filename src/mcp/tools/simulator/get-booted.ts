import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({});

export function registerGetBooted(server: McpServer) {
    server.registerTool(
        'simulator_get_booted',
        {
            description: 'Get the UDID of the currently booted simulator. Returns the first booted device if multiple are running.',
            inputSchema,
        },
        async () => {
            try {
                const deviceId = await Simulator.getBootedSimulator();

                if (!deviceId) {
                    return {
                        content: [
                            {
                                type: 'text' as const,
                                text: JSON.stringify({
                                    success: false,
                                    message: 'No simulator is currently booted',
                                }, null, 2),
                            },
                        ],
                    };
                }

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                deviceId,
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
