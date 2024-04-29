import { useQuery } from '@tanstack/react-query';
import React from 'react';

import api, { PROFILE_API_URL } from '@/api';
import { useAuthTokenStore, useProfileStore } from '@/store';

export const useProfileQuery = () => {
    const { token } = useAuthTokenStore();
    const { setProfile } = useProfileStore();

    const query = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            return await api.get<ProfileResponse>(PROFILE_API_URL + '/profile', {
                headers: { Authorization: token },
            });
        },
        select: (data) => data.data,
        staleTime: 60 * 1000,
        retry: 1,
        enabled: !!token,
    });

    React.useEffect(() => {
        if (query.isSuccess) setProfile(query.data);
    }, [query.isSuccess, query.isRefetching]);

    return query;
};
