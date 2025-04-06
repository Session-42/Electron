import React from 'react';
import ArtifactContainer from './in-chat-artifact-container';
import { ListMusic } from 'lucide-react';
import type { LyricsWritingFragment } from '~/types/chat.types';

interface LyricsArtifactProps {
    fragment: LyricsWritingFragment;
    onClick?: () => void;
    className?: string;
}

export const InChatLyricsArtifact: React.FC<LyricsArtifactProps> = ({
    fragment,
    onClick,
    className = '',
}) => {
    return (
        <ArtifactContainer
            icon={<ListMusic className="w-7 h-7 text-text-primary" />}
            onClick={onClick}
            className={className}
        >
            <div className="flex items-center space-x-3">
                {/* Song title */}
                <div className="flex items-center">
                    <span className="font-semibold text-text-primary">{fragment.songName}</span>
                </div>
            </div>
        </ArtifactContainer>
    );
};
