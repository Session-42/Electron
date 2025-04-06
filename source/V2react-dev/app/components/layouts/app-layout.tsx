import { ReactNode } from 'react';
import { useLayout } from '~/contexts/layout-context';
import { useIsMobile } from '~/hooks/use-is-mobile';
import { Menu, PanelRightClose, PanelRightOpen } from 'lucide-react';

interface AppLayoutProps {
    children: ReactNode;
    leftSidebar?: ReactNode;
}

export function AppLayout({ children, leftSidebar }: AppLayoutProps) {
    const {
        isLeftSidebarOpen,
        isRightSidebarOpen,
        toggleLeftSidebar,
        toggleRightSidebar,
        rightSidebarComponent,
    } = useLayout();
    const isMobile = useIsMobile();

    function closeSidebars() {
        if (isLeftSidebarOpen) {
            toggleLeftSidebar();
        }
        if (isRightSidebarOpen) {
            toggleRightSidebar();
        }
    }

    return (
        <>
            {/* Mobile left sidebar toggle */}
            {!isLeftSidebarOpen && isMobile && (
                <button
                    onClick={toggleLeftSidebar}
                    className="fixed left-4 top-4 p-2 rounded-full bg-background-tertiary shadow-md hover:bg-gray-50 transition-colors z-50"
                >
                    <Menu className="w-5 h-5" />
                </button>
            )}

            {/* Left Sidebar */}
            {leftSidebar && (
                <div
                    className={`fixed flex h-full left-0 transition-transform duration-300 z-50 ${
                        isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {leftSidebar}

                    {/* Mobile left sidebar close button */}
                    {isLeftSidebarOpen && isMobile && (
                        <div className="-ml-5">
                            <button
                                onClick={toggleLeftSidebar}
                                className="mt-4 p-2 rounded-full bg-background-tertiary shadow-md hover:bg-gray-50 transition-colors z-50"
                            >
                                <Menu className="w-5 h-5 rotate-90" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Main content */}
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                className={
                    'flex flex-col justify-between items-center w-full h-full transition-all duration-300 overflow-x-hidden'
                }
                onClick={() => isMobile && closeSidebars()}
            >
                {children}
            </div>

            {/* Right Sidebar */}
            <div
                className={`flex fixed top-0 right-0 h-full z-50 transition-transform duration-300 ${
                    isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Mobile right sidebar close button */}
                {isRightSidebarOpen && isMobile && (
                    <div className="-mr-5 z-50">
                        <button
                            onClick={toggleRightSidebar}
                            className="mt-4 p-2 rounded-full bg-background-tertiary shadow-md hover:bg-gray-50 transition-colors"
                        >
                            <PanelRightClose className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {rightSidebarComponent}
            </div>

            {/* Mobile right sidebar toggle */}
            {!isRightSidebarOpen && rightSidebarComponent && (
                <button
                    onClick={toggleRightSidebar}
                    className="fixed right-4 top-4 p-2 rounded-full bg-background-tertiary shadow-md hover:bg-gray-50 transition-colors z-50"
                >
                    <PanelRightOpen size={20} />
                </button>
            )}
        </>
    );
}
