import { useRef, useCallback, useEffect, useState } from 'react';
import { audioApi, AudioType } from '~/utils/api';

export interface UploadResult {
    audioId: string;
    bpm: number;
    shiftBeat: number;
    songName: string;
}

interface UseSketchUploadStartReturn {
    startUpload: (
        file: File,
        postProcess: string | undefined,
        threadId: string
    ) => Promise<{ taskId: string } | { audioId: string }>;
    isLoading: boolean;
    isComplete: boolean;
    error: Error | null;
    cancel: () => void;
}

export function useSketchUploadStart(): UseSketchUploadStartReturn {
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, []);

    const startUpload = useCallback(
        async (
            file: File,
            postProcess: string | undefined,
            threadId: string
        ): Promise<{ taskId: string } | { audioId: string }> => {
            if (!file.type.startsWith('audio/')) {
                throw new Error('Please upload an audio file');
            }

            if (file.size > 60 * 1024 * 1024) {
                throw new Error('File size should be less than 50MB');
            }

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();
            setIsLoading(true);
            setIsComplete(false);
            setError(null);

            try {
                const fileType = postProcess || AudioType.DEMO;
                const response = await audioApi.upload(file, fileType, threadId);

                setIsComplete(true);
                return { audioId: response.data.audioId };
            } catch (err) {
                const error =
                    err instanceof Error && err.name === 'AbortError'
                        ? new Error('Upload cancelled')
                        : new Error(err instanceof Error ? err.message : 'Failed to upload file');

                setError(error);
                throw error;
            } finally {
                setIsLoading(false);
                abortControllerRef.current = null;
            }
        },
        []
    );

    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsLoading(false);
        setIsComplete(false);
        setError(null);
    }, []);

    return {
        startUpload,
        isLoading,
        isComplete,
        error,
        cancel,
    };
}
