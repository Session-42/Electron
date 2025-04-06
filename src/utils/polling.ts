import { TaskStatus } from '../types/common';
import { HitcraftError } from './api';

interface BaseTaskStatus {
    status: TaskStatus;
    message?: string;
    error?: string;
}

interface PollingConfig {
    taskId: string;
    interval?: number;
    maxAttempts?: number;
    controller?: AbortController;
}

export async function poll<T extends BaseTaskStatus>(
    callback: (taskId: string) => Promise<{ data: T }>,
    config: PollingConfig
): Promise<T> {
    const { taskId, interval = 2000, maxAttempts = 300, controller } = config;

    let attempts = 0;
    let timeoutId: number | undefined;

    while (attempts < maxAttempts) {
        controller?.signal.throwIfAborted();

        const { data: result } = await callback(taskId);

        if (result.status === 'succeeded') {
            return result;
        }

        if (result.status === 'failed') {
            if (result.error) {
                throw new HitcraftError(result.error);
            }
            throw new Error(result.error || 'Task failed');
        }

        attempts++;

        await new Promise((resolve) => {
            timeoutId = window.setTimeout(resolve, interval);
        });
    }

    throw new Error('Polling timeout');
}