import React from 'react';
import { useTheme } from '~/contexts/theme-context';
import { X } from 'lucide-react';
import { useLayout } from '~/contexts/layout-context';
import { RecentProductionsSidebar } from './recent-productions-sidebar';
import { useIsMobile } from '~/hooks/use-is-mobile';

interface GenericRightSidebarProps {
    title: string;
    icon?: string | React.ReactNode;
    children: React.ReactNode;
    showCloseButton?: boolean;
}

export function GenericRightSidebar({
    title,
    icon = '/assets/production.svg',
    children,
    showCloseButton = false,
}: GenericRightSidebarProps) {
    const { mode } = useTheme();
    const isMobile = useIsMobile();
    const { openDefaultRightSidebar, closeRightSidebar } = useLayout();

    const returnToDefaultRightSidebar = () => {
        if (!isMobile) {
            openDefaultRightSidebar(<RecentProductionsSidebar />);
        } else {
            closeRightSidebar();
        }
    };

    // Render icon based on type
    const renderIcon = () => {
        if (typeof icon === 'string') {
            const iconSrc =
                icon.includes('light') || icon.includes('dark')
                    ? icon
                    : mode === 'dark'
                      ? icon.replace('.svg', '-dark.svg')
                      : icon.replace('.svg', '-light.svg');
            return <img src={iconSrc} alt="Section icon" className="w-4 h-4 flex-shrink-0" />;
        }
        
        // Return the React component directly
        return <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{icon}</div>;
    };

    return (
        <div className="h-full w-[320px] flex flex-col bg-background-quaternary border-l-[1.5px] pt-9 shadow-md">
            {/* Title section */}
            <div className="relative flex items-center">
                {showCloseButton && (
                    <button
                        onClick={returnToDefaultRightSidebar}
                        className="absolute left-4 p-2 hover:bg-background-tertiary rounded-full transition-colors"
                        title="Close"
                    >
                        <X className="w-4 h-4 text-text-primary" />
                    </button>
                )}
                <div className="flex-1 flex justify-center">
                    <div className="flex items-center gap-3">
                        {renderIcon()}
                        <h1 className="text-base tracking-wide text-text-primary font-primary flex items-center">
                            <span className="whitespace-nowrap">{title.split(' ')[0]}</span>
                            <span className="font-semibold whitespace-nowrap ml-1">
                                {title.split(' ').length > 1 ? title.split(' ').slice(1).join(' ') : ''}
                            </span>
                        </h1>
                    </div>
                </div>
            </div>
            {/* Content */}
            {children}
        </div>
    );
}
