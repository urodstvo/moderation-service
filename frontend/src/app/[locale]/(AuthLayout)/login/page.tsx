'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { useLoginMutation } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from '@/navigation';

export default function LoginPage() {
    const t = useTranslations('login');
    const { mutate, isPending } = useLoginMutation();
    const form = useForm({});

    return (
        <form onSubmit={form.handleSubmit((data) => mutate({ email: data.email, password: data.password }))}>
            <Card className='mx-auto max-w-sm w-[350px]'>
                <CardHeader>
                    <CardTitle className='text-2xl'>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4'>
                        <div className='grid gap-2'>
                            <label htmlFor='email'>{t('email')}</label>
                            <Input {...form.register('email')} id='email' placeholder='m@example.com' />
                        </div>
                        <div className='grid gap-2'>
                            <div className='flex items-center'>
                                <label htmlFor='password'>{t('password')}</label>
                                <Link href='/auth/forget-password' className='ml-auto inline-block text-sm underline'>
                                    {t('forgot')}
                                </Link>
                            </div>
                            <Input {...form.register('password')} id='password' type='password' />
                        </div>
                        <Button type='submit' className='w-full' disabled={isPending}>
                            {isPending ? t('signingIn') : t('signIn')}
                        </Button>
                    </div>
                    <div className='mt-4 text-center text-sm flex justify-between'>
                        {t('alternative')}
                        <Link href='/register' className='underline'>
                            {t('signUp')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
