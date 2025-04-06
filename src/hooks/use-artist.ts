import { useQuery } from '@tanstack/react-query';
import { artistApi } from '~/utils/api';
import type { Artist } from '~/types/artist';

export function useArtist(artistId: string) {
    // Fetch artist query
    const {
        data: artist,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['artist', artistId],
        queryFn: async () => {
            const response = await artistApi.get(artistId);
            return {
                id: response.data._id,
                name: response.data.name,
                imageUrl: response.data.imageUrl || '/assets/dj.png',
            } as Artist;
        },
        enabled: Boolean(artistId),
    });

    return {
        artist,
        isLoading,
        error,
        refreshArtist: refetch,
    };
}
