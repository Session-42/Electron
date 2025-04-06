import { useQuery } from '@tanstack/react-query';
import { taskApi } from '~/utils/api';

export const useStemSeparation = (audioId: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['stem-separation', audioId],
        queryFn: () => taskApi.getStemSeparationStatus(audioId).then((res) => res.data),
    });

    return {
        data,
        isLoading,
        error,
    };
};
