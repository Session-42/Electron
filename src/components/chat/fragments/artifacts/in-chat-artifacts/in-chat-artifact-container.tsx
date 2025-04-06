import React, { ReactNode } from 'react';

// Generic Artifact Container
interface ArtifactContainerProps {
    icon: ReactNode;
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

const ArtifactContainer: React.FC<ArtifactContainerProps> = ({
    icon,
    children,
    onClick,
    className = '',
}) => {
    return (
        <div
            role="button"
            tabIndex={0}
            className={`rounded-[8px] bg-background-primary border-[1.5px] border-border-secondary
            flex shadow-sm min-w-[200px] w-fit -ml-[4px] cursor-pointer ml-0 
            active:border-border-hover transition-all duration-100 
            active:scale-[0.99] ${className}`}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            <div className="py-3 px-4 flex items-center">{icon}</div>
            <div className="w-[1px] rounded-[3px] bg-border-secondary my-2" />
            <div className="py-3 px-4 flex flex-col">
                <div className="mb-1">{children}</div>
                <div className="text-xs text-text-muted">Click to open component</div>
            </div>
        </div>
    );
};

export default ArtifactContainer;
