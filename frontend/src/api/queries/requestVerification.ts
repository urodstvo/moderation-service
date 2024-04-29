import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import api, { EMAIL_API_URL } from '@/api';
import { useAuthTokenStore } from '@/store';

export const useRequestVerificationMutation = () => {
    const { token } = useAuthTokenStore();

    return useMutation({
        mutationFn: () => {
            return api.post<string>(EMAIL_API_URL + '/request', {}, { headers: { Authorization: token } });
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Verification Email Failed', {
                description: error.message,
            });
        },
    });
};
