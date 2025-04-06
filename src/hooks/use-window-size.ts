import { useState, useEffect, useRef } from 'react';

export function useWindowSize() {
    const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        const resizeHandler = () => {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(handleResize, 50);
        };

        window.addEventListener('resize', resizeHandler);
        handleResize();

        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    return windowSize;
}
