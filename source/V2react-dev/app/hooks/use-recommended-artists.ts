import { useState, useEffect } from 'react';
import { Artist } from '~/types/artist';
import { artistApi } from '~/utils/api';

// Custom hook for managing recommended musicians
export function useRecommendedArtists() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch musicians on component mount
    useEffect(() => {
        fetchRecommendedArtists();
    }, []);

    const fetchRecommendedArtists = async () => {
        try {
            setIsLoading(true);
            const response = await artistApi.list();

            // Transform API response to match Artist interface
            const transformedArtists: Artist[] = (
                Object.values(response.data.artists) as Artist[]
            ).map((artist: Artist) => ({
                id: artist.id,
                name: artist.name,
                imageUrl: artist.imageUrl || 'assets/dj.png',
            }));

            setArtists(transformedArtists);
            setError(null);
        } catch (err) {
            setError('Failed to load recommended musicians');
            console.error('Error fetching musicians:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        artists,
        isLoading,
        error,
        refreshArtists: fetchRecommendedArtists,
    };
}
