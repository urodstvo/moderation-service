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
        role: RoleEnum;
    };
};

type AuthError = {
    detail: string;
};
