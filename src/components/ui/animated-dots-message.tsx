import { useState, useEffect } from 'react';

export const AnimatedDotsMessage = ({
    message,
    intervalInMs = 1000,
}: {
    message: string;
    intervalInMs?: number;
}) => {
    const [dotCount, setDotCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((prev) => (prev >= 3 ? 0 : prev + 1));
        }, intervalInMs);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-primary leading-loose text-black flex">
            <span>{message}</span>
            <span className="w-[24px] relative">
                <span
                    className={`absolute left-0 transition-opacity duration-200 ${dotCount >= 1 ? 'opacity-100' : 'opacity-0'}`}
                >
                    .
                </span>
                <span
                    className={`absolute left-[0.3em] transition-opacity duration-200 ${dotCount >= 2 ? 'opacity-100' : 'opacity-0'}`}
                >
                    .
                </span>
                <span
                    className={`absolute left-[0.6em] transition-opacity duration-200 ${dotCount >= 3 ? 'opacity-100' : 'opacity-0'}`}
                >
                    .
                </span>
            </span>
        </div>
    );
};
