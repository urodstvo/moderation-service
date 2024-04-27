import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import api, { PROFILE_API_URL } from '@/api';
import { useUserStore } from '@/store';

export const useChangeRoleMutation = () => {
    const { user } = useUserStore();
    const client = useQueryClient();

    return useMutation({
        mutationFn: (role: string) => {
            return api.put<string>(PROFILE_API_URL + '/role/' + role);
        },
        onSuccess() {
            client.invalidateQueries({ queryKey: ['profile', user?.user_id] });
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Changing Role Failed', {
                description: error.message,
            });
        },
    });
};
