'use client';

import React from 'react';

import { useRouter } from '@/navigation';
import { useProfileStore } from '@/store';

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const { profile } = useProfileStore((state) => state);
    const router = useRouter();

    const hasAccess = profile?.role === 'admin';

    React.useEffect(() => {
        if (hasAccess) router.push('/dashboard');
        else router.replace('/');
    }, [hasAccess]);

    return <>{hasAccess && children}</>;
};
