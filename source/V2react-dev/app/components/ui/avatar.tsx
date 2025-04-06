import React from 'react';

interface AvatarProps {
    imageSrc: string;
    name: string;
    description?: string;
    onAvatarClick?: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-[74px] h-[74px]',
    lg: 'w-[140px] h-[140px]',
};

export const Avatar: React.FC<AvatarProps> = ({
    imageSrc,
    name,
    description,
    onAvatarClick,
    className = '',
    size = 'md',
}) => {
    return (
        <div className={`flex flex-col items-center ${className}`}>
            <button
                onClick={onAvatarClick}
                className={`${sizeClasses[size]} rounded-full cursor-pointer`}
            >
                <img
                    src={imageSrc}
                    alt={name}
                    className="w-full h-full rounded-full object-cover"
                />
            </button>

            <div className="mt-3.5 text-center">
                <span className="font-semibold text-md text-transparent bg-clip-text bg-accent to-[125%]">
                    {name}
                </span>
                {description && (
                    <>
                        <span className="font-primary text-text-secondary"> | </span>
                        <span className="font-primary text-text-secondary">{description}</span>
                    </>
                )}
            </div>
        </div>
    );
};
