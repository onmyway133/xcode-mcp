import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    submissionId: z.string().describe('The notarization submission ID'),
    keychainProfile: z.string().optional().describe('Keychain profile name for credentials'),
    appleId: z.string().optional().describe('Apple ID email'),
    teamId: z.string().optional().describe('Apple Developer Team ID'),
    password: z.string().optional().describe('App-specific password'),
});

export function registerGetNotarizationLog(server: McpServer) {
    server.registerTool(
        'notarize_get_log',
        {
            description: 'Get the detailed log for a notarization submission',
            inputSchema,
        },
        async ({ submissionId, keychainProfile, appleId, teamId, password }) => {
            try {
                const log = await Notary.getLog(submissionId, {
                    keychainProfile,
                    appleId,
                    teamId,
                    password,
                });

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(log, null, 2),
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
