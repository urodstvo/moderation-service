'use client';

import React from 'react';

import { useChangeRoleMutation } from '@/api/queries/changeRole';
import { Button } from '@/components/ui/button';
import { useProfileStore, useUserStore } from '@/store';

export const StudentCardButton = () => {
    const { profile } = useProfileStore();
    const { user } = useUserStore();
    const changeRole = useChangeRoleMutation();

    const handleClick = () => changeRole.mutate('student');

    if (profile?.role === 'student' || profile?.role === 'company') return null;

    return (
        <Button className='w-full' disabled={!user?.is_verified} onClick={handleClick}>
            {changeRole.isPending ? 'CHANGING...' : 'CHOOSE PLAN'}
        </Button>
    );
};
