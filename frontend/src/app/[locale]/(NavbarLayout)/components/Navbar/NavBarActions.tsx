'use client';

import { IconCheck, IconLogin, IconLogout, IconSettings } from '@tabler/icons-react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import React from 'react';

import { useEmailVerificationMutation, useRequestVerificationMutation } from '@/api';
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
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Link } from '@/navigation';
import { useProfileStore, useUserStore } from '@/store';

import { Timer } from '../Timer';
import { LocaleSwitcher } from './LocaleSwitcher';

const SettingsButton = () => {
    const requestVerification = useRequestVerificationMutation();
    const emailVerification = useEmailVerificationMutation();

    const { user } = useUserStore();
    const { profile } = useProfileStore();
    const [isVerifying, setIsVerifying] = React.useState(false);

    const [otp, setOtp] = React.useState('');

    const handleVerify = () => emailVerification.mutate(otp);
    const handleRequest = () => {
        setIsVerifying(true);
        requestVerification.mutate();
    };

    React.useEffect(() => {
        if (emailVerification.isSuccess) setIsVerifying(false);
    }, [emailVerification.isSuccess]);

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
                        <Input type='text' id='role' defaultValue={profile?.role ?? 'User'} disabled />
                    </div>
                    <div className='flex flex-col gap-0 '>
                        <label htmlFor='email' className='font-roboto text-sm px-1 flex gap-1'>
                            Email
                            {user?.is_verified && <IconCheck stroke={1.5} size={16} />}
                        </label>
                        <Input type='text' placeholder='email' id='email' defaultValue={user?.email} disabled />
                    </div>
                    {!user?.is_verified && !isVerifying && <Button onClick={handleRequest}>Verify Email</Button>}
                    {isVerifying && (
                        <div className='flex items-center flex-col'>
                            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} onChange={setOtp}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <div className='flex justify-end w-full font-roboto text-sm'>
                                <Timer seconds={120}>
                                    <Button variant='link' onClick={handleRequest}>
                                        Try Again
                                    </Button>
                                </Timer>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {isVerifying && (
                        <Button className='w-full' disabled={otp.length !== 6} onClick={handleVerify}>
                            {emailVerification.isPending ? 'Confirmation...' : 'Confirm'}
                        </Button>
                    )}
                </DialogFooter>
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
