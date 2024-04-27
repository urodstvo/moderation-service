import { create } from 'zustand';

type ProfileState = {
    profile: {
        profile_id: string;
        user_id: string;
        registered_at: Date;
        updated_at: Date;
        role: 'user' | 'student' | 'company' | 'admin';
        is_company_requested: boolean;
    } | null;
};

type ProfileActions = {
    setProfile: (data: ProfileState['profile']) => void;
};

const initialState: ProfileState = {
    profile: null,
};

export const useProfileStore = create<ProfileState & ProfileActions>((set) => ({
    ...initialState,
    setProfile: (data: ProfileState['profile']) => set({ profile: data }),
}));
