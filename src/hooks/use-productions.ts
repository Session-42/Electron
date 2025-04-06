import { useQuery } from '@tanstack/react-query';
import { audioApi, AudioType } from '~/utils/api';

export const useProductions = () => {
    const {
        data: productions = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['audios', AudioType.PRODUCTION],
        queryFn: async () => {
            const response = await audioApi.listByType(AudioType.PRODUCTION);
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Cache is kept for 30 minutes
    });

    return { productions, isLoading, error };
};
