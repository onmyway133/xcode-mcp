import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    archivePath: z.string().describe('Path to the .xcarchive file'),
    exportPath: z.string().describe('Directory where the exported product will be saved'),
    exportOptionsPlist: z.string().describe('Path to the export options plist file'),
});

export function registerExportArchive(server: McpServer) {
    server.registerTool(
        'xcode_export_archive',
        {
            description: 'Export an archive for distribution (App Store, Ad Hoc, etc.)',
            inputSchema,
        },
        async ({ archivePath, exportPath, exportOptionsPlist }) => {
            try {
                const result = await XcodeBuild.exportArchive({
                    archivePath,
                    exportPath,
                    exportOptionsPlist,
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
