import { useEffect, useState, useMemo, useCallback } from 'react';
import { Route, Navigate, useNavigate, Routes, useLocation } from 'react-router';
import { AppLayout } from '~/components/layouts/app-layout';
import OnboardingDialog from '~/components/profile/onboarding-dialog';
import ArtistInterface from './artist';
import ChatPage from './chat';
import ProfilePage from './profile';
import { useLayout } from '~/contexts/layout-context';
import { useIsMobile } from '~/hooks/use-is-mobile';
import { useCreateThread } from '~/hooks/chat/use-chat';
import { useArtist } from '~/hooks/use-artist';
import StripeRedirectPage from './stripe-redirect';
import { useAuth } from '~/contexts/auth-context';
import { LeftSidebar } from '~/components/sidebars/left-sidebar';

export const HITCRAFT_ARTIST_ID = '67618ad67dc13643acff6a25';

const HitcraftMainPage = () => {
    const navigate = useNavigate();
    const { closeLeftSidebar } = useLayout();
    const { descope, logout } = useAuth();
    const [initialMessage, setInitialMessage] = useState<string | undefined>(undefined);
    const { artist } = useArtist(HITCRAFT_ARTIST_ID);
    const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>(undefined);
    const [pendingThreadId, setPendingThreadId] = useState<string | undefined>(undefined);
    const isMobile = useIsMobile();
    const createThread = useCreateThread();
    const location = useLocation();

    // Calculate user data once
    const userName = useMemo(
        () => descope.user?.name || descope.user?.email?.split('@')[0] || 'User',
        [descope.user?.name, descope.user?.email]
    );

    const userImage = useMemo(
        () => descope.user?.picture || '/assets/default-avatar.svg',
        [descope.user?.picture]
    );

    const userEmail = useMemo(() => descope.user?.email || '', [descope.user?.email]);

    useEffect(() => {
        const { pathname } = location;
        setSelectedThreadId(pathname.includes('chats') ? pathname.split('/').pop() : undefined);
    }, [location]);

    const handleLogout = useCallback(async () => {
        await logout();
        navigate('/login');
    }, [logout, navigate]);

    const startChatFromScratch = useCallback(
        async (initialMessage: string) => {
            if (!artist) return;

            try {
                const newThread = await createThread.mutateAsync(artist.id);
                setInitialMessage(initialMessage);
                if (isMobile) {
                    closeLeftSidebar();
                }
                navigate(`/chats/${newThread.threadId}`);
            } catch (error) {
                console.error('Failed to start chat:', error);
            }
        },
        [artist, isMobile]
    );

    const handleThreadSelect = useMemo(() => {
        return (threadId: string) => {
            setSelectedThreadId(threadId);
            navigate(`/chats/${threadId}`);

            if (isMobile) {
                closeLeftSidebar();
            }
        };
    }, [location.pathname, isMobile]);

    // Memoize the sidebar
    const leftSidebar = useMemo(
        () => (
            <LeftSidebar
                artistId={HITCRAFT_ARTIST_ID}
                selectedThreadId={selectedThreadId}
                onThreadSelect={handleThreadSelect}
                userName={userName}
                userImage={userImage}
                onLogout={handleLogout}
            />
        ),
        [selectedThreadId, handleThreadSelect, userName, userImage, handleLogout]
    );

    // Memoize the routes configuration
    const routes = useMemo(
        () =>
            artist && (
                <Routes>
                    <Route path="/" element={<Navigate to={`/artists/${HITCRAFT_ARTIST_ID}`} />} />
                    <Route
                        path="/profile"
                        element={
                            <ProfilePage
                                userName={userName}
                                userImage={userImage}
                                userEmail={userEmail}
                            />
                        }
                    />
                    <Route
                        path="/chats/:threadId"
                        element={
                            <ChatPage
                                selectedArtist={artist}
                                initialMessage={initialMessage}
                                onInitialMessageSent={() => setInitialMessage(undefined)}
                            />
                        }
                    />
                    <Route path="/stripe/success" element={<StripeRedirectPage />} />
                    <Route
                        path="/artists/:artistId"
                        element={<ArtistInterface onNewChatRequest={startChatFromScratch} />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            ),
        [artist, initialMessage, userName, userImage]
    );

    return (
        <AppLayout leftSidebar={leftSidebar}>
            {routes}
            <OnboardingDialog userId={descope.user?.customAttributes?.v2UserId || ''} />
        </AppLayout>
    );
};

export default HitcraftMainPage;
