'use client';

import { IconCheck, IconLogin, IconLogout, IconSettings } from '@tabler/icons-react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useTranslations } from 'next-intl';
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
import { useProfileStore, useTokenStore, useUserStore } from '@/store';

import { Timer } from '../Timer';
import { LocaleSwitcher } from './LocaleSwitcher';

const SettingsButton = () => {
    const t = useTranslations('settings');
    const requestVerification = useRequestVerificationMutation();
    const emailVerification = useEmailVerificationMutation();

    const { user } = useUserStore((state) => state);
    const { profile } = useProfileStore((state) => state);
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
                    <DialogTitle>{t('title')}</DialogTitle>
                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-col gap-0 '>
                        <label htmlFor='locale' className='font-roboto text-sm px-1 flex gap-1'>
                            {t('language')}
                        </label>
                        <LocaleSwitcher id='locale' />
                    </div>
                    <div className='flex flex-col gap-0 '>
                        <div className='flex justify-between'>
                            <label htmlFor='email' className='font-roboto text-sm px-1 flex gap-1'>
                                {t('role')}
                            </label>
                            <Button asChild variant='link' size={null}>
                                <Link href='/pricing'>{t('changeRole')}</Link>
                            </Button>
                        </div>
                        <Input type='text' id='role' defaultValue={profile?.role ?? 'User'} disabled />
                    </div>
                    <div className='flex flex-col gap-0 '>
                        <label htmlFor='email' className='font-roboto text-sm px-1 flex gap-1'>
                            {t('email')}
                            {user?.is_verified && <IconCheck stroke={1.5} size={16} />}
                        </label>
                        <Input type='text' placeholder='email' id='email' defaultValue={user?.email} disabled />
                    </div>
                    {!user?.is_verified && !isVerifying && <Button onClick={handleRequest}>{t('verifyEmail')}</Button>}
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
                                        {t('tryAgain')}
                                    </Button>
                                </Timer>
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    {isVerifying && (
                        <Button className='w-full' disabled={otp.length !== 6} onClick={handleVerify}>
                            {emailVerification.isPending ? t('confirmation') : t('confirm')}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const NavBarActions = () => {
    const { isLoggedIn, logout } = useUserStore((state) => state);
    const clearToken = useTokenStore((state) => state.сlearToken);

    return (
        <div className='flex items-center gap-2'>
            <div className='w-40'>
                <LocaleSwitcher />
            </div>
            {isLoggedIn ? (
                <>
                    <SettingsButton />
                    <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                            logout();
                            clearToken();
                        }}
                    >
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
