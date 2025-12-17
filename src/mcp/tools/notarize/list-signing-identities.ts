import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Notary } from '../../../programs/index.js';

const inputSchema = z.object({});

export function registerListSigningIdentities(server: McpServer) {
    server.registerTool(
        'notarize_list_signing_identities',
        {
            description: 'List available code signing identities in the keychain',
            inputSchema,
        },
        async () => {
            try {
                const identities = await Notary.listSigningIdentities();

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ identities }, null, 2),
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
