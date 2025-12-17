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

export function registerCheckNotarizationStatus(server: McpServer) {
    server.registerTool(
        'notarize_check_status',
        {
            description: 'Check the status of a notarization submission',
            inputSchema,
        },
        async ({ submissionId, keychainProfile, appleId, teamId, password }) => {
            try {
                const result = await Notary.checkStatus(submissionId, {
                    keychainProfile,
                    appleId,
                    teamId,
                    password,
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
