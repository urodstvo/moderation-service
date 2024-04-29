'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

import auth from '@/lib/auth';

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

    const [update, setUpdate] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(
            () => {
                setUpdate((prev) => prev + 1);
            },
            1000 * 60 * 8,
        );
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        auth();
    }, [update]);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
