import { SendHorizonal, Upload } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '~/hooks/use-is-mobile';
import { useTheme } from '~/contexts/theme-context';

const MAX_CHARS = 2000;
const MIN_HEIGHT = 24;
const MAX_HEIGHT = 150;

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    placeholder?: string;
    isLoading?: boolean;
    isWaitingForUser?: boolean;
    onUploadClick?: () => void;
    showUploadButton?: boolean;
}

export const ChatInput = ({
    onSendMessage,
    placeholder = 'Type a message...',
    isLoading = false,
    onUploadClick,
    showUploadButton = false,
}: ChatInputProps) => {
    const [message, setMessage] = useState('');
    const [height, setHeight] = useState(MIN_HEIGHT);
    const { mode } = useTheme();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const hasValidMessage = message.trim().length > 0;

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (
                document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA'
            ) {
                return;
            }
            if (e.ctrlKey || e.metaKey || e.altKey) {
                return;
            }
            if (e.key.length === 1) {
                textareaRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (hasValidMessage && !isLoading) {
            onSendMessage(message);
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = `${MIN_HEIGHT}px`;
                setHeight(MIN_HEIGHT);
            }
        }
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= MAX_CHARS) {
            setMessage(newValue);
        }
    };

    const isMobile = useIsMobile();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
                onSendMessage(message);
                setMessage('');
                if (textareaRef.current) {
                    textareaRef.current.style.height = `${MIN_HEIGHT}px`;
                    setHeight(MIN_HEIGHT);
                }
            }
        }
    };

    const getPlaceholder = () => {
        return placeholder;
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5 pl-4 pr-4 pt-2.5 pb-2.5 items-stretch cursor-text rounded-t-2xl bg-background-tertiary outline-none ring-0 focus-within:ring-1 focus-within:ring-border-secondary focus-within:shadow-sm">
                <div className="flex gap-2">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleMessageChange}
                        onKeyDown={handleKeyDown}
                        placeholder={getPlaceholder()}
                        className="flex-1 min-w-0 bg-transparent px-2 outline-none placeholder:text-text-muted font-primary resize-none overflow-y-auto leading-normal py-1.5"
                        style={{
                            height: `${height}px`,
                            maxHeight: `${MAX_HEIGHT}px`,
                        }}
                        rows={1}
                    />
                    <div className="flex items-center w-8">
                        {hasValidMessage && !isLoading && (
                            <button
                                type="submit"
                                className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-text-primary transition-all duration-200 opacity-100 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:scale-110 animate-in fade-in"
                            >
                                <SendHorizonal
                                    className={`ml-[2px] h-4 w-4 ${mode === 'dark' ? 'text-black' : 'text-white'} transition-transform duration-200 group-hover:scale-110`}
                                />
                            </button>
                        )}
                    </div>
                    {isLoading && (
                        <div className="flex items-center justify-center h-8 w-8 animate-in fade-in">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="px-2 text-sm text-text-primary font-primary">
                            HitCraft v0.7
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onUploadClick}
                            disabled={!showUploadButton}
                            className={`h-8 w-8 rounded-lg text-text-primary flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-transparent ${
                                showUploadButton ? 'bg-accent text-white dark:text-black' : ''
                            }`}
                        >
                            <Upload className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ChatInput;
