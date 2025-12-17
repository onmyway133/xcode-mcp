import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    filePath: z.string().describe('Absolute path to the file to notarize and staple'),
    keychainProfile: z.string().optional().describe('Keychain profile name for credentials'),
    appleId: z.string().optional().describe('Apple ID email'),
    teamId: z.string().optional().describe('Apple Developer Team ID'),
    password: z.string().optional().describe('App-specific password'),
    timeout: z.number().optional().describe('Timeout in seconds'),
});

export function registerNotarizeAndStaple(server: McpServer) {
    server.registerTool(
        'notarize_and_staple',
        {
            description: 'Submit for notarization, wait for completion, and staple the ticket',
            inputSchema,
        },
        async ({ filePath, keychainProfile, appleId, teamId, password, timeout }) => {
            try {
                const result = await Notary.notarizeAndStaple(filePath, {
                    keychainProfile,
                    appleId,
                    teamId,
                    password,
                    timeout,
                });

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
