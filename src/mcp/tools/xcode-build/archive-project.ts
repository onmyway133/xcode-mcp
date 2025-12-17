import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    projectPath: z.string().describe('Absolute path to .xcodeproj or .xcworkspace file'),
    scheme: z.string().describe('The scheme to archive'),
    archivePath: z.string().describe('Path where the .xcarchive will be saved'),
    configuration: z.string().optional().describe('Build configuration (defaults to Release)'),
    destination: z.string().optional().describe('Archive destination'),
});

export function registerArchiveProject(server: McpServer) {
    server.registerTool(
        'xcode_archive_project',
        {
            description: 'Archive an Xcode project for distribution',
            inputSchema,
        },
        async ({ projectPath, scheme, archivePath, configuration, destination }) => {
            try {
                const result = await XcodeBuild.archive(projectPath, {
                    scheme,
                    archivePath,
                    configuration: configuration || 'Release',
                    destination,
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
