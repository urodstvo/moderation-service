import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'sonner';

import api, { AUTH_API_URL } from '@/api';
import { useAuthTokenStore, useUserStore } from '@/store';

export const useRegisterMutation = () => {
    const { setToken } = useAuthTokenStore();
    const { auth } = useUserStore();

    return useMutation({
        mutationFn: (data: { email: string; password: string }) => {
            return api.post<AuthResponse>(AUTH_API_URL + '/signup', data);
        },
        onSuccess(data: AxiosResponse<AuthResponse>) {
            const { user, token } = data.data;
            setToken(token.type + ' ' + token.token);
            auth(user);
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Authentication failed', {
                description: error.message,
            });
        },
    });
};
