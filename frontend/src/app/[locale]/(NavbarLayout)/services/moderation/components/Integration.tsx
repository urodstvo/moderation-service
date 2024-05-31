'use client';

import { IconCopy, IconEye, IconEyeOff } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import React from 'react';

import { useGenerateTokentMutation } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@/navigation';
import { useProfileStore, useUserStore } from '@/store';

export const Integration = () => {
    const t = useTranslations('services.integration');
    const { profile } = useProfileStore((state) => state);
    const [isHidden, setIsHidden] = React.useState(true);
    const { isLoggedIn } = useUserStore((state) => state);

    const generateToken = useGenerateTokentMutation();

    const handleGenerate = () => generateToken.mutate();

    return (
        <section className='flex flex-col gap-5' id='integration'>
            <h3 className='font-overpass text-2xl font-bold text-[#555]'>{t('title')}</h3>
            {!isLoggedIn && (
                <div className='h-40 rounded-lg border-2 bg-gradient-to-b from-[#222222] to-[#000000] flex items-center justify-center'>
                    <Link href='/login' className='font-overpass text-2xl text-white hover:underline'>
                        {t('signIn')}
                    </Link>
                </div>
            )}
            {isLoggedIn && (
                <>
                    {profile?.role === 'user' && (
                        <div className='h-40 rounded-lg border-2 bg-gradient-to-b from-[#222222] to-[#000000] flex items-center justify-center'>
                            <Link href='/pricing' className='font-overpass text-2xl text-white hover:underline'>
                                {t('available')}
                            </Link>
                        </div>
                    )}
                    {profile?.role !== 'user' && (
                        <>
                            {!!profile?.api_token?.length && (
                                <div className='flex items-center gap-2'>
                                    <div className='relative'>
                                        <Input
                                            className='w-[300px]'
                                            value={profile?.api_token}
                                            type={isHidden ? 'password' : 'text'}
                                            readOnly
                                        />
                                        <Button
                                            onClick={() => setIsHidden(!isHidden)}
                                            variant='ghost'
                                            size={null}
                                            className='absolute right-1 top-1 p-1'
                                        >
                                            {isHidden ? (
                                                <IconEye stroke={1.5} size={24} />
                                            ) : (
                                                <IconEyeOff stroke={1.5} size={24} />
                                            )}
                                        </Button>
                                    </div>
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        onClick={() => navigator.clipboard.writeText(profile?.api_token ?? '')}
                                    >
                                        <IconCopy stroke={1.5} size={24} />
                                    </Button>
                                </div>
                            )}
                            {!profile?.api_token?.length && (
                                <Button className='w-[300px]' onClick={handleGenerate}>
                                    {generateToken.isPending ? t('generating') : t('generate')}
                                </Button>
                            )}
                        </>
                    )}
                </>
            )}
        </section>
    );
};
