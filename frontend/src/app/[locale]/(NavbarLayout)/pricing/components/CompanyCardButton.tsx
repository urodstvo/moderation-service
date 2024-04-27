'use client';

import React from 'react';

import { useProfileQuery } from '@/api';
import { useChangeRoleMutation } from '@/api/queries/changeRole';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store';

export const CompanyCardButton = () => {
    const { data } = useProfileQuery();
    const { user } = useUserStore();
    const changeRole = useChangeRoleMutation();

    const handleClick = () => changeRole.mutate('company');

    if (data?.role === 'company') return null;

    return (
        <Button className='w-full' disabled={!user?.is_verified} onClick={handleClick}>
            {changeRole.isPending ? 'REQUESTING...' : 'REQUEST APPROVAL'}
        </Button>
    );
};
