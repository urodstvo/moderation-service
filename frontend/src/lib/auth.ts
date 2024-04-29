import { refreshTokenRequest, verifyUserRequest } from '@/api';
import { useAuthTokenStore, useUserStore } from '@/store';

const authorize = async () => {
    const refresh = await refreshTokenRequest();
    if (refresh.status !== 200) throw Error('Failed to refresh token');

    const verify = await verifyUserRequest(`${refresh.data.type} ${refresh.data.token}`);
    if (verify.status !== 200) throw Error('Failed to verify user');

    return {
        token: refresh.data,
        user: verify.data,
    } as AuthResponse;
};

const auth_storage = useAuthTokenStore.getState();
const user_storage = useUserStore.getState();

const fillStores = async () => {
    try {
        const { token, user } = await authorize();

        auth_storage.setToken(token.token);
        user_storage.auth(user);
    } catch (error) {
        auth_storage.setToken(null);
        user_storage.logout();
    }
};

export default fillStores;
