import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { Simulator } from '../../../programs/index.js';

const inputSchema = z.object({
    deviceId: z.string().optional().default('booted').describe('Simulator UDID (defaults to booted simulator)'),
    outputPath: z.string().describe('Absolute path where the video will be saved (e.g., /path/to/recording.mov)'),
    codec: z.enum(['h264', 'hevc']).optional().describe('Video codec (default: hevc)'),
    force: z.boolean().optional().describe('Overwrite existing file if present'),
});

export function registerRecordVideo(server: McpServer) {
    server.registerTool(
        'simulator_record_video',
        {
            description: 'Start recording video from a simulator. Use simulator_stop_recording to stop.',
            inputSchema,
        },
        async ({ deviceId, outputPath, codec, force }) => {
            try {
                const result = await Simulator.startRecording(deviceId, outputPath, {
                    codec,
                    force,
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
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify({ error: error.message }, null, 2),
                        },
                    ],
                    isError: true,
                };
            }
        }
    );
}
