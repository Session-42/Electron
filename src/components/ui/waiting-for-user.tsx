import React from 'react';
import { Hourglass } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface WaitingForUserFragmentProps {
    isVisible: boolean;
}

export const WaitingForUser: React.FC<WaitingForUserFragmentProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0, translateY: -4 }}
                animate={{ height: 32, opacity: 1, translateY: 0 }}
                exit={{ height: 0, opacity: 0, translateY: -4, marginBottom: 0 }}
                transition={{
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1],
                }}
                className="bg-background-tertiary rounded-md overflow-hidden"
                style={{ marginTop: '-1px' }}
            >
                <div className="flex items-center gap-2 px-4 h-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    >
                        <Hourglass className="h-3.5 w-3.5 text-text-muted" />
                    </motion.div>
                    <span className="text-sm text-text-muted font-primary">
                        Waiting for user...
                    </span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
