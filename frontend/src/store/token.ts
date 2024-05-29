import React from 'react';
import { create, useStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { TokenStoreContext, UserStoreContext } from '@/app/[locale]/provider';

export type TokenStore = {
    token: string | null;
    setToken: (token: string | null) => void;
};

export const createAuthTokenStore = () =>
    create<TokenStore>()(
        devtools(
            persist(
                (set) => ({
                    token: null,
                    setToken: (token: string | null) => set({ token }),
                }),
                { name: 'auth-token' },
            ),
        ),
    );

export const useTokenStore = <T>(selector: (store: TokenStore) => T): T => {
    const userStoreContext = React.useContext(TokenStoreContext);

    if (!userStoreContext) {
        throw new Error(`useUserStore must be use within UserStoreProvider`);
    }

    return useStore(userStoreContext, selector);
};
