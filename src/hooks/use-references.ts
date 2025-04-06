import { useState, useEffect, useCallback } from 'react';
import { artistApi } from '~/utils/api';
import type { Reference } from '~/types/reference';

export function useReferences(artistId: string, options?: { referenceIds?: string[] }) {
    const [references, setReferences] = useState<Reference[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReferences = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await artistApi.getAllReferences(artistId, options);
            setReferences(response.data.references);
            setError(null);
        } catch (err) {
            setError('Failed to load references');
            console.error('Error fetching references:', err);
        } finally {
            setIsLoading(false);
        }
    }, [artistId]);

    useEffect(() => {
        if (!artistId) {
            setError('Artist ID is required');
            setIsLoading(false);
            return;
        }

        fetchReferences();
    }, [artistId, fetchReferences]);

    // Group references by genre
    const referencesByGenre = references.reduce<Record<string, Reference[]>>((acc, ref) => {
        if (!acc[ref.genre]) {
            acc[ref.genre] = [];
        }
        acc[ref.genre].push(ref);
        return acc;
    }, {});

    return {
        references,
        referencesByGenre,
        isLoading,
        error,
        refetch: fetchReferences,
    };
}
