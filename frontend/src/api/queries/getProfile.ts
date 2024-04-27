import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { toast } from 'sonner';

import api, { PROFILE_API_URL } from '@/api';
import { useAuthTokenStore, useProfileStore, useUserStore } from '@/store';

export const useProfileQuery = () => {
    const { token } = useAuthTokenStore();
    const { user } = useUserStore();
    const { setProfile } = useProfileStore();

    const query = useQuery({
        queryKey: ['profile', user?.user_id],
        queryFn: async () => {
            return await api.get<ProfileResponse>(PROFILE_API_URL + '/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        select: (data) => data.data,
        staleTime: 60 * 1000,
    });

    React.useEffect(() => {
        if (query.isSuccess) {
            setProfile(query.data.data);
        }
    }, [query.isSuccess]);

    return query;
};
