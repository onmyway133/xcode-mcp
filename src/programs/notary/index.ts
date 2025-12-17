// Core utilities
export {
    buildCredentialsArgs,
    executeNotarytool,
    executeCodesign,
    executeStapler,
    executeSpctl,
    executeDitto,
    executeHdiutil,
    executeSecurity,
} from './core.js';

// Notarization operations
export {
    submit,
    checkStatus,
    getLog,
    getHistory,
    staple,
    validateStaple,
    notarizeAndStaple,
    storeCredentials,
} from './notarization.js';

// Signing operations
export {
    signCode,
    verifyCode,
    listSigningIdentities,
} from './signing.js';

// Archive operations
export {
    createZip,
    createDmg,
} from './archive.js';

// Types
export * from './types.js';
