'use client';

import React from 'react';

import { redirect } from '@/navigation';
import { useProfileStore, useUserStore } from '@/store';

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useUserStore((state) => state);
    const { profile } = useProfileStore((state) => state);

    const hasAccess = isLoggedIn && profile?.role === 'admin';

    if (!hasAccess) {
        redirect('/');
    }

    return <>{hasAccess && children}</>;
};
