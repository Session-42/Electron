import { useEffect, useState } from 'react';
import { ArtistPane } from '~/components/artist/artist-pane';
import { Artist } from '~/types/artist';
import { useLayout } from '~/contexts/layout-context';
import { useIsMobile } from '~/hooks/use-is-mobile';
import { useNavigate, useParams } from 'react-router';
import PageNotFound from '~/components/page-not-found';
import { useRecommendedArtists } from '~/hooks/use-recommended-artists';
import { RecentProductionsSidebar } from '~/components/sidebars/recent-productions-sidebar';

interface ArtistInterfaceInputProps {
    onNewChatRequest: (message: string) => Promise<void>;
}

const ArtistInterface = ({ onNewChatRequest }: ArtistInterfaceInputProps) => {
    const { artistId } = useParams<{ artistId: string }>();
    const { artists, isLoading } = useRecommendedArtists();
    const [selectedArtist, setSelectedArtist] = useState<Artist | undefined>();
    const { setRightSidebar, clearRightSidebar } = useLayout();
    const [isArtistExists, setIsArtistExists] = useState(true);
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    // Update sidebar content when artist or chats change
    useEffect(() => {
        const artistObj = artists.find((artist) => artist.id === artistId);
        if (artistObj) {
            setSelectedArtist(artistObj);
            setRightSidebar(<RecentProductionsSidebar />);
            setIsArtistExists(true);
        } else {
            setIsArtistExists(false);
        }
    }, [artistId, artists]);

    const handleChatRequest = async (message: string) => {
        if (isMobile) {
            clearRightSidebar();
        }
        await onNewChatRequest(message);
    };

    // Main content
    return !isLoading ? (
        selectedArtist && isArtistExists ? (
            <ArtistPane selectedArtist={selectedArtist} onNewChatRequest={handleChatRequest} />
        ) : (
            <PageNotFound
                title="Oops!"
                subtitle="Looks like this artist isn't part of our ensemble."
                onBackClick={() => navigate('/')}
            />
        )
    ) : (
        <></>
    );
};

export default ArtistInterface;
