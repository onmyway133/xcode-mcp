import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({
    path: z.string().describe('Absolute path to the file or bundle to sign'),
    identity: z.string().describe('Signing identity (e.g., "Developer ID Application: Name (TEAM_ID)")'),
    entitlements: z.string().optional().describe('Path to entitlements plist file'),
    deep: z.boolean().optional().default(false).describe('Sign nested code'),
    force: z.boolean().optional().default(false).describe('Replace existing signature'),
    timestamp: z.boolean().optional().default(true).describe('Include secure timestamp'),
    hardened: z.boolean().optional().default(true).describe('Enable hardened runtime'),
});

export function registerSignCode(server: McpServer) {
    server.registerTool(
        'notarize_sign_code',
        {
            description: 'Sign code with a Developer ID certificate',
            inputSchema,
        },
        async ({ path, identity, entitlements, deep, force, timestamp, hardened }) => {
            try {
                const result = await Notary.signCode(path, identity, {
                    entitlements,
                    deep,
                    force,
                    timestamp,
                    hardened,
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
