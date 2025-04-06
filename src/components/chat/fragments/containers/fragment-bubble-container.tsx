import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '~/utils/utils';
import { useAuth } from '~/contexts/auth-context';
import { useSettings } from '~/contexts/settings-context';

interface FragmentBubbleContainerProps {
    role: 'user' | 'assistant';
    children: React.ReactNode;
}

export const FragmentBubbleContainer: React.FC<FragmentBubbleContainerProps> = ({
    role,
    children,
}) => {
    const { descope } = useAuth();
    const { settings } = useSettings();
    const userImage = descope.user?.picture || '/assets/default-avatar.svg';

    return (
        <>
            <motion.div
                className="flex space-x-3"
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    ease: 'easeOut',
                }}
            >
                <div
                    className={cn(
                        'rounded-lg relative',
                        role === 'user'
                            ? 'bg-primary max-w-[80%]'
                            : cn(
                                  'shadow-[0_2px_4px_0_rgba(0,0,0,0.07)] bg-tertiary w-full',
                                  settings.showFragmentBorder &&
                                      'dark:border-l-2 dark:border-l-accent'
                              )
                    )}
                >
                    {role === 'user' && (
                        <div className="absolute w-8 h-8 rounded-full overflow-hidden left-[12px] top-3">
                            <img
                                src={userImage}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className={cn('p-4', role === 'user' ? 'pl-[52px]' : 'pl-[16px]')}>
                        <div className="text-text-primary prose prose-sm max-w-full font-primary">
                            {children}
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default FragmentBubbleContainer;
