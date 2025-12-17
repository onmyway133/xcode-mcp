import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    profile: z.string().describe('Name for the keychain profile'),
    appleId: z.string().describe('Apple ID email'),
    teamId: z.string().describe('Apple Developer Team ID'),
});

export function registerStoreCredentials(server: McpServer) {
    server.registerTool(
        'notarize_store_credentials',
        {
            description: 'Store notarization credentials in the keychain (will prompt for password)',
            inputSchema,
        },
        async ({ profile, appleId, teamId }) => {
            try {
                await Notary.storeCredentials(profile, appleId, teamId);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({
                                success: true,
                                message: `Credentials stored in keychain profile "${profile}"`,
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
