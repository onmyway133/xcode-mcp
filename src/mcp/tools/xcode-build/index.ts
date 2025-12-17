import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerBuildProject } from './build-project.js';
import { registerRunTests } from './run-tests.js';
import { registerGetBuildSettings } from './get-build-settings.js';
import { registerGetInfoPlist } from './get-info-plist.js';
import { registerListSchemes } from './list-schemes.js';
import { registerGetProjectInfo } from './get-project-info.js';
import { registerArchiveProject } from './archive-project.js';
import { registerExportArchive } from './export-archive.js';
import { registerCleanProject } from './clean-project.js';
import { registerAnalyzeProject } from './analyze-project.js';
import { registerListSDKs } from './list-sdks.js';
import { registerGetXcodeVersion } from './get-xcode-version.js';
import { registerSelectXcode } from './select-xcode.js';
import { registerGetDeveloperPath } from './get-developer-path.js';
import { registerListXcodeInstallations } from './list-xcode-installations.js';

export function registerXcodeBuildTools(server: McpServer) {
    registerBuildProject(server);
    registerRunTests(server);
    registerGetBuildSettings(server);
    registerGetInfoPlist(server);
    registerListSchemes(server);
    registerGetProjectInfo(server);
    registerArchiveProject(server);
    registerExportArchive(server);
    registerCleanProject(server);
    registerAnalyzeProject(server);
    registerListSDKs(server);
    registerGetXcodeVersion(server);
    registerSelectXcode(server);
    registerGetDeveloperPath(server);
    registerListXcodeInstallations(server);
}
