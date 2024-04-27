'use client';

import { IconCheck, IconLogin, IconLogout, IconSettings } from '@tabler/icons-react';
import React from 'react';

import { useProfileQuery } from '@/api/queries/getProfile';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Link } from '@/navigation';
import { useUserStore } from '@/store';

import { LocaleSwitcher } from './LocaleSwitcher';

const SettingsButton = () => {
    useProfileQuery();

    const { user } = useUserStore();
    const { data } = useProfileQuery();
    const [isSettingsEditable, setIsSettingsEditable] = React.useState(false);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='ghost' size='icon'>
                    <IconSettings stroke={1.5} size={24} />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>Manage your account settings.</DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-0 '>
                        <label htmlFor='locale' className='font-roboto text-sm px-1 flex gap-1'>
                            UI Language
                        </label>
                        <LocaleSwitcher id='locale' />
                    </div>
                    <div className='flex flex-col gap-0 '>
                        <div className='flex justify-between'>
                            <label htmlFor='email' className='font-roboto text-sm px-1 flex gap-1'>
                                Role
                            </label>
                            <Button asChild variant='link' size={null}>
                                <Link href='/pricing'>Change Role</Link>
                            </Button>
                        </div>
                        <Input type='text' id='role' defaultValue={data?.role} disabled />
                    </div>
                    <div className='flex flex-col gap-0 '>
                        <label htmlFor='email' className='font-roboto text-sm px-1 flex gap-1'>
                            Email
                            {user?.is_verified && <IconCheck stroke={1.5} size={16} />}
                        </label>
                        <Input type='text' placeholder='email' id='email' defaultValue={user?.email} disabled />
                    </div>
                    {!user?.is_verified && <Button>Verify Email</Button>}
                </div>
                <DialogFooter>{isSettingsEditable && <Button>Save Changes</Button>}</DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const NavBarActions = () => {
    const { isLoggedIn, logout } = useUserStore();
    return (
        <div className='flex items-center gap-2'>
            <div className='w-40'>
                <LocaleSwitcher />
            </div>
            {isLoggedIn ? (
                <>
                    <SettingsButton />
                    <Button variant='ghost' size='icon' onClick={logout}>
                        <IconLogout stroke={1.5} size={24} />
                    </Button>
                </>
            ) : (
                <Button variant='ghost' size='icon' asChild>
                    <Link href='/login'>
                        <IconLogin stroke={1.5} size={24} />
                    </Link>
                </Button>
            )}
        </div>
    );
};

//TODO: email verification
