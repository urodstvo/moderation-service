'use client';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
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
    const { mutate, isPending } = useRegisterMutation();
    const form = useForm({
        resolver: zodResolver(schema),
        reValidateMode: 'onBlur',
    });

    return (
        <form onSubmit={form.handleSubmit((data) => mutate({ email: data.email, password: data.password }))}>
            <Card className='mx-auto max-w-sm w-[350px]'>
                <CardHeader>
                    <CardTitle className='text-2xl'>Sign Up</CardTitle>
                    <CardDescription>Enter your information to create an account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className='grid gap-4'>
                        <div className='grid gap-2'>
                            <label htmlFor='email'>Email</label>
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
                            <label htmlFor='password'>Password</label>
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
                            {isPending ? 'Signing up...' : 'Create an account'}
                        </Button>
                    </div>
                    <div className='mt-4 text-center text-sm flex justify-between'>
                        Already have an account?
                        <Link href='/login' className='underline'>
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
