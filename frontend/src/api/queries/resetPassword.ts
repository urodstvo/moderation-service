import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import api, { PASSWORD_API_URL } from '@/api';

export const usePasswordResetMutation = () => {
    return useMutation({
        mutationFn: (data: { token: string; password: string }) => {
            return api.post<string>(PASSWORD_API_URL + '/reset', data);
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Reset Password Failed', {
                description: error.message,
            });
        },
    });
};
