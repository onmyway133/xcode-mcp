export interface NotarizationCredentials {
    keychainProfile?: string;
    appleId?: string;
    teamId?: string;
    password?: string;
}

export interface SubmitOptions extends NotarizationCredentials {
    wait?: boolean;
    timeout?: number;
}

export interface NotarizationSubmitResult {
    success: boolean;
    submissionId?: string;
    status?: string;
    message?: string;
}

export interface NotarizationStatusResult {
    status: string;
    submissionId: string;
    message?: string;
}

export interface NotarizationHistoryOptions extends NotarizationCredentials {
    limit?: number;
}

export interface NotarizationHistoryEntry {
    id: string;
    name: string;
    status: string;
    createdDate: string;
}

export interface StapleResult {
    success: boolean;
    message: string;
}

export interface SignCodeOptions {
    entitlements?: string;
    deep?: boolean;
    force?: boolean;
    timestamp?: boolean;
    hardened?: boolean;
}

export interface SignCodeResult {
    success: boolean;
    message: string;
}

export interface VerifyCodeResult {
    valid: boolean;
    details: string;
}

export interface CreateArchiveResult {
    success: boolean;
    filePath: string;
    message: string;
}

export interface SigningIdentity {
    hash: string;
    name: string;
}
