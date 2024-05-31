'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';
import { useUserStore } from '@/store';

export const HomeButton = () => {
    const t = useTranslations('home');
    const { isLoggedIn } = useUserStore((state) => state);
    return (
        !isLoggedIn && (
            <Button asChild className='py-5 w-[300px] bg-transparent' size={null} variant='outline'>
                <Link href='/register' className='font-roboto text-xl font-bold text-white'>
                    {t('button')}
                </Link>
            </Button>
        )
    );
};
