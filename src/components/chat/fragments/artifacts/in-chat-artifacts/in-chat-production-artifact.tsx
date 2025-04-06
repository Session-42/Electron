import React from 'react';
import ArtifactContainer from './in-chat-artifact-container';
import { AudioLinesIcon } from 'lucide-react';

// Music Player Artifact
interface MusicPlayerArtifactProps {
    onClick?: () => void;
    className?: string;
}

export const InChatProductionArtifact: React.FC<MusicPlayerArtifactProps> = ({
    onClick,
    className = '',
}) => {
    return (
        <ArtifactContainer
            icon={<AudioLinesIcon className="w-7 h-7 text-text-primary" />}
            onClick={onClick}
            className={className}
        >
            <div className="flex items-center space-x-3">
                <div className="flex items-center">
                    <span className="font-semibold text-text-primary">Production</span>
                </div>
            </div>
        </ArtifactContainer>
    );
};
