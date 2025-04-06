import { motion } from 'framer-motion';

interface SuccessAnimationProps {
    message?: string;
    className?: string;
}

export default function SuccessAnimation({
    message = 'Success!',
    className = '',
}: SuccessAnimationProps) {
    return (
        <div className={`flex flex-col items-center ${className}`}>
            <motion.div
                className="relative w-16 h-16 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Expanding ring animation */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-green-500/20"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    transition={{
                        duration: 0.4,
                        times: [0, 0.6, 1],
                        ease: 'easeOut',
                    }}
                />

                {/* Success circle background */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-[#22c55e] flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        duration: 0.4,
                    }}
                >
                    {/* Checkmark SVG */}
                    <motion.svg
                        className="w-8 h-8 text-text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.15 }}
                    >
                        <motion.path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{
                                delay: 0.25,
                                duration: 0.3,
                                ease: 'easeOut',
                            }}
                        />
                    </motion.svg>
                </motion.div>

                {/* Particles effect */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-green-500"
                        initial={{
                            scale: 0,
                            x: '-50%',
                            y: '-50%',
                            top: '50%',
                            left: '50%',
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            x: `${Math.cos(i * (Math.PI / 4)) * 60}px`,
                            y: `${Math.sin(i * (Math.PI / 4)) * 60}px`,
                        }}
                        transition={{
                            duration: 0.4,
                            delay: 0.1,
                            ease: 'easeOut',
                        }}
                    />
                ))}
            </motion.div>

            {/* Success text */}
            <motion.p
                className="text-lg font-medium bg-gradient-to-r from-[#8a44c8] to-[#df0c39] bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.35,
                    duration: 0.3,
                    ease: 'easeOut',
                }}
            >
                {message}
            </motion.p>
        </div>
    );
}
