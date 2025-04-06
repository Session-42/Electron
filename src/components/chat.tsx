import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Artist } from '~/types/artist';
import PageNotFound from '~/components/page-not-found';
import ChatMain from '~/components/chat/chat-main';
import { useThreadMessages, useThread } from '~/hooks/chat/use-chat';
import { RecentProductionsSidebar } from '~/components/sidebars/recent-productions-sidebar';
import { useLayout } from '~/contexts/layout-context';
import { LoadingSpinner } from '~/components/ui/loading-spinner';
import { useArtifactNotifications } from '../hooks/use-artifact-notifications';
import { Fragment, ThreadDetails, Message } from '../types/chat.types';

interface ChatPageProps {
    initialMessage?: string;
    selectedArtist: Artist;
    onInitialMessageSent: () => void;
}

export default function ChatPage({
    selectedArtist,
    initialMessage,
    onInitialMessageSent,
}: ChatPageProps) {
    const { threadId } = useParams<{ threadId: string }>();
    const { data: messages = [], isLoading: isMessagesLoading } = useThreadMessages(threadId);
    const {
        data: thread = {},
        isLoading: isThreadLoading,
        isError: isThreadError,
    } = useThread(threadId ?? '');

    const [threadExists, setThreadExists] = useState(false);
    const { setRightSidebar } = useLayout();
    const navigate = useNavigate();

    // Initialize sidebar
    useEffect(() => {
        setRightSidebar(<RecentProductionsSidebar />);
    }, []);

    // Check if thread exists
    useEffect(() => {
        if (!isThreadLoading) {
            if (!isThreadError) {
                setThreadExists(true);
            } else {
                setThreadExists(false);
            }
        }
    }, [thread, isThreadLoading, isThreadError]);

    // Use the artifact notifications hook to detect and notify about new artifacts
    useArtifactNotifications(messages);

    if (isMessagesLoading || isThreadLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isThreadLoading && !threadExists) {
        return (
            <PageNotFound
                title="Oops!"
                subtitle="We can't seem to tune into this chat."
                buttonText="Take Me Home"
                onBackClick={() => navigate('/')}
            />
        );
    }

    if (!threadId || !thread) {
        navigate('/');
        return;
    }

    return (
        <ChatMain
            selectedArtist={selectedArtist}
            thread={thread}
            messages={messages}
            initialMessage={initialMessage}
            onInitialMessageSent={onInitialMessageSent}
        />
    );
}
