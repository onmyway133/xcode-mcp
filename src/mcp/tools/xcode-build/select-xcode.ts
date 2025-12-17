import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    path: z
        .string()
        .optional()
        .describe(
            'Path to Xcode.app or Developer directory. Defaults to /Applications/Xcode.app. ' +
            'Examples: /Applications/Xcode.app, /Applications/Xcode-beta.app, ' +
            '/Applications/Xcode.app/Contents/Developer'
        ),
});

export function registerSelectXcode(server: McpServer) {
    server.registerTool(
        'xcode_select',
        {
            description:
                'Select the active Xcode installation for xcodebuild commands. ' +
                'This is required when xcodebuild fails with "active developer directory is a command line tools instance". ' +
                'NOTE: This command requires sudo privileges - the user will need to enter their password in the terminal.',
            inputSchema,
        },
        async ({ path }) => {
            try {
                const result = await XcodeBuild.selectXcode(path);

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
