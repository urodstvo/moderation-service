import api, { AUTH_API_URL } from '@/api';

export const verifyUserRequest = async (access_token: string) =>
    await api.get<AuthResponse['user']>(AUTH_API_URL + '/verify', {
        headers: { Authorization: access_token },
    });
