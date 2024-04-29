'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import { useProfileQuery, useRefreshTokenQuery, useVerifyUserQuery } from '@/api';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    useRefreshTokenQuery();
    useVerifyUserQuery();
    useProfileQuery();

    return children;
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

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
    );
};
