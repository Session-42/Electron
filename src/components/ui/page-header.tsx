import React from 'react';
import { cn } from '~/utils/utils';

interface PageHeaderProps {
    title: string;
    boldText?: string;
    subtitle?: string;
    className?: string;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
    ({ title, boldText, subtitle, className }, ref) => {
        return (
            <div ref={ref} className={cn('flex flex-col items-center mt-[70px]', className)}>
                {subtitle && (
                    <div className="mt-[22px] text-center">
                        <span className="font-poppins-light font-semibold text-[#d91a5a]">
                            {subtitle}
                        </span>
                        <span className="text-[#d91a5a]"> | </span>
                        <span className="font-poppins-light font-light">HitCraft's AI bot</span>
                    </div>
                )}

                <div className="mt-[42px] text-center">
                    <h1 className="text-4xl font-poppins-light font-light">
                        {title} {boldText && <span className="font-semibold">{boldText}</span>}
                    </h1>
                </div>
            </div>
        );
    }
);
PageHeader.displayName = 'PageHeader';
