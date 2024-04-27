import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import api, { PASSWORD_API_URL } from '@/api';

export const usePasswordForgetMutation = () => {
    return useMutation({
        mutationFn: (email: string) => {
            return api.post<string>(PASSWORD_API_URL + '/forget', { email });
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Sending Email Failed', {
                description: error.message,
            });
        },
    });
};
