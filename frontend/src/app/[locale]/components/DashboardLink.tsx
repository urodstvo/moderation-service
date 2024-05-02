'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';
import { useProfileStore, useUserStore } from '@/store';

export const DashboardLink = () => {
    const { isLoggedIn } = useUserStore((state) => state);
    const { profile } = useProfileStore((state) => state);

    if (!isLoggedIn || profile?.role !== 'admin') return null;

    return (
        <Button asChild className='rounded-full px-5 py-1' variant='ghost'>
            <Link href='/dashboard' className='font-overpass text-xl text-white font-medium'>
                Dashboard
            </Link>
        </Button>
    );
};
