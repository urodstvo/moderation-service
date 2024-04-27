'use client';

import { IconCheck, IconX } from '@tabler/icons-react';
import React from 'react';

import { useUserStore } from '@/store';

export const StudentCardTerms = () => {
    const { isLoggedIn, user } = useUserStore();
    const isVerified = user?.is_verified;
    return (
        <ul className='font-roboto text-lg'>
            <li className='flex gap-2 items-center'>
                <span className='w-6'>{!isLoggedIn ? '*' : isVerified ? <IconCheck /> : <IconX />}</span>
                Veirified Email
            </li>
        </ul>
    );
};
