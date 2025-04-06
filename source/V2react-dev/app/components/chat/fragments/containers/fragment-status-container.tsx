import React from 'react';
import { motion } from 'framer-motion';

interface FragmentStatusContainerProps {
    children: React.ReactNode;
    isLoading?: boolean;
}

export const FragmentStatusContainer: React.FC<FragmentStatusContainerProps> = ({
    children,
    isLoading = false,
}) => {
    return (
        <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
        >
            <div className="flex items-center w-full">
                <div className="h-[1px] bg-border-secondary flex-1" />
                <div className="mx-4 shadow-sm rounded-full bg-background-tertiary relative overflow-hidden">
                    <div className="rounded-full px-6 py-1 text-center text-text-primary text-xs font-primary prose prose-sm max-w-none bg-background-secondary text-text-primary shadow-[inset_0_1px_1px_rgba(0,0,0,0.05)]">
                        {children}
                    </div>

                    {isLoading && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent"
                            style={{ zIndex: 0 }}
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: 'linear',
                            }}
                        />
                    )}
                </div>
                <div className="h-[1px] bg-border-secondary flex-1" />
            </div>
        </motion.div>
    );
};

export default FragmentStatusContainer;
