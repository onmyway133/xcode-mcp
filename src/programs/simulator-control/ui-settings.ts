import { executeSimctl } from './core.js';
import type {
    AppearanceResult,
    ContentSizeResult,
    IncreaseContrastResult,
} from '../../types.js';

export type AppearanceMode = 'light' | 'dark';

export type ContentSize =
    | 'extra-small'
    | 'small'
    | 'medium'
    | 'large'
    | 'extra-large'
    | 'extra-extra-large'
    | 'extra-extra-extra-large'
    | 'accessibility-medium'
    | 'accessibility-large'
    | 'accessibility-extra-large'
    | 'accessibility-extra-extra-large'
    | 'accessibility-extra-extra-extra-large';

export async function setAppearance(
    deviceId: string,
    mode: AppearanceMode
): Promise<AppearanceResult> {
    const result = await executeSimctl(`ui "${deviceId}" appearance ${mode}`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to set appearance: ${result.stderr}`);
    }

    return {
        success: true,
        deviceId,
        appearance: mode,
    };
}

export async function getAppearance(
    deviceId: string
): Promise<AppearanceResult> {
    const result = await executeSimctl(`ui "${deviceId}" appearance`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to get appearance: ${result.stderr}`);
    }

    const output = result.stdout.trim().toLowerCase();
    const appearance = output === 'dark' ? 'dark' : 'light';

    return {
        success: true,
        deviceId,
        appearance,
    };
}

export async function setContentSize(
    deviceId: string,
    size: ContentSize
): Promise<ContentSizeResult> {
    const result = await executeSimctl(`ui "${deviceId}" content_size ${size}`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to set content size: ${result.stderr}`);
    }

    return {
        success: true,
        deviceId,
        size,
    };
}

export async function getContentSize(
    deviceId: string
): Promise<ContentSizeResult> {
    const result = await executeSimctl(`ui "${deviceId}" content_size`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to get content size: ${result.stderr}`);
    }

    return {
        success: true,
        deviceId,
        size: result.stdout.trim(),
    };
}

export async function setIncreaseContrast(
    deviceId: string,
    enabled: boolean
): Promise<IncreaseContrastResult> {
    const value = enabled ? 'enabled' : 'disabled';
    const result = await executeSimctl(`ui "${deviceId}" increase_contrast ${value}`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to set increase contrast: ${result.stderr}`);
    }

    return {
        success: true,
        deviceId,
        enabled,
    };
}

export async function getIncreaseContrast(
    deviceId: string
): Promise<IncreaseContrastResult> {
    const result = await executeSimctl(`ui "${deviceId}" increase_contrast`);

    if (result.exitCode !== 0) {
        throw new Error(`Failed to get increase contrast: ${result.stderr}`);
    }

    const output = result.stdout.trim().toLowerCase();
    const enabled = output === 'enabled';

    return {
        success: true,
        deviceId,
        enabled,
    };
}
