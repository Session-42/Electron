import React from 'react';
import { cn } from '~/utils/utils';

interface AvatarWithStatusProps extends React.HTMLAttributes<HTMLDivElement> {
    imageSrc: string;
    alt: string;
    size?: 'sm' | 'md' | 'lg' | 'custom';
    glowing?: boolean;
    loading?: boolean;
}

export const AvatarWithStatus = React.forwardRef<HTMLDivElement, AvatarWithStatusProps>(
    (
        { imageSrc, alt, size = 'md', glowing = false, loading = false, className, ...props },
        ref
    ) => {
        const sizeClasses = {
            sm: 'w-16 h-16',
            md: 'w-[75px] h-[75px]',
            lg: 'w-[140px] h-[140px]',
            custom: 'w-[74px] h-[74px]',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex items-center justify-center',
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {glowing && (
                    <div className="absolute w-[110px] h-[110px] opacity-5 bg-gradient-to-r from-[#8a44c8] from-[-25%] to-[#df0c39] to-[125%] rounded-full" />
                )}

                {loading && (
                    <>
                        <div className="absolute inset-0 w-full h-full border-[3px] border-[rgba(138,68,200,0.08)] rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full border-[5px] border-transparent border-t-[#d91a5a] border-r-[#8a44c8] rounded-full animate-spin" />
                        </div>
                        <div className="absolute w-[110px] h-[110px] rounded-full animate-pulse bg-[radial-gradient(circle,rgba(138,68,200,0.08)_0%,transparent_70%)]" />
                    </>
                )}

                <div className="relative z-10 flex items-center justify-center w-full h-full">
                    <img
                        src={imageSrc}
                        alt={alt}
                        className="w-full h-full object-contain rounded-full filter drop-shadow-[0_0_1px_rgba(0,0,0,0.1)]"
                    />
                </div>
            </div>
        );
    }
);
AvatarWithStatus.displayName = 'AvatarWithStatus';
