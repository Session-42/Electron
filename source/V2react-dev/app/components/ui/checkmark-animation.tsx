import { motion } from 'framer-motion';

interface CheckmarkAnimationProps {
    message: string;
}

export const CheckmarkAnimation = ({ message }: CheckmarkAnimationProps) => {
    return (
        <motion.div
            className="flex flex-col items-center space-y-3 whitespace-pre-line"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-16 h-16 rounded-full bg-accent text-white dark:text-black flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                }}
            >
                <motion.svg
                    className="w-10 h-10 text-gray-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                    />
                </motion.svg>
            </motion.div>
            <motion.p
                className="text-transparent bg-clip-text bg-accent text-sm font-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
            >
                {message}
            </motion.p>
        </motion.div>
    );
};
