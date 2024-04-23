'use client';

import { IconLogin, IconLogout, IconSettings } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store';

import { LocaleSwitcher } from './LocaleSwitcher';

export const NavBarActions = () => {
    const { isLoggedIn, setUser } = useUserStore();
    return (
        <div className='flex items-center gap-2'>
            <LocaleSwitcher />
            {isLoggedIn ? (
                <>
                    <Button variant='ghost' size='icon'>
                        <IconSettings stroke={1.5} size={24} />
                    </Button>
                    <Button variant='ghost' size='icon' onClick={() => setUser({ isLoggedIn: false })}>
                        <IconLogout stroke={1.5} size={24} />
                    </Button>
                </>
            ) : (
                <Button variant='ghost' size='icon' onClick={() => setUser({ isLoggedIn: true })}>
                    <IconLogin stroke={1.5} size={24} />
                </Button>
            )}
        </div>
    );
};
