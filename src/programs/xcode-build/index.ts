// Core utilities
export {
    getProjectArgument,
    buildXcodebuildArgs,
    parseErrors,
    parseWarnings,
    executeXcodebuild,
    isCommandLineToolsError,
    enhanceXcodebuildError,
} from './core.js';

// Build operations
export {
    build,
    buildForTesting,
    clean,
    analyze,
    archive,
    exportArchive,
} from './build.js';

// Test operations
export {
    test,
    testWithoutBuilding,
} from './test.js';

// Info operations
export {
    listSchemes,
    listTargets,
    listConfigurations,
    getBuildSettings,
    getInfoPlist,
    getProjectInfo,
    listSDKs,
    getXcodeVersion,
    getDeveloperPath,
    selectXcode,
    listXcodeInstallations,
} from './info.js';

// Types
export * from './types.js';
