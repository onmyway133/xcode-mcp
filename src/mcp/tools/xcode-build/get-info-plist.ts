import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    projectPath: z.string().describe('Absolute path to .xcodeproj or .xcworkspace file'),
    plistPath: z.string().optional().describe('Specific path to Info.plist file (auto-detected if not provided)'),
});

export function registerGetInfoPlist(server: McpServer) {
    server.registerTool(
        'xcode_get_info_plist',
        {
            description: 'Get Info.plist contents for an Xcode project',
            inputSchema,
        },
        async ({ projectPath, plistPath }) => {
            try {
                const plistContent = await XcodeBuild.getInfoPlist(projectPath, plistPath);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(plistContent, null, 2),
                        },
                    ],
                };
            } catch (error: any) {
                const enhancedError = XcodeBuild.enhanceXcodebuildError(error.message);
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ error: enhancedError }, null, 2),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );
}
