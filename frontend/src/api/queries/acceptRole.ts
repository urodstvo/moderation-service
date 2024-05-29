import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import api, { PROFILE_API_URL } from '@/api';
import { useTokenStore } from '@/store';

export const useAcceptRoleMutation = () => {
    const client = useQueryClient();
    const { token } = useTokenStore((state) => state);

    return useMutation({
        mutationFn: (user: string) => {
            return api.post<string>(PROFILE_API_URL + '/accept/' + user, null, { headers: { Authorization: token } });
        },
        onSuccess() {
            client.invalidateQueries({ queryKey: ['adminUsers'] });
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Accepting Role Failed', {
                description: error.message,
            });
        },
    });
};
