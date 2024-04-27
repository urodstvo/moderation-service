type AuthResponse = {
    token: {
        type: string;
        token: string;
    };
    user: {
        user_id: string;
        email: string;
        registered_at: Date;
        updated_at: Date;
        is_verified: boolean;
    };
};

type ProfileResponse = {
    profile_id: string;
    user_id: string;
    registered_at: Date;
    updated_at: Date;
    role: 'user' | 'student' | 'company' | 'admin';
    is_company_requested: boolean;
};

type AuthError = {
    detail: string;
};
