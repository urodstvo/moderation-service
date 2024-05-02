import { useQuery } from '@tanstack/react-query';

import api, { ADMIN_API_URL } from '@/api';
import { useTokenStore } from '@/store';

export const useUsersQuery = () => {
    const { token } = useTokenStore((state) => state);

    const query = useQuery({
        queryKey: ['adminUsers'],
        queryFn: async () => {
            return await api.get<AdminUsersResponse>(ADMIN_API_URL + '/users', {
                headers: { Authorization: token },
            });
        },
        select: (data) => data.data,
        staleTime: 60 * 1000,
        retry: 1,
    });

    return query;
};
