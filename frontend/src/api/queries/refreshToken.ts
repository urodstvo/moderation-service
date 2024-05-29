import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { refreshTokenRequest } from '@/api';
import { useTokenStore } from '@/store';

export const useRefreshTokenQuery = () => {
    const { token, setToken } = useTokenStore((state) => state);

    const query = useQuery({
        queryKey: ['refreshToken'],
        queryFn: refreshTokenRequest,
        select: (data) => data.data,
        retry: 1,
        enabled: !!token,
        refetchIntervalInBackground: true,
        refetchInterval: 60 * 1000 * 8,
    });

    React.useEffect(() => {
        if (query.isSuccess) setToken(query.data.type + ' ' + query.data.token);
    }, [query.isSuccess, query.isRefetching]);

    React.useEffect(() => {
        if (query.isError) setToken(null);
    }, [query.isError, query.isRefetching]);

    return query;
};
