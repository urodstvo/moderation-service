'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { usePasswordForgetMutation } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const schema = z.object({
    email: z.string().email('Invalid email').min(1, 'Required').trim(),
});

export default function ForgetPasswordPage() {
    const forgetPassword = usePasswordForgetMutation();

    const form = useForm({
        resolver: zodResolver(schema),
    });

    const handleSumbit = form.handleSubmit((data) => {
        forgetPassword.mutate(data.email);
    });

    return (
        <form onSubmit={handleSumbit}>
            <Card className='mx-auto max-w-sm w-[350px]'>
                {!forgetPassword.isSuccess && (
                    <>
                        <CardHeader>
                            <CardTitle className='text-2xl'>Recovery Password</CardTitle>
                            <CardDescription>Enter your email below to recover your password</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid gap-0'>
                                <label htmlFor='email'>Email</label>
                                <Input {...form.register('email')} id='email' placeholder='m@example.com' />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type='submit' disabled={!form.formState.isValid} className='w-full'>
                                {forgetPassword.isPending ? 'Sending...' : 'Send Mail'}
                            </Button>
                        </CardFooter>
                    </>
                )}
                {forgetPassword.isSuccess && (
                    <>
                        <CardHeader>
                            <CardTitle className='text-2xl'>Mail was sent to your email</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm'>Please check your email to continue password recovery</p>
                        </CardContent>
                    </>
                )}
            </Card>
        </form>
    );
}
