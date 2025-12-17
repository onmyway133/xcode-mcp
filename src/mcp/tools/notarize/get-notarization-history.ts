import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    keychainProfile: z.string().optional().describe('Keychain profile name for credentials'),
    appleId: z.string().optional().describe('Apple ID email'),
    teamId: z.string().optional().describe('Apple Developer Team ID'),
    password: z.string().optional().describe('App-specific password'),
    limit: z.number().optional().describe('Maximum number of entries to return'),
});

export function registerGetNotarizationHistory(server: McpServer) {
    server.registerTool(
        'notarize_get_history',
        {
            description: 'Get the history of notarization submissions',
            inputSchema,
        },
        async ({ keychainProfile, appleId, teamId, password, limit }) => {
            try {
                const history = await Notary.getHistory({
                    keychainProfile,
                    appleId,
                    teamId,
                    password,
                    limit,
                });

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(history, null, 2),
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
