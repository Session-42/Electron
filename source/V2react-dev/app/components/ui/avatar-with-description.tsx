import React from 'react';
import { Avatar } from './avatar';
import { useTheme } from '~/contexts/theme-context';

interface AvatarWithDescriptionProps {
    imageSrc?: string;
    name?: string;
    description?: string;
    onAvatarClick?: () => void;
    avatarSize?: 'sm' | 'md' | 'lg';
    marginTop?: string;
}

const AvatarWithDescription: React.FC<AvatarWithDescriptionProps> = ({
    imageSrc,
    name = 'HitCraft',
    description = 'The AI For Music Creators',
    onAvatarClick,
    avatarSize = 'md',
    marginTop = '0px',
}) => {
    const { mode } = useTheme();
    const defaultImageSrc = mode === 'dark' ? '/assets/hiti-dark.svg' : '/assets/hiti-light.svg';

    return (
        <div style={{ marginTop: marginTop }} className={`flex flex-col items-center`}>
            <Avatar
                imageSrc={imageSrc || defaultImageSrc}
                name={name}
                description={description}
                onAvatarClick={onAvatarClick}
                size={avatarSize}
            />
        </div>
    );
};

export default AvatarWithDescription;
