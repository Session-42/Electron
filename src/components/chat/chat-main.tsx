import { useEffect, useRef, useMemo } from 'react';
import { ChatInputWithUpload } from '~/components/chat/chat-input-with-upload';
import { Artist } from '~/types/artist';
import { Message, ThreadDetailsWithId, AudioUploadRequestFragment } from '~/types/chat.types';
import { useChatState } from '~/hooks/chat/use-chat-state';
import AvatarWithDescription from '../ui/avatar-with-description';
import { MessageList } from '~/components/chat/messages/message-list';
import { chatApi } from '~/utils/api';
import { useQueryClient } from '@tanstack/react-query';
import { useSendMessage } from '~/hooks/chat/use-chat';

interface ChatMainProps {
    thread: ThreadDetailsWithId;
    messages: Message[];
    initialMessage?: string;
    selectedArtist: Artist;
    onInitialMessageSent: () => void;
}

const fakeAssistantMessageTypes = [
    'song_rendering_complete',
    'stem_separation_complete',
    'quantization_complete',
    'mixing_complete',
    'song_composition_complete',
];

export default function ChatMain({
    thread,
    messages,
    initialMessage,
    selectedArtist,
    onInitialMessageSent,
}: ChatMainProps) {
    const didInit = useRef(false);
    const isPolling = useRef(false);
    const { isWaitingForMessage, chatState, handleSendMessage } = useChatState(
        thread.threadId,
        messages
    );
    const { sendSketchUploadStart, sendSketchUploadComplete } = useSendMessage(thread.threadId);

    const queryClient = useQueryClient();

    // Handle initial message
    useEffect(() => {
        if (!initialMessage || !thread || didInit.current) return;

        const initNewChat = async () => {
            didInit.current = true;
            await handleSendMessage(initialMessage);
            onInitialMessageSent();
        };

        initNewChat();
    }, [initialMessage, thread]);

    useEffect(() => {
        let isCancelled = false;

        if (isPolling.current) return;

        const getPendingMessages = async () => {
            let i = 0;
            while (i < 10000 && !isCancelled) {
                const response = await chatApi.pendingMessages(thread.threadId);
                if (response.data.length === 0) {
                    isPolling.current = false;
                    return;
                }

                const resolvedMessage = response.data.find((res) => res.message)?.message;

                if (resolvedMessage) {
                    queryClient.setQueryData<Message[]>(
                        ['messages', thread.threadId],
                        (old = []) => {
                            return [...old, resolvedMessage];
                        }
                    );
                }

                await new Promise((resolve) => {
                    window.setTimeout(resolve, 2000);
                });

                i++;
            }

            isPolling.current = false;
        };
        isPolling.current = true;
        getPendingMessages();

        return () => {
            isCancelled = true;
            isPolling.current = false;
        };
    }, [messages, thread, queryClient]);

    // Find the last incomplete upload request
    const activeUploadRequest = useMemo(() => {
        const uploadRequestFragments = messages
            .flatMap((msg) => msg.content)
            .filter(
                (fragment): fragment is AudioUploadRequestFragment =>
                    fragment.type === 'audio_upload_request'
            )
            .reverse();

        return (
            uploadRequestFragments.find((request) => {
                const hasComplete = messages
                    .flatMap((msg) => msg.content)
                    .some(
                        (fragment) =>
                            fragment.type === 'audio_upload_complete' &&
                            'audioUploadRequestId' in fragment &&
                            fragment.audioUploadRequestId === request.audioUploadRequestId
                    );
                return !hasComplete;
            }) || null
        );
    }, [messages]);

    /**
     * Given chat state, process messages to determine fragment status.
     * @param messages - The messages to process.
     * @returns The processed messages.
     */
    const _processMessages = (messages: Message[]) => {
        const filteredMessages = messages.filter(
            (message) =>
                !(
                    message.role === 'user' &&
                    message.content.some((fragment) =>
                        fakeAssistantMessageTypes.includes(fragment.type)
                    )
                )
        );

        return filteredMessages.map((message) => ({
            ...message,
            role: message.content.some((fragment) =>
                fakeAssistantMessageTypes.includes(fragment.type)
            )
                ? 'assistant'
                : message.role,
            content: message.content.map((fragment) => {
                fragment = { ...fragment, messageId: message.id, threadId: thread.threadId };

                // Check if fragment is in any of the grouped collections and update its status
                if ('audioUploadRequestId' in fragment) {
                    const uploads = chatState.audioUploads[fragment.audioUploadRequestId];
                    if (uploads) {
                        return {
                            ...fragment,
                            done: uploads.length > 1,
                        };
                    }
                }

                if ('taskId' in fragment && fragment.type.startsWith('song_rendering')) {
                    const renderings = chatState.songRenderings[fragment.taskId];
                    if (renderings) {
                        return {
                            ...fragment,
                            done: renderings.length > 1,
                        };
                    }
                }

                if ('taskId' in fragment && fragment.type.startsWith('quantization')) {
                    const quantizations = chatState.quantizations[fragment.taskId];
                    if (quantizations) {
                        return {
                            ...fragment,
                            done: quantizations.length > 1,
                        };
                    }
                }

                if ('taskId' in fragment && fragment.type.startsWith('audio_analysis')) {
                    const analysis = chatState.analysis[fragment.taskId];
                    if (analysis) {
                        return {
                            ...fragment,
                            done: analysis.length > 1,
                        };
                    }
                }

                if ('taskId' in fragment && fragment.type.startsWith('mixing')) {
                    const mixings = chatState.mixings[fragment.taskId];
                    if (mixings) {
                        return {
                            ...fragment,
                            done: mixings.length > 1,
                        };
                    }
                }

                if ('taskId' in fragment && fragment.type.startsWith('song_composition')) {
                    const compositions = chatState.songCompositions[fragment.taskId];
                    if (compositions) {
                        return {
                            ...fragment,
                            done: compositions.length > 1,
                        };
                    }
                }

                if ('taskId' in fragment && fragment.type.startsWith('stem_separation')) {
                    const stemSeparations = chatState.stemSeparations[fragment.taskId];
                    if (stemSeparations) {
                        return {
                            ...fragment,
                            done: stemSeparations.length > 1,
                        };
                    }
                }

                if ('referenceCandidatesId' in fragment) {
                    const references = chatState.references[fragment.referenceCandidatesId];
                    if (references) {
                        return {
                            ...fragment,
                            done: references.length > 1,
                        };
                    }
                }

                return fragment;
            }),
        }));
    };

    /**
     * Prepare messages for rendering.
     * @param messages - The messages to prepare.
     * @returns The prepared messages.
     */
    const prepareMessageForRender = (messages: Message[]) => {
        const processedMessages = _processMessages(messages);
        return processedMessages;
    };

    return (
        <div className="flex flex-col justify-between h-full w-full max-w-2xl">
            <div className="flex flex-col pt-16 px-4 gap-8">
                <AvatarWithDescription />
                <MessageList
                    isWaitingForMessage={isWaitingForMessage}
                    threadId={thread.threadId}
                    messages={prepareMessageForRender(messages)}
                />
            </div>
            <div className="sticky bottom-0">
                <ChatInputWithUpload
                    onSendMessage={handleSendMessage}
                    artistName={selectedArtist.name || ''}
                    isLoading={isWaitingForMessage}
                    activeUploadRequest={activeUploadRequest}
                    threadId={thread.threadId}
                    onUploadStart={sendSketchUploadStart}
                    onUploadComplete={sendSketchUploadComplete}
                />
            </div>
        </div>
    );
}
