import { useQuery } from '@tanstack/react-query';
import { audioApi } from '~/utils/api';

export const useAudioDownload = (audioId: string) => {
    return useQuery<string>({
        queryKey: ['audio', 'download', audioId],
        queryFn: async () => (await audioApi.getAudioFile(audioId)).data,
        enabled: !!audioId,
        staleTime: 0, // Always fetch fresh data
        gcTime: 0, // Don't cache the download URL
        retry: 1, // Only retry once since this is a download endpoint
    });
};
