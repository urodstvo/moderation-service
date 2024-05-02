import React from 'react';
import { create, useStore } from 'zustand';

import { ProfileStoreContext } from '@/app/[locale]/provider';

type ProfileState = {
    profile: {
        profile_id: string;
        user_id: string;
        created_at: Date;
        updated_at: Date;
        role: 'user' | 'student' | 'company' | 'admin';
        is_company_requested: boolean;
        is_company_accepted: boolean;
        api_token: string | null;
    } | null;
};

type ProfileActions = {
    setProfile: (data: ProfileState['profile']) => void;
};

const initialState: ProfileState = {
    profile: null,
};

export type ProfileStore = ProfileState & ProfileActions;

export const createProfileStore = () =>
    create<ProfileStore>((set) => ({
        ...initialState,
        setProfile: (data: ProfileState['profile']) => set({ profile: data }),
    }));

export const useProfileStore = <T>(selector: (store: ProfileStore) => T): T => {
    const userStoreContext = React.useContext(ProfileStoreContext);

    if (!userStoreContext) {
        throw new Error(`useUserStore must be use within UserStoreProvider`);
    }

    return useStore(userStoreContext, selector);
};
