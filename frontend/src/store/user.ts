import { create } from 'zustand';

type UserState = {
    isLoggedIn: boolean;
};

type UserActions = {
    setUser: (data: Partial<UserState>) => void;
};

const initialState: UserState = {
    isLoggedIn: false,
};

export const useUserStore = create<UserState & UserActions>((set) => ({
    ...initialState,
    setUser: (data: Partial<UserState>) => set({ ...data }),
}));
