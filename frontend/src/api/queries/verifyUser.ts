import { useQuery } from '@tanstack/react-query';
import React from 'react';

import api, { AUTH_API_URL } from '@/api';
import { useAuthTokenStore, useUserStore } from '@/store';

export const useVerifyUserQuery = () => {
    const { token } = useAuthTokenStore();
    const { auth, logout } = useUserStore();

    const query = useQuery({
        queryKey: ['verifyUser'],
        queryFn: async () => {
            return await api.get<AuthResponse['user']>(AUTH_API_URL + '/verify', {
                headers: { Authorization: token },
            });
        },
        select: (data) => data.data,
        staleTime: 60 * 1000,
        retry: 1,
        enabled: !!token,
    });

    React.useEffect(() => {
        if (query.isSuccess) auth(query.data);
    }, [query.isSuccess]);

    React.useEffect(() => {
        if (query.isError) logout();
    }, [query.isError]);

    return query;
};
