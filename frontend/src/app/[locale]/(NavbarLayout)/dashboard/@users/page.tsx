'use client';

import React from 'react';

import { useAcceptRoleMutation, useUsersQuery } from '@/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function UsersPage() {
    const users = useUsersQuery();
    const acceptRole = useAcceptRoleMutation();

    React.useEffect(() => {
        if (users.isError) throw Error();
    }, [users.isError]);

    return (
        <section className='py-5 px-[--container-padding-lg]'>
            <h3 className='font-roboto text-2xl font-bold'>Users</h3>
            <div className='flex flex-col gap-5'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className='text-center'>Texts</TableHead>
                            <TableHead className='text-center'>Images</TableHead>
                            <TableHead className='text-center'>Audios</TableHead>
                            <TableHead className='text-center'>Videos</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.data?.users.map((user) => (
                            <TableRow key={user.user_id}>
                                <TableCell className='font-medium'>
                                    {user.is_verified ? '✅' : ''} {user.email}
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell className='text-center'>{user.moderation.text}</TableCell>
                                <TableCell className='text-center'>{user.moderation.text}</TableCell>
                                <TableCell className='text-center'>{user.moderation.text}</TableCell>
                                <TableCell className='text-center'>{user.moderation.text}</TableCell>
                                <TableCell>
                                    {user.is_company_requested && (
                                        <Button onClick={() => acceptRole.mutate(user.user_id)}>ACCEPT COMPANY</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    );
}
