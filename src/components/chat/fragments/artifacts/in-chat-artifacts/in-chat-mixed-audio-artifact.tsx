import React from 'react';
import ArtifactContainer from './in-chat-artifact-container';
import { Disc3Icon } from 'lucide-react';

interface InChatMixedAudioArtifactProps {
    onClick?: () => void;
    className?: string;
}

export const InChatMixedAudioArtifact: React.FC<InChatMixedAudioArtifactProps> = ({
    onClick,
    className = '',
}) => {
    return (
        <div className="flex gap-2">
            <ArtifactContainer
                icon={<Disc3Icon className="w-7 h-7 text-text-primary" />}
                onClick={onClick}
                className={className}
            >
                <div className="flex font-semibold items-center space-x-3">Mixed Audio</div>
            </ArtifactContainer>
        </div>
    );
};
