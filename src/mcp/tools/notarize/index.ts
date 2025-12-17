import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerSubmitForNotarization } from './submit-for-notarization.js';
import { registerCheckNotarizationStatus } from './check-notarization-status.js';
import { registerGetNotarizationLog } from './get-notarization-log.js';
import { registerGetNotarizationHistory } from './get-notarization-history.js';
import { registerStaple } from './staple.js';
import { registerValidateStaple } from './validate-staple.js';
import { registerNotarizeAndStaple } from './notarize-and-staple.js';
import { registerStoreCredentials } from './store-credentials.js';
import { registerCreateDmg } from './create-dmg.js';
import { registerCreateZip } from './create-zip.js';
import { registerSignCode } from './sign-code.js';
import { registerVerifyCode } from './verify-code.js';
import { registerListSigningIdentities } from './list-signing-identities.js';

export function registerNotarizeTools(server: McpServer) {
    registerSubmitForNotarization(server);
    registerCheckNotarizationStatus(server);
    registerGetNotarizationLog(server);
    registerGetNotarizationHistory(server);
    registerStaple(server);
    registerValidateStaple(server);
    registerNotarizeAndStaple(server);
    registerStoreCredentials(server);
    registerCreateDmg(server);
    registerCreateZip(server);
    registerSignCode(server);
    registerVerifyCode(server);
    registerListSigningIdentities(server);
}
