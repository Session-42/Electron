import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi } from '~/utils/api';
import { Message, Fragment, ThreadDetailsWithId } from '~/types/chat.types';

export const useThread = (threadId: string) => {
    return useQuery({
        queryKey: ['thread', threadId],
        queryFn: async () => {
            const response = await chatApi.get(threadId);
            return response.data;
        },
        enabled: !!threadId,
    });
};

export const useRecentThreads = (artistId: string | undefined) => {
    return useQuery({
        queryKey: ['recentThreads', artistId],
        queryFn: async () => {
            if (!artistId) return {};
            const response = await chatApi.listByArtistWithAmount(artistId, 30);
            return response.data.threads || {};
        },
        enabled: !!artistId,
    });
};

export const useThreadMessages = (threadId: string | undefined) => {
    return useQuery({
        queryKey: ['messages', threadId],
        queryFn: async () => {
            if (!threadId) return [];
            const response = await chatApi.listMessages(threadId);
            return response.data.messages;
        },
        enabled: !!threadId,
    });
};

export const useCreateThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (artistId: string) => {
            const response = await chatApi.create(artistId);
            if (!response.data.threadId) {
                throw new Error('Failed to create chat');
            }
            return { lastMessageAt: new Date().toLocaleString('en-US'), ...response.data };
        },
        onSuccess: (data, artistId) => {
            queryClient.setQueryData(
                ['recentThreads', artistId],
                (old: Record<string, ThreadDetailsWithId> = {}) => ({
                    [data.threadId]: data,
                    ...old,
                })
            );
        },
    });
};

export const useDeleteThread = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (thread: ThreadDetailsWithId) => {
            const response = await chatApi.delete(thread.threadId);
            return response;
        },
        onSuccess: (_, thread) => {
            queryClient.invalidateQueries({ queryKey: ['recentThreads'] });
            queryClient.removeQueries({ queryKey: ['messages', thread.threadId] });
        },
    });
};

export const useSendMessageMutation = (threadId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (fragment: Fragment) => {
            const response = await chatApi.sendMessage(threadId, fragment);
            if (!response.data.message) {
                throw new Error('Invalid message response');
            }

            queryClient.setQueryData<Message[]>(['messages', threadId], (old = []) => {
                return [...old, response.data.message];
            });

            return response.data.message;
        },
        onMutate: async (fragment) => {
            await queryClient.cancelQueries({ queryKey: ['messages', threadId] });

            const optimisticMessage: Message = {
                id: Date.now().toString(),
                content: [fragment],
                role: 'user',
                timestamp: new Date(),
            };

            queryClient.setQueryData<Message[]>(['messages', threadId], (old = []) => {
                return [...old, optimisticMessage];
            });

            queryClient.setQueryData(
                ['recentThreads'],
                (old: Record<string, ThreadDetailsWithId> = {}) => {
                    return {
                        [threadId]: {
                            ...old[threadId],
                            lastMessageAt: new Date().toLocaleString('en-US'),
                        },
                        ...old,
                    };
                }
            );

            return { optimisticMessage };
        },
        onError: (err, _, context) => {
            console.debug('Error sending message:', err);

            queryClient.setQueryData<Message[]>(['messages', threadId], (old = []) => {
                return [
                    ...old,
                    {
                        content: [
                            {
                                text: 'Sorry, there was an error sending your message. Please try again.',
                                type: 'text',
                            },
                        ],
                        role: 'assistant',
                        timestamp: new Date(),
                        id: Date.now().toString(),
                    },
                ];
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recentThreads'] });
        },
    });
};

export const useSendMessage = (threadId: string) => {
    const mutation = useSendMessageMutation(threadId);

    const sendText = (text: string) => mutation.mutateAsync({ type: 'text', text });

    const sendSketchUploadStart = (
        audioUploadRequestId: string,
        taskId: string,
        fileName: string
    ) =>
        mutation.mutateAsync({
            type: 'audio_upload_start',
            audioUploadRequestId,
            taskId,
            fileName,
        });

    const sendSketchUploadComplete = (
        audioUploadRequestId: string,
        taskId: string,
        audioId: string,
        songName: string
    ) =>
        mutation.mutateAsync({
            type: 'audio_upload_complete',
            taskId,
            audioId,
            audioUploadRequestId,
            songName,
        });

    const sendReferenceSelection = (
        referenceId: string,
        referenceCandidatesId: string,
        optionNumber: number
    ) =>
        mutation.mutateAsync({
            type: 'reference_selection',
            referenceId,
            referenceCandidatesId,
            optionNumber,
        });

    const sendSongRenderingComplete = (audioId: string, taskId: string, butcherId: string) =>
        mutation.mutateAsync({
            type: 'song_rendering_complete',
            audioId,
            taskId,
            butcherId,
        });

    const sendQuantizationComplete = (audioId: string, taskId: string) =>
        mutation.mutateAsync({
            type: 'quantization_complete',
            audioId,
            taskId,
        });

    const sendMixingComplete = (audioId: string, taskId: string) =>
        mutation.mutateAsync({
            type: 'mixing_complete',
            audioId,
            taskId,
        });

    const sendSongCompositionComplete = (audioId: string, taskId: string) =>
        mutation.mutateAsync({
            type: 'song_composition_complete',
            audioId,
            taskId,
        });

    const sendError = (error: string, taskId: string) => {
        error = ['NoChordsSnapped', 'UnsupportedTimeSignature', 'NoBeatsFound'].includes(error)
            ? error
            : 'Unknown';

        return mutation.mutateAsync({
            type: 'error',
            taskId,
            error,
        });
    };

    return {
        sendText,
        sendSketchUploadStart,
        sendSketchUploadComplete,
        sendReferenceSelection,
        sendSongRenderingComplete,
        sendQuantizationComplete,
        sendMixingComplete,
        sendSongCompositionComplete,
        sendError,
        mutation,
    };
};
