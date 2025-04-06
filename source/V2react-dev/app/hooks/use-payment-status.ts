import { useQuery } from '@tanstack/react-query';
import { butcherApi } from '~/utils/api';

export const usePaymentStatus = (taskId: string) => {
    return useQuery({
        queryKey: ['butcher', 'payment-status', taskId],
        queryFn: () => butcherApi.paymentStatus(taskId).then((res) => res.data),
        enabled: Boolean(taskId),
    });
};
