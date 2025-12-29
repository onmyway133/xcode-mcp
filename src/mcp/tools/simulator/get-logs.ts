import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    predicate: z.string().optional().describe('Filter predicate (e.g., "subsystem == \'com.apple.myapp\'")'),
});

export function registerGetLogs(server: McpServer) {
    server.registerTool(
        'simulator_get_logs',
        {
            description: 'Get system logs from a simulator',
            inputSchema,
        },
        async ({ deviceId, predicate }) => {
            try {
                const logs = await Simulator.getLogs(deviceId, predicate);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                logs,
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
