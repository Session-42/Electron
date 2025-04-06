import { useState, useMemo } from 'react';
import { Message } from '~/types/chat.types';
import { useSendMessage } from './use-chat';
import { MessageProcessor } from '~/utils/message-processor';

// Initialize message processor
const processor = new MessageProcessor();

export function useChatState(threadId: string, messages: Message[]) {
    const [isWaitingForMessage, setIsWaitingForMessage] = useState(false);
    const { sendText } = useSendMessage(threadId);

    // Process messages to get chat state
    const chatState = useMemo(() => processor.process(messages), [messages]);

    // Message handler
    const handleSendMessage = async (text: string) => {
        const trimmedText = text.trim();
        if (!trimmedText) return;

        setIsWaitingForMessage(true);
        try {
            await sendText(trimmedText);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsWaitingForMessage(false);
        }
    };

    return {
        isWaitingForMessage,
        chatState,
        handleSendMessage,
    };
}
