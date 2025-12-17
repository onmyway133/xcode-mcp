import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerXcodeBuildTools } from './xcode-build/index.js';
import { registerSimulatorTools } from './simulator/index.js';
import { registerNotarizeTools } from './notarize/index.js';

export function registerAllTools(server: McpServer) {
    registerXcodeBuildTools(server);
    registerSimulatorTools(server);
    registerNotarizeTools(server);
}
