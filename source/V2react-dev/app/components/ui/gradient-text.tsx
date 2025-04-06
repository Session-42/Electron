import React from 'react';
import { cn } from '~/utils/utils';
import { Gradient } from './gradient';

interface GradientTextProps extends React.HTMLAttributes<HTMLDivElement> {
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    hoverGradient?: boolean;
}

export const GradientText = React.forwardRef<HTMLDivElement, GradientTextProps>(
    ({ className, weight = 'normal', hoverGradient = false, children, ...props }, ref) => {
        const weightClasses = {
            light: 'font-light',
            normal: '',
            medium: 'font-medium',
            semibold: 'font-poppins-semibold',
            bold: 'font-semibold',
        };

        return (
            <Gradient
                ref={ref}
                type="text"
                className={cn(
                    'font-poppins-light',
                    'whitespace-nowrap overflow-hidden text-ellipsis',
                    'transition-all duration-75 ease-in-out',
                    hoverGradient
                        ? 'text-black hover:bg-clip-text hover:text-transparent'
                        : 'bg-clip-text text-transparent',
                    weightClasses[weight],
                    className
                )}
                {...props}
            >
                {children}
            </Gradient>
        );
    }
);

GradientText.displayName = 'GradientText';
