import { useQuery } from '@tanstack/react-query';
import React from 'react';

import api, { AUTH_API_URL } from '@/api';
import { useAuthTokenStore } from '@/store';

export const useRefreshTokenQuery = () => {
    const { token, setToken } = useAuthTokenStore();

    const query = useQuery({
        queryKey: ['refreshToken'],
        queryFn: async () => {
            return await api.get<AuthResponse['token']>(AUTH_API_URL + '/refresh', {
                headers: { Authorization: token },
            });
        },
        select: (data) => data.data,
        staleTime: 60 * 1000,
        retry: 1,
        enabled: !!token,
        refetchIntervalInBackground: true,
        refetchInterval: 60 * 1000 * 8,
    });

    React.useEffect(() => {
        if (query.isSuccess) setToken(query.data.type + ' ' + query.data.token);
    }, [query.isSuccess]);

    React.useEffect(() => {
        if (query.isError) setToken(null);
    }, [query.isError]);

    return query;
};
