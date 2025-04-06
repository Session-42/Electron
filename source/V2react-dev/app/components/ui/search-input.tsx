import React from 'react';
import { cn } from '~/utils/utils';
import { Input, InputProps } from './input';

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <Input
                className={cn(
                    'h-[47px] rounded-[23px] border-black/[0.13] bg-background-secondary',
                    'font-primary text-sm placeholder:text-black/50',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
SearchInput.displayName = 'SearchInput';
