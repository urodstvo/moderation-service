'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { notFound } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { usePasswordResetMutation } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/navigation';

const schema = z
    .object({
        password: z.string().min(4, 'Required').trim(),
        confirm: z.string().min(4, 'Required').trim(),
    })
    .refine((data) => data.password === data.confirm, {
        message: "Passwords don't match",
        path: ['confirm'],
    });

export default function ResetPasswordPage({
    params,
    searchParams,
}: {
    params: { token: string };
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const token = searchParams.token as string;
    
    const router = useRouter();

    const resetPassword = usePasswordResetMutation();
    
    const form = useForm({ resolver: zodResolver(schema) });
    
    const handleSumbit = form.handleSubmit(async (data) => {
        resetPassword.mutate({ token: token, password: data.password });
    });
    
    React.useEffect(() => {
        router.replace('/login');
    }, [resetPassword.isSuccess]);
    
    if (!token) return notFound();
    
    return (
        <form onSubmit={handleSumbit}>
            <Card className='mx-auto max-w-sm w-[350px]'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Reset Password</CardTitle>
                    <CardDescription>Enter your new password</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-3'>
                        <Input {...form.register('password')} type='password' placeholder='New Password' />
                        <Input {...form.register('confirm')} type='password' placeholder='Repeat Password' />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type='submit' disabled={!form.formState.isValid} className='w-full'>
                        {resetPassword.isPending ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
