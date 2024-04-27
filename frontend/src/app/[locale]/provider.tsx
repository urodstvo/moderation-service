'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import api, { AUTH_API_URL } from '@/api';
import { useAuthTokenStore, useUserStore } from '@/store';

const authorize = async () => {
    const refresh = await api.get<AuthResponse['token']>(AUTH_API_URL + '/refresh');
    if (refresh.status !== 200) throw Error('Failed to refresh token');

    const verify = await api.get<AuthResponse['user']>(AUTH_API_URL + '/verify', {
        headers: { Authorization: `${refresh.data.type} ${refresh.data.token}` },
    });
    if (verify.status !== 200) throw Error('Failed to verify user');

    return {
        token: refresh.data,
        user: verify.data,
    } as AuthResponse;
};

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // With SSR, we usually want to set some default staleTime
                        // above 0 to avoid refetching immediately on the client
                        staleTime: 60 * 1000,
                    },
                },
            }),
    );

    const { token, setToken } = useAuthTokenStore();
    const { auth, logout } = useUserStore();

    React.useEffect(() => {
        if (token)
            authorize()
                .then((data) => {
                    setToken(data.token.token);
                    auth(data.user);
                })
                .catch(() => {
                    logout();
                    setToken(null);
                });
    }, []);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
