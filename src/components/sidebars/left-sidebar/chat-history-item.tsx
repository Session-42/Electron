import { Loader2, MessageCircleMoreIcon, MoreVertical } from 'lucide-react';
import { useState, useRef } from 'react';
import { useClickOutside } from '~/hooks/use-click-outside';
import { ThreadDetailsWithId } from '~/types/chat.types';
import { useTheme } from '~/contexts/theme-context';

const ChatBubbleIcon = () => {
    const { mode } = useTheme();
    return (
        <img
            src={mode === 'dark' ? '/assets/preset-dark.svg' : '/assets/preset-light.svg'}
            alt="Chat Bubble"
            className="w-4 h-4"
        />
    );
};

export const ChatHistoryItem = ({
    thread,
    isSelected,
    onClick,
    onDelete,
}: {
    thread: ThreadDetailsWithId;
    isSelected: boolean;
    onClick: () => void;
    onDelete: (thread: ThreadDetailsWithId) => void;
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const ref = useRef(null);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsDeleting(true);
        onDelete(thread);
        setIsMenuOpen(false);
    };

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    useClickOutside(ref, () => {
        setIsMenuOpen(false);
    });

    return (
        <div className={`relative w-full group ${isDeleting ? 'opacity-50' : ''}`}>
            <div className="w-[calc(100%+12px)] -ml-3">
                <div
                    role="button"
                    onClick={onClick}
                    className={`w-full cursor-pointer rounded-full transition-colors ${
                        isSelected
                            ? 'dark:bg-border-secondary dark:border-border-secondary bg-border-primary border-border-primary border-2'
                            : 'dark:group-hover:bg-border-secondary group-hover:bg-border-primary border-2 border-transparent'
                    }`}
                    aria-disabled={isDeleting}
                >
                    <div className="flex items-center h-[38px] pl-4 w-full">
                        <ChatBubbleIcon />
                        <span className="font-primary text-xs text-text-primary truncate pr-[5px] flex-grow px-2">
                            {thread.title || 'Untitled Conversation'}
                        </span>
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 text-text-primary animate-spin mr-4" />
                        ) : (
                            <button
                                onClick={handleMenuClick}
                                className="relative mr-4 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-200 cursor-pointer"
                            >
                                <MoreVertical className="w-4 h-4 text-text-primary" />
                            </button>
                        )}
                        {isMenuOpen && !isDeleting && (
                            <div
                                ref={ref}
                                className="absolute right-0 top-8 bg-background-tertiary rounded-full shadow-lg border border-border-secondary z-10"
                            >
                                <button
                                    onClick={handleDeleteClick}
                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-background-primary transition-colors font-primary cursor-pointer first:rounded-t-full last:rounded-b-full"
                                >
                                    Delete chat
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
