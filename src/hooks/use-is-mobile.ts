import { useWindowSize } from './use-window-size';

const breakpoints = {
    mobile: 640,
    tablet: 1024,
    content: 1300,
    chatSummary: 1350,
};

export function useIsMobile() {
    const { width } = useWindowSize();
    return width <= breakpoints.content;
}
