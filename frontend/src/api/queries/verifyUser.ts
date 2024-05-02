import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { verifyUserRequest } from '@/api';
import { useTokenStore, useUserStore } from '@/store';

export const useVerifyUserQuery = () => {
    const { token } = useTokenStore((state) => state);
    const { auth, logout } = useUserStore((state) => state);

    const query = useQuery({
        queryKey: ['verifyUser'],
        queryFn: () => verifyUserRequest(token as string),
        select: (data) => data.data,
        retry: 1,
        enabled: !!token,
    });

    React.useEffect(() => {
        if (query.isSuccess) auth(query.data);
    }, [query.isSuccess, query.isRefetching]);

    React.useEffect(() => {
        if (query.isError) logout();
    }, [query.isError, query.isRefetching]);

    return query;
};
