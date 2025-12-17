import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({});

export function registerListRuntimes(server: McpServer) {
    server.registerTool(
        'simulator_list_runtimes',
        {
            description: 'List all available simulator runtimes',
            inputSchema,
        },
        async () => {
            try {
                const runtimes = await Simulator.listRuntimes();

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ runtimes }, null, 2),
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
