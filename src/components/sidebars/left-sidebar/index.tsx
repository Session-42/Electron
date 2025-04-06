import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { SearchBar } from '~/components/searchbar';
import Divider from '~/components/ui/divider';
import { useRecentThreads, useDeleteThread } from '~/hooks/chat/use-chat';
import { useClickOutside } from '~/hooks/use-click-outside';
import { ThreadDetailsWithId } from '~/types/chat.types';
import { ChatHistoryItem } from './chat-history-item';
import { NewButton } from './new-button';
import { UserSection } from './user-section';
import { Logo } from './logo';
import { Info } from 'lucide-react';

interface LeftSidebarProps {
    artistId?: string;
    onThreadSelect?: (threadId: string) => void;
    selectedThreadId?: string;
    userName: string;
    userImage: string;
    onLogout: () => Promise<void>;
}

export function LeftSidebar({
    artistId,
    onThreadSelect,
    selectedThreadId,
    userName,
    userImage,
    onLogout,
}: LeftSidebarProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();
    const { data: threads = {} } = useRecentThreads(artistId);
    const deleteThread = useDeleteThread();

    const handleDelete = async (thread: ThreadDetailsWithId) => {
        try {
            await deleteThread.mutateAsync(thread);
            if (thread.threadId === selectedThreadId) {
                navigate(`/artists/${artistId}`);
            }
        } catch (error) {
            console.error('Failed to delete thread:', error);
        }
    };

    const handleNewChat = () => {
        if (!artistId) return;
        try {
            navigate('/');
        } catch (error) {
            console.error('Failed to create new chat:', error);
        }
    };

    const handleProfile = () => {
        navigate('/profile');
        setIsMenuOpen(false);
    };

    // Create filtered and sorted thread list using useMemo
    const filteredThreadList = useMemo(() => {
        const threadList = Object.entries(threads)
            .map(([threadId, thread]) => ({
                ...thread,
                threadId,
            }))
            .sort(
                (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
            );

        if (!searchValue.trim()) {
            return threadList;
        }

        const searchTerm = searchValue.toLowerCase().trim();
        return threadList.filter(
            (thread) =>
                thread.title?.toLowerCase().includes(searchTerm) ||
                'untitled conversation'.includes(searchTerm)
        );
    }, [threads, searchValue]);

    const userSectionRef = useRef(null);
    useClickOutside(userSectionRef, () => {
        setIsMenuOpen(false);
    });

    return (
        <div className="flex flex-col justify-between h-full w-[320px] border-r-[1.5px] border-border-secondary transition-all duration-300 bg-background-secondary px-6">
            <div className="flex flex-col overflow-y-auto">
                <Logo className="pt-8" onClick={() => navigate('/')} />
                <div className="pl-4 pt-3 pb-5">
                    <NewButton onClick={handleNewChat} />
                </div>

                <div>
                    <SearchBar
                        placeholder="Search chats..."
                        value={searchValue}
                        className="w-full"
                        onChange={setSearchValue}
                    />
                </div>

                <Divider className="pb-6 pt-6" />

                <div className="flex items-center gap-2 pb-1">
                    <h2 className="text-xs font-semibold text-text-secondary truncate">
                        Chat History
                    </h2>
                    <div className="group relative flex items-center">
                        <Info className="w-3 h-3 text-text-muted" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-background-tertiary text-xs text-text-primary px-2 py-1 rounded-md whitespace-nowrap border border-border-secondary shadow-lg">
                            Showing last {filteredThreadList.length} chats
                        </div>
                    </div>
                </div>
                <div className="mb-20 pt-1 flex overflow-y-auto">
                    <div className="pl-3 overflow-y-auto space-y-1 pb-10 scrollbar-hide">
                        {filteredThreadList.length > 0 ? (
                            filteredThreadList.map((thread: ThreadDetailsWithId) => (
                                <ChatHistoryItem
                                    key={thread.threadId}
                                    thread={thread}
                                    isSelected={selectedThreadId === thread.threadId}
                                    onClick={() => {
                                        onThreadSelect?.(thread.threadId);
                                    }}
                                    onDelete={handleDelete}
                                />
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-4 font-primary text-sm">
                                No matching conversations found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col" ref={userSectionRef}>
                <Divider />
                <UserSection
                    userName={userName}
                    userImage={userImage}
                    isMenuOpen={isMenuOpen}
                    onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
                    onLogout={onLogout}
                    onProfile={handleProfile}
                />
            </div>
        </div>
    );
}
