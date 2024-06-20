'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { useChangeRoleMutation } from '@/api/queries/changeRole';
import { Button } from '@/components/ui/button';
import { useProfileStore, useUserStore } from '@/store';

export const StudentCardButton = () => {
    const t = useTranslations('student-card');
    const { profile } = useProfileStore((state) => state);
    const { user } = useUserStore((state) => state);
    const changeRole = useChangeRoleMutation();

    const handleClick = () => changeRole.mutate('student');

    if (profile?.role === 'student' || profile?.role === 'company') return null;

    return (
        <Button className='w-full' disabled={!user?.is_verified} onClick={handleClick}>
            {changeRole.isPending ? t('changing') : t('choose')}
        </Button>
    );
};
