import React, { useEffect, useRef, useState, useMemo } from 'react';
import { LoadingDots } from '../../ui/loading-dots';
import { useSearchParams } from 'react-router';
import { Message } from '~/types/chat.types';
import { MessageFactory } from '~/components/chat/messages/message-factory';
import { MessageContainer } from '~/components/chat/messages/message-container';
import { useSettings } from '~/contexts/settings-context';
import { AnimatePresence, motion } from 'framer-motion';

interface MessageListProps {
    threadId: string;
    messages: Message[];
    isWaitingForMessage: boolean;
}

const LoadingIndicator = React.memo(() => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
    >
        <LoadingDots />
    </motion.div>
));

const MessageItem = React.memo(
    ({
        message,
        threadId,
        onRef,
    }: {
        message: Message;
        threadId: string;
        onRef: (el: HTMLDivElement | null) => void;
    }) => (
        <MessageContainer ref={onRef}>
            <MessageFactory message={message} threadId={threadId} />
        </MessageContainer>
    )
);

export const MessageList: React.FC<MessageListProps> = React.memo(
    ({ threadId, messages, isWaitingForMessage }) => {
        const { settings } = useSettings();
        const [searchParams] = useSearchParams();
        const messageId = searchParams.get('message');
        const messagesEndRef = useRef<HTMLDivElement>(null);
        const messageRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
        const prevMessagesLengthRef = useRef<number>(0);
        const [bottomSpaceHeight, setBottomSpaceHeight] = useState<number>(0);

        // Helper function to get or initialize the refs map
        const getMessageRefsMap = () => {
            if (!messageRefs.current) {
                messageRefs.current = new Map();
            }
            return messageRefs.current;
        };

        // Only calculate bottom space if classic scroll mode is not enabled
        const updateBottomSpace = () => {
            if (settings.classicScrollMode) {
                setBottomSpaceHeight(0);
                return;
            }

            const refsMap = getMessageRefsMap();

            const lastUserMessageIndex =
                messages.length -
                1 -
                [...messages].reverse().findIndex((msg) => msg.role === 'user');

            if (lastUserMessageIndex < 0) return;

            const lastUserMessageId = messages[lastUserMessageIndex].id;
            const lastUserMessageElement = refsMap.get(lastUserMessageId);

            if (!lastUserMessageElement) return;

            const messagesAfterLastUserMessage = messages.slice(lastUserMessageIndex + 1);
            const messagesAfterLastUserMessageElements = messagesAfterLastUserMessage.map((msg) =>
                refsMap.get(msg.id)
            );

            const heightSum = messagesAfterLastUserMessageElements.reduce((acc, el) => {
                if (!el) return acc;
                return acc + el.offsetHeight;
            }, 0);

            // Add extra space for loading dots
            const loadingDotsSpace = isWaitingForMessage ? 42 : 0;
            const chatInputSpace = 110;
            const gapSpace = 48 * 2; // 48px is the gap between messages
            const newBottomSpace =
                window.innerHeight -
                lastUserMessageElement.offsetHeight -
                heightSum -
                chatInputSpace -
                gapSpace -
                loadingDotsSpace;
            setBottomSpaceHeight(Math.max(newBottomSpace, 0));
        };

        // Initial mount effect for scrolling to messageId or messagesEnd
        useEffect(() => {
            const refsMap = getMessageRefsMap();

            if (messageId) {
                const targetMessageElement = refsMap.get(messageId);
                if (targetMessageElement) {
                    targetMessageElement.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (messagesEndRef.current) {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }

            setTimeout(updateBottomSpace, 0);
        }, [messageId]);

        // Handle scrolling on new message and recalculate bottom space
        useEffect(() => {
            const currentMessagesLength = messages.length;
            const prevMessagesLength = prevMessagesLengthRef.current;

            if (currentMessagesLength > prevMessagesLength && prevMessagesLength > 0) {
                setTimeout(updateBottomSpace, 100);

                const refsMap = getMessageRefsMap();
                const lastUserMessageIndex = [...messages]
                    .reverse()
                    .findIndex((msg) => msg.role === 'user');

                if (lastUserMessageIndex >= 0) {
                    const lastUserMessageId =
                        messages[messages.length - 1 - lastUserMessageIndex].id;
                    const lastUserMessageElement = refsMap.get(lastUserMessageId);
                    if (lastUserMessageElement) {
                        lastUserMessageElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }

            prevMessagesLengthRef.current = currentMessagesLength;
        }, [messages]);

        const messageElements = useMemo(() => {
            return messages.map((message: Message) => (
                <MessageItem
                    key={message.id}
                    message={message}
                    threadId={threadId}
                    onRef={(el) => {
                        const refsMap = getMessageRefsMap();
                        refsMap.set(message.id, el);
                    }}
                />
            ));
        }, [messages, threadId]);

        return (
            <div className="flex flex-col gap-4">
                {messageElements}
                <AnimatePresence mode="wait">
                    {isWaitingForMessage && <LoadingIndicator />}
                </AnimatePresence>
                <div
                    ref={messagesEndRef}
                    style={{ height: `${bottomSpaceHeight}px` }}
                    aria-hidden="true"
                />
            </div>
        );
    }
);
