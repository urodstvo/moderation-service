import { create } from 'zustand';

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

export const useProfileStore = create<ProfileState & ProfileActions>((set) => ({
    ...initialState,
    setProfile: (data: ProfileState['profile']) => set({ profile: data }),
}));
