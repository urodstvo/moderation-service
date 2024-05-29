import { useQuery } from '@tanstack/react-query';

import api, { ADMIN_API_URL } from '@/api';
import { useTokenStore } from '@/store';

export const useStatsQuery = () => {
    const { token } = useTokenStore((state) => state);

    const query = useQuery({
        queryKey: ['stats'],
        queryFn: async () => {
            return await api.get<AdminStatsResponse>(ADMIN_API_URL + '/stats', {
                headers: { Authorization: token },
            });
        },
        select: (data) => data.data,
        staleTime: 60 * 1000,
        retry: 1,
    });

    return query;
};
