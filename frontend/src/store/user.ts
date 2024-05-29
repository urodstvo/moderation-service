import React from 'react';
import { create, useStore } from 'zustand';

import { UserStoreContext } from '@/app/[locale]/provider';

type UserState = {
    isLoggedIn: boolean;
    user: {
        user_id: string;
        email: string;
        is_verified: boolean;
        registered_at: Date;
        updated_at: Date;
    } | null;
};

type UserActions = {
    auth: (data: UserState['user']) => void;
    logout: () => void;
};

export type UserStore = UserState & UserActions;

const initialState: UserState = {
    isLoggedIn: false,
    user: null,
};

export const createUserStore = () =>
    create<UserStore>((set) => ({
        ...initialState,
        auth: (data: UserState['user']) => set({ isLoggedIn: true, user: data }),
        logout: () => set({ isLoggedIn: false, user: null }),
    }));

export const useUserStore = <T>(selector: (store: UserStore) => T): T => {
    const userStoreContext = React.useContext(UserStoreContext);

    if (!userStoreContext) {
        throw new Error(`useUserStore must be use within UserStoreProvider`);
    }

    return useStore(userStoreContext, selector);
};
