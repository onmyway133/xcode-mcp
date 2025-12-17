import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { XcodeBuild } from '../../../programs/index.js';

const inputSchema = z.object({
    projectPath: z.string().describe('Absolute path to .xcodeproj or .xcworkspace file'),
    scheme: z.string().describe('The scheme to test'),
    destination: z.string().optional().describe('Test destination (e.g., "platform=iOS Simulator,name=iPhone 15")'),
    configuration: z.string().optional().describe('Build configuration'),
    testPlan: z.string().optional().describe('Test plan name to run'),
    onlyTesting: z.array(z.string()).optional().describe('Run only specified tests (e.g., ["MyAppTests/TestClass/testMethod"])'),
    skipTesting: z.array(z.string()).optional().describe('Skip specified tests'),
    resultBundlePath: z.string().optional().describe('Path to save test result bundle'),
    derivedDataPath: z.string().optional().describe('Custom derived data path'),
});

export function registerRunTests(server: McpServer) {
    server.registerTool(
        'xcode_run_tests',
        {
            description: 'Run tests for an Xcode project',
            inputSchema,
        },
        async ({ projectPath, scheme, destination, configuration, testPlan, onlyTesting, skipTesting, resultBundlePath, derivedDataPath }) => {
            try {
                const result = await XcodeBuild.test(projectPath, {
                    scheme,
                    destination,
                    configuration,
                    testPlan,
                    onlyTesting,
                    skipTesting,
                    resultBundlePath,
                    derivedDataPath,
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
