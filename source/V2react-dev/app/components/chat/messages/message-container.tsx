import React, { forwardRef } from 'react';

interface MessageContainerProps {
    children: React.ReactNode;
    className?: string;
}

export const MessageContainer = forwardRef<HTMLDivElement, MessageContainerProps>(
    ({ children, className = 'flex flex-col gap-4' }, ref) => {
        return (
            <div ref={ref} className={className}>
                {children}
            </div>
        );
    }
);

export default MessageContainer;
