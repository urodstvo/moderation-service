import { create } from 'zustand';

type UserState = {
    isLoggedIn: boolean;
    user: {
        user_id: string;
        email: string;
        role: string;
        is_verified: boolean;
        registered_at: Date;
        updated_at: Date;
    } | null;
};

type UserActions = {
    auth: (data: UserState['user']) => void;
    logout: () => void;
};

const initialState: UserState = {
    isLoggedIn: false,
    user: null,
};

export const useUserStore = create<UserState & UserActions>((set) => ({
    ...initialState,
    auth: (data: UserState['user']) => set({ isLoggedIn: true, user: data }),
    logout: () => set({ isLoggedIn: false, user: null }),
}));
