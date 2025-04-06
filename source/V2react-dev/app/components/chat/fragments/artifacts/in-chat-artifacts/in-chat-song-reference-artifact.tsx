import React from 'react';
import ArtifactContainer from './in-chat-artifact-container';
import { AudioLinesIcon } from 'lucide-react';

interface InChatMusicalMatchesArtifactProps {
    tracks: {
        spotifyId: string;
        title: string;
    }[];
    onClick?: () => void;
}

export const InChatMusicalMatchesArtifact: React.FC<InChatMusicalMatchesArtifactProps> = ({
    tracks,
    onClick,
}) => {
    return (
        <ArtifactContainer
            icon={<AudioLinesIcon className="w-6 h-6 text-text-primary" />}
            onClick={onClick}
        >
            <div className="flex items-center space-x-3">
                <div className="flex items-center">
                    <span className="font-semibold text-text-primary">
                        {tracks.length} Musical Matches
                    </span>
                </div>
            </div>
            <div className="text-text-muted text-xs"></div>
        </ArtifactContainer>
    );
};

export default InChatMusicalMatchesArtifact;
