'use client';

import { IconCheck, IconClockHour3, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useUserStore } from '@/store';

export const CompanyCardTerms = () => {
    const t = useTranslations('company-card');
    const { isLoggedIn, user } = useUserStore((state) => state);
    const isVerified = user?.is_verified;
    return (
        <ul className='font-roboto text-lg'>
            <li className='flex gap-2 items-center'>
                <span className='w-6'>{!isLoggedIn ? '*' : isVerified ? <IconCheck /> : <IconX />}</span>
                {t('verified')}
            </li>
            <li className='flex gap-2 items-center'>
                <span className='w-6'>{!isLoggedIn ? '*' : <IconClockHour3 />}</span>
                {t('approval')}
            </li>
        </ul>
    );
};
