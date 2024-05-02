'use client';

import { IconCheck, IconClockHour3, IconX } from '@tabler/icons-react';
import React from 'react';

import { useUserStore } from '@/store';

export const CompanyCardTerms = () => {
    const { isLoggedIn, user } = useUserStore((state) => state);
    const isVerified = user?.is_verified;
    return (
        <ul className='font-roboto text-lg'>
            <li className='flex gap-2 items-center'>
                <span className='w-6'>{!isLoggedIn ? '*' : isVerified ? <IconCheck /> : <IconX />}</span>
                Veirified Email
            </li>
            <li className='flex gap-2 items-center'>
                <span className='w-6'>{!isLoggedIn ? '*' : <IconClockHour3 />}</span>
                Administration Approval
            </li>
        </ul>
    );
};
