import React, { useRef, useEffect, useState } from 'react';
import { SendIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '~/hooks/use-is-mobile';
import { useTheme } from '~/contexts/theme-context';

const MAX_CHARS = 2000;
const MIN_HEIGHT = 48;
const MAX_HEIGHT = 300;

interface MessageInputBarProps {
    message: string;
    onMessageChange: (message: string) => void;
    onSubmit: (message: string) => Promise<void>;
    isLoading?: boolean;
}

const MessageInputBar = React.forwardRef<HTMLTextAreaElement, MessageInputBarProps>(
    (props, ref) => {
        const { message, onMessageChange, onSubmit, isLoading } = props;
        const { mode } = useTheme();
        const textareaRef = useRef<HTMLTextAreaElement>(null);
        const [height, setHeight] = useState(MIN_HEIGHT);
        const hasValidMessage = message.trim().length > 0;

        useEffect(() => {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(textareaRef.current);
                } else if (ref) {
                    ref.current = textareaRef.current;
                }
            }
        }, [ref]);

        useEffect(() => {
            const textarea = textareaRef.current;
            if (textarea) {
                textarea.style.height = 'auto';
                const scrollHeight = textarea.scrollHeight;
                const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
                setHeight(newHeight);
                textarea.style.height = `${newHeight}px`;
            }
        }, [message]);

        const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;
            if (newValue.length <= MAX_CHARS) {
                onMessageChange(newValue);
            }
        };

        const isMobile = useIsMobile();

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (hasValidMessage && !isLoading) {
                await onSubmit(message);
            }
        };

        const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter') {
                if (isMobile && !e.metaKey) {
                    // Mobile Enter + no shift: new line
                    return;
                }

                if (!isMobile && e.shiftKey) {
                    // Desktop Enter + shift: new line
                    return;
                }

                // Desktop Enter only: Submit form
                e.preventDefault();
                if (hasValidMessage && !isLoading) {
                    await onSubmit(message);
                }
            }
        };

        return (
            <motion.form onSubmit={handleSubmit} className="w-full flex justify-center">
                <motion.div className="w-full">
                    <div className="flex flex-col">
                        <motion.div
                            className="flex-1 flex pr-1 items-center bg-background-secondary rounded-[24px] border border-border-secondary"
                            initial={{ width: '90%' }}
                            animate={{ width: '100%' }}
                            transition={{ type: 'spring', duration: 0.8 }}
                        >
                            <motion.textarea
                                ref={textareaRef}
                                value={message}
                                onChange={handleMessageChange}
                                onKeyDown={handleKeyDown}
                                placeholder={
                                    isMobile
                                        ? 'What can I help you with today?'
                                        : 'What part of your creation can I help with?'
                                }
                                className="px-5 py-4 flex-1 outline-none text-sm font-primary text-base text-text-primary bg-transparent placeholder-text-muted resize-none overflow-y-auto leading-normal"
                                style={{
                                    height: `${height}px`,
                                    maxHeight: `${MAX_HEIGHT}px`,
                                }}
                                disabled={isLoading}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                rows={1}
                            />
                            <div className="flex items-center pr-1">
                                <motion.button
                                    type="submit"
                                    className={`rounded-full w-[37px] h-[37px] inline-flex items-center justify-center bg-accent ${
                                        !hasValidMessage || isLoading
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    disabled={!hasValidMessage || isLoading}
                                    whileHover={hasValidMessage && !isLoading ? { scale: 1.1 } : {}}
                                    whileTap={hasValidMessage && !isLoading ? { scale: 0.95 } : {}}
                                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                >
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={isLoading ? 'loader' : 'send'}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.4 }}
                                            className="flex items-center justify-center w-full h-full"
                                        >
                                            {isLoading ? (
                                                <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <motion.div
                                                    className="pr-1"
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <SendIcon
                                                        className={`ml-[0.5px] h-4 w-4 ${mode === 'dark' ? 'text-black' : 'text-white'} rotate-45`}
                                                    />
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.form>
        );
    }
);

export default MessageInputBar;
