import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AuthToken = {
    token: string | null;
    setToken: (token: string | null) => void;
};

export const useAuthTokenStore = create<AuthToken>()(
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
