import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorPopupProps {
    message: string;
    isVisible: boolean;
}

export const ErrorPopup = ({ message, isVisible }: ErrorPopupProps) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-x-0 bottom-full mb-4 flex justify-center"
                >
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 flex items-center gap-2 whitespace-nowrap">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-red-500 font-primary">{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
