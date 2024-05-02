'use client';

import React from 'react';

import { useRouter } from '@/navigation';
import { useUserStore } from '@/store';

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useUserStore((state) => state);
    const router = useRouter();

    const hasAccess = !isLoggedIn;

    React.useLayoutEffect(() => {
        if (!hasAccess) {
            router.push('/');
        }
    }, [hasAccess]);

    return <>{hasAccess && children}</>;
};
