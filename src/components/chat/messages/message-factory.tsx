import { Message } from '~/types/chat.types';
import { FragmentFactory } from '~/components/chat/fragments/fragment-factory';
import { FragmentBubbleContainer } from '~/components/chat/fragments/containers/fragment-bubble-container';
import { FragmentStatusContainer } from '~/components/chat/fragments/containers/fragment-status-container';

// This is the list of message types that will be displayed as a status message.
const STATUS_MESSAGE_TYPES = [
    'audio_upload_start',
    'audio_upload_complete',
    'reference_selection',
    'song_rendering_start',
    'quantization_start',
    'mixing_start',
    'stem_separation_start',
    'song_composition_start',
    'error',
    'audio_analysis_start',
];

interface MessageFactoryProps {
    message: Message;
    threadId: string;
}

export const MessageFactory = ({ message, threadId }: MessageFactoryProps) => {
    const fragments = message.content;
    let messageBubbleFragments: React.ReactNode[] = [];
    const components: React.ReactNode[] = [];
    let currentMessageBubbleIndex = 0;

    // Process each fragment in order
    fragments.forEach((fragment, index) => {
        const renderedFragment = (
            <FragmentFactory key={index} fragment={fragment} threadId={threadId} />
        );

        if (STATUS_MESSAGE_TYPES.includes(fragment.type)) {
            // If we have accumulated any message bubble fragments, wrap and add them
            if (messageBubbleFragments.length > 0) {
                components.push(
                    <FragmentBubbleContainer
                        key={`bubble-${currentMessageBubbleIndex}`}
                        role={message.role}
                    >
                        {messageBubbleFragments.slice()}
                    </FragmentBubbleContainer>
                );
                messageBubbleFragments = []; // Clear the array
                currentMessageBubbleIndex++;
            }

            // Add the status message
            components.push(
                <FragmentStatusContainer
                    key={`status-${index}`}
                    isLoading={fragment.done !== undefined && !fragment.done}
                >
                    {renderedFragment}
                </FragmentStatusContainer>
            );
        } else {
            messageBubbleFragments.push(renderedFragment);
        }
    });

    // If we have any remaining message bubble fragments, wrap and add them
    if (messageBubbleFragments.length > 0) {
        components.push(
            <FragmentBubbleContainer
                key={`bubble-${currentMessageBubbleIndex}`}
                role={message.role}
            >
                {messageBubbleFragments}
            </FragmentBubbleContainer>
        );
    }

    return components;
};
