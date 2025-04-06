import { useState, useEffect, useRef } from 'react';

export function useWindowSize() {
    const timeout = useRef<NodeJS.Timeout | undefined>(undefined);
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

        window.addEventListener('resize', () => {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(handleResize, 50);
        });
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}
