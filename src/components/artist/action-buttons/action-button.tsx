import React from 'react';
import { motion } from 'framer-motion';

export interface ActionButtonProps {
    title: string;
    icon: React.ReactNode;
    onClick: () => void;
    isLoading?: boolean;
    iconClassName?: string;
    className?: string;
    disabled?: boolean;
    isProduction?: boolean;
}

export function ActionButton({
    title,
    icon,
    onClick,
    iconClassName = '',
    className = '',
    disabled = false,
    isProduction = false,
}: ActionButtonProps) {
    return (
        <div className="transform transition-all active:scale-95">
            <motion.button
                onClick={onClick}
                className={`
                flex items-center justify-center
                w-full
                h-full
                space-x-2 min-w-36 max-w-56 max-h-10
                rounded-full py-1 px-2
                bg-background-secondary
                ${disabled ? 'opacity-10' : 'opacity-90'}
                ${className}
            `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    className={`
                    flex items-center justify-center
                    w-6 h-6
                    ${iconClassName}
                    ${disabled ? 'opacity-20' : ''}
                `}
                    transition={{ duration: 0.5 }}
                >
                    {icon}
                </motion.div>
                {isProduction ? (
                    <div className={`text-xs pr-3 font-primary text-accent whitespace-nowrap`}>
                        {title}
                    </div>
                ) : (
                    <span
                        className={`text-xs pr-3 font-primary whitespace-nowrap ${disabled ? 'opacity-20' : ''}`}
                    >
                        {title}
                    </span>
                )}
            </motion.button>
        </div>
    );
}
