import React from 'react';
import { cn } from '~/utils/utils';

type GradientType = 'text' | 'background';

interface WithGradientProps {
    children: React.ReactNode;
    type?: GradientType;
    className?: string;
}

const BASE_GRADIENT = 'bg-gradient-to-r from-[#8a44c8] from-[-25%] to-[#df0c39] to-[125%]';

const gradientClasses: Record<GradientType, string> = {
    background: BASE_GRADIENT,
    text: `${BASE_GRADIENT} bg-clip-text text-transparent`,
};

export const Gradient = React.forwardRef<HTMLDivElement, WithGradientProps>(
    ({ children, type = 'text', className, ...props }, ref) => {
        return (
            <span ref={ref} className={cn(gradientClasses[type], className)} {...props}>
                {children}
            </span>
        );
    }
);

Gradient.displayName = 'withGradient';
