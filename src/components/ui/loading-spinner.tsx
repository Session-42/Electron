import { cn } from '~/utils/utils';

interface SpinnerProps {
    className?: string;
}

export const LoadingSpinner = ({ className }: SpinnerProps) => {
    return (
        <div
            className={cn(
                'w-16 h-16 rounded-full animate-[spin_1s_linear_infinite]',
                'border-4 border-transparent',
                'border-t-[var(--accent)] border-r-[var(--accent)]',
                className
            )}
        />
    );
};
