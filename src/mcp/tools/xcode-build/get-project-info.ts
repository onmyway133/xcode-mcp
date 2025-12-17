import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    projectPath: z.string().describe('Absolute path to .xcodeproj or .xcworkspace file'),
});

export function registerGetProjectInfo(server: McpServer) {
    server.registerTool(
        'xcode_get_project_info',
        {
            description: 'Get project information including targets, schemes, and configurations',
            inputSchema,
        },
        async ({ projectPath }) => {
            try {
                const projectInfo = await XcodeBuild.getProjectInfo(projectPath);

                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(projectInfo, null, 2),
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
