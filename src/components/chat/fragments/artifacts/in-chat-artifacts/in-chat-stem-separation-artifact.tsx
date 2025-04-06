import React from 'react';
import ArtifactContainer from '~/components/chat/fragments/artifacts/in-chat-artifacts/in-chat-artifact-container';
import { MicVocalIcon, GuitarIcon } from 'lucide-react';

interface InChatStemSeparationArtifactsProps {
    onVocalsClick?: () => void;
    onInstrumentalClick?: () => void;
    className?: string;
}

export const InChatStemSeparationArtifacts: React.FC<InChatStemSeparationArtifactsProps> = ({
    onVocalsClick,
    onInstrumentalClick,
    className = '',
}) => {
    return (
        <div className="flex gap-2">
            <ArtifactContainer
                icon={<MicVocalIcon className="w-7 h-7 text-text-primary" />}
                onClick={onVocalsClick}
                className={className}
            >
                <div className="flex font-semibold items-center space-x-3">Vocals Track</div>
            </ArtifactContainer>
            <ArtifactContainer
                icon={<GuitarIcon className="w-7 h-7 text-text-primary" />}
                onClick={onInstrumentalClick}
                className={className}
            >
                <div className="flex font-semibold items-center space-x-3">Instrumental Track</div>
            </ArtifactContainer>
        </div>
    );
};
