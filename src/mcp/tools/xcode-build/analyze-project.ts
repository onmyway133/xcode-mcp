import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    projectPath: z.string().describe('Absolute path to .xcodeproj or .xcworkspace file'),
    scheme: z.string().optional().describe('The scheme to analyze'),
    target: z.string().optional().describe('The target to analyze'),
    configuration: z.string().optional().describe('Build configuration'),
});

export function registerAnalyzeProject(server: McpServer) {
    server.registerTool(
        'xcode_analyze_project',
        {
            description: 'Run static analysis on an Xcode project',
            inputSchema,
        },
        async ({ projectPath, scheme, target, configuration }) => {
            try {
                const result = await XcodeBuild.analyze(projectPath, {
                    scheme,
                    target,
                    configuration,
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
