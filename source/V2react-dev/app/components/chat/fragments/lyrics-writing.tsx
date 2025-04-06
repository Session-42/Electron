import React from 'react';
import type { LyricsWritingFragment } from '~/types/chat.types';
import { InChatLyricsArtifact } from '~/components/chat/fragments/artifacts/in-chat-artifacts/in-chat-lyrics-artifact';

interface LyricsWritingMessageProps {
    fragment: LyricsWritingFragment;
    onClick: () => void;
}

export const LyricsWritingMessage: React.FC<LyricsWritingMessageProps> = ({
    fragment,
    onClick,
}) => {
    return <InChatLyricsArtifact fragment={fragment} onClick={onClick} />;
};
