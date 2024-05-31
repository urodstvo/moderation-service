'use client';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRegisterMutation } from '@/api/queries/register';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from '@/navigation';

const schema = z.object({
    email: z.string().email('Invalid email').min(1, 'Required').trim(),
    password: z.string().min(4, 'Password must be at least 4 characters').trim(),
});
export default function RegisterPage() {
    const t = useTranslations('register');
    const { mutate, isPending } = useRegisterMutation();
    const form = useForm({
        resolver: zodResolver(schema),
        reValidateMode: 'onBlur',
    });

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
                            <div className='flex flex-col'>
                                <Input {...form.register('email')} id='email' placeholder='m@example.com' />
                                <ErrorMessage
                                    errors={form.formState.errors}
                                    name='email'
                                    render={({ message }) => <p className='text-red-600 text-sm'>{message}</p>}
                                />
                            </div>
                        </div>
                        <div className='grid gap-2'>
                            <label htmlFor='password'>{t('password')}</label>
                            <div className='flex flex-col'>
                                <Input {...form.register('password')} id='password' type='password' />
                                <ErrorMessage
                                    errors={form.formState.errors}
                                    name='password'
                                    render={({ message }) => <p className='text-red-600 text-sm'>{message}</p>}
                                />
                            </div>
                        </div>
                        <Button type='submit' className='w-full' disabled={!form.formState.isValid}>
                            {isPending ? t('creating') : t('create')}
                        </Button>
                    </div>
                    <div className='mt-4 text-center text-sm flex justify-between'>
                        {t('alternative')}
                        <Link href='/login' className='underline'>
                            {t('signIn')}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
