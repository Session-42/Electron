import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useIsMobile } from '~/hooks/use-is-mobile';
import { RecentProductionsSidebar } from '~/components/sidebars/recent-productions-sidebar';

// Type for right sidebar component props
export interface RightSidebarProps {
    title: string;
    icon?: string;
    children?: ReactNode;
}

interface LayoutContextType {
    // Sidebar states
    isLeftSidebarOpen: boolean;
    isRightSidebarOpen: boolean;

    // Right sidebar component state
    rightSidebarComponent: ReactNode | null;

    // Toggle functions
    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;

    // Direct control functions
    openLeftSidebar: () => void;
    closeLeftSidebar: () => void;
    openRightSidebar: () => void;
    closeRightSidebar: () => void;

    // Right sidebar component control
    setRightSidebar: (component: ReactNode) => void;
    setRightSidebarAndOpen: (component: ReactNode) => void;
    clearRightSidebar: () => void;
    openDefaultRightSidebar: (component: ReactNode) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

interface LayoutProviderProps {
    children: ReactNode;
}

export function LayoutProvider({ children }: LayoutProviderProps) {
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
    const [rightSidebarComponent, setRightSidebarComponent] = useState<ReactNode | null>(null);
    const isMobile = useIsMobile();
    const location = useLocation();

    useEffect(() => {
        if (isMobile) {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
        }
    }, [isMobile, location]);

    // Initialize sidebar states based on screen size
    useEffect(() => {
        if (isMobile) {
            setIsLeftSidebarOpen(false);
            setIsRightSidebarOpen(false);
        } else {
            setIsLeftSidebarOpen(true);
            setIsRightSidebarOpen(true);
        }
    }, [isMobile]);

    const toggleLeftSidebar = () => {
        if (isLeftSidebarOpen) {
            closeLeftSidebar();
        } else {
            openLeftSidebar();
        }
    };

    const toggleRightSidebar = () => {
        if (isRightSidebarOpen) {
            closeRightSidebar();
        } else {
            openRightSidebar();
        }
    };

    const openLeftSidebar = () => {
        setIsRightSidebarOpen(false);
        setIsLeftSidebarOpen(true);
    };

    const closeLeftSidebar = () => setIsLeftSidebarOpen(false);

    const openRightSidebar = () => {
        setIsLeftSidebarOpen(false);
        setIsRightSidebarOpen(true);
    };

    const closeRightSidebar = () => setIsRightSidebarOpen(false);

    const setRightSidebar = (component: ReactNode) => {
        setRightSidebarComponent(component);
    };

    const setRightSidebarAndOpen = (component: ReactNode) => {
        setRightSidebarComponent(component);
        setIsRightSidebarOpen(true);
    };

    const clearRightSidebar = () => {
        setRightSidebarComponent(null);
        setIsRightSidebarOpen(false);
    };

    const openDefaultRightSidebar = (component: ReactNode) => {
        setRightSidebarComponent(component);
        if (!isMobile) {
            setIsRightSidebarOpen(true);
        }
    };

    const value = {
        isLeftSidebarOpen,
        isRightSidebarOpen,
        rightSidebarComponent,
        toggleLeftSidebar,
        toggleRightSidebar,
        openLeftSidebar,
        closeLeftSidebar,
        openRightSidebar,
        closeRightSidebar,
        setRightSidebar,
        setRightSidebarAndOpen,
        clearRightSidebar,
        openDefaultRightSidebar,
    };

    return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}

export function useLayout() {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
}
