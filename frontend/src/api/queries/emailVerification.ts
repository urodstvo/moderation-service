import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import api, { EMAIL_API_URL } from '@/api';
import { useAuthTokenStore } from '@/store';

export const useEmailVerificationMutation = () => {
    const { token } = useAuthTokenStore();
    const client = useQueryClient();

    return useMutation({
        mutationFn: (code: string) => {
            return api.post<string>(EMAIL_API_URL + '/verify', { code }, { headers: { Authorization: token } });
        },
        onSuccess() {
            client.invalidateQueries({ queryKey: ['verifyUser'] });
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Verification Email Failed', {
                description: error.message,
            });
        },
    });
};
