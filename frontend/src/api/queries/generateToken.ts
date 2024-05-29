import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import api, { PROFILE_API_URL } from '@/api';
import { useTokenStore } from '@/store';

export const useGenerateTokentMutation = () => {
    const { token } = useTokenStore((state) => state);
    const client = useQueryClient();

    return useMutation({
        mutationFn: () => {
            return api.post<string>(PROFILE_API_URL + '/token', {}, { headers: { Authorization: token } });
        },
        onSuccess() {
            client.invalidateQueries({ queryKey: ['profile'] });
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Generate Token Failed', {
                description: error.message,
            });
        },
    });
};
