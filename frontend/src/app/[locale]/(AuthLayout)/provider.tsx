'use client';

import { useEffect } from 'react';

import { useRouter } from '@/navigation';
import { useUserStore } from '@/store';

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { isLoggedIn } = useUserStore();

    useEffect(() => {
        isLoggedIn && router.replace('/');
    }, [isLoggedIn]);

    return <>{children}</>;
};
