import api, { AUTH_API_URL } from '@/api';

export const refreshTokenRequest = async () => await api.get<AuthResponse['token']>(AUTH_API_URL + '/refresh');
