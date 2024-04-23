import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AuthToken = {
    token?: string;
    setToken: (token: string) => void;
};

export const useAuthTokenStore = create<AuthToken>()(
    devtools(
        persist(
            (set) => ({
                token: undefined,
                setToken: (token: string) => set({ token }),
            }),
            { name: 'auth-token' },
        ),
    ),
);
