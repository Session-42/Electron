import React, { useState, useRef, useEffect } from 'react';

export function TruncatedText({
    text,
    maxLength = 20,
    className = '',
}: {
    text: string;
    maxLength?: number;
    className?: string;
}) {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        // Check if text is overflowing
        if (textRef.current) {
            setIsOverflowing(text.length > maxLength);
        }
    }, [text, maxLength]);

    const truncatedText = isOverflowing ? `${text.substring(0, maxLength)}...` : text;

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => isOverflowing && setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
        >
            <div ref={textRef} className={className}>
                {truncatedText}
            </div>

            {isTooltipVisible && isOverflowing && (
                <div className="absolute z-10 bg-border-secondary text-text-primary text-xs rounded py-1 px-2 left-0 -top-8 whitespace-nowrap">
                    {text}
                </div>
            )}
        </div>
    );
}
