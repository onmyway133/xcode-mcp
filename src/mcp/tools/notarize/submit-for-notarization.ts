import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    filePath: z.string().describe('Absolute path to the file to notarize (.dmg, .pkg, .zip, or .app)'),
    keychainProfile: z.string().optional().describe('Keychain profile name for credentials'),
    appleId: z.string().optional().describe('Apple ID email (required if no keychain profile)'),
    teamId: z.string().optional().describe('Apple Developer Team ID (required if no keychain profile)'),
    password: z.string().optional().describe('App-specific password (required if no keychain profile)'),
    wait: z.boolean().optional().default(false).describe('Wait for notarization to complete'),
    timeout: z.number().optional().describe('Timeout in seconds when waiting'),
});

export function registerSubmitForNotarization(server: McpServer) {
    server.registerTool(
        'notarize_submit',
        {
            description: 'Submit an app or package for Apple notarization',
            inputSchema,
        },
        async ({ filePath, keychainProfile, appleId, teamId, password, wait, timeout }) => {
            try {
                const result = await Notary.submit(filePath, {
                    keychainProfile,
                    appleId,
                    teamId,
                    password,
                    wait,
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
