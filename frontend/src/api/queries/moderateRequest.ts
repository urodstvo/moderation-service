import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

import api from '@/api';

export const useTextModerationMutation = () => {
    return useMutation({
        mutationFn: (data: { text: string; lang: 'rus' | 'eng' | 'auto' }) => {
            return api.post<PredictionResponse>('/text', data);
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Moderation Request Failed', {
                description: error.message,
            });
        },
    });
};

export const useFileModerationMutation = () => {
    return useMutation({
        mutationFn: (data: { type: string; data: FormData }) => {
            return api.post<PredictionResponse>('/' + data.type, data.data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onError(error) {
            if (axios.isAxiosError(error)) error = Error(error.response?.data.detail ?? 'Something went wrong');

            toast.error('Moderation Request Failed', {
                description: error.message,
            });
        },
    });
};
