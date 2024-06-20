'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import type { StoreApi } from 'zustand';

import { useProfileQuery, useRefreshTokenQuery, useVerifyUserQuery } from '@/api';
import {
    ProfileStore,
    TokenStore,
    UserStore,
    createAuthTokenStore,
    createProfileStore,
    createUserStore,
} from '@/store';

import { UnsuportedProvider } from './unsuported';

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
        <UnsuportedProvider>
            <QueryClientProvider client={queryClient}>
                <TokenStoreProvider>
                    <UserStoreProvider>
                        <ProfileStoreProvider>
                            <AuthProvider>{children}</AuthProvider>
                        </ProfileStoreProvider>
                    </UserStoreProvider>
                </TokenStoreProvider>
            </QueryClientProvider>
        </UnsuportedProvider>
    );
};

export const UserStoreContext = React.createContext<StoreApi<UserStore> | null>(null);

const UserStoreProvider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = React.useRef<StoreApi<UserStore>>();

    if (!storeRef.current) {
        storeRef.current = createUserStore();
    }

    return <UserStoreContext.Provider value={storeRef.current}>{children}</UserStoreContext.Provider>;
};

export const TokenStoreContext = React.createContext<StoreApi<TokenStore> | null>(null);

const TokenStoreProvider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = React.useRef<StoreApi<TokenStore>>();

    if (!storeRef.current) {
        storeRef.current = createAuthTokenStore();
    }

    return <TokenStoreContext.Provider value={storeRef.current}>{children}</TokenStoreContext.Provider>;
};

export const ProfileStoreContext = React.createContext<StoreApi<ProfileStore> | null>(null);

const ProfileStoreProvider = ({ children }: { children: React.ReactNode }) => {
    const storeRef = React.useRef<StoreApi<ProfileStore>>();

    if (!storeRef.current) {
        storeRef.current = createProfileStore();
    }

    return <ProfileStoreContext.Provider value={storeRef.current}>{children}</ProfileStoreContext.Provider>;
};
