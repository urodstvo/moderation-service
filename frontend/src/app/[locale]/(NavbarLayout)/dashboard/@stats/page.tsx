'use client';

import { IconLetterT, IconSlideshow, IconUsers, IconVideo, IconWaveSine } from '@tabler/icons-react';
import React, { useEffect } from 'react';

import { useStatsQuery } from '@/api';

export default function StatsPage() {
    const stats = useStatsQuery();

    useEffect(() => {
        if (stats.isError) throw Error();
    }, [stats.isError]);

    return (
        <section className='flex justify-between py-5'>
            <div className='flex gap-5'>
                <div className='rounded-lg border flex items-center justify-center p-5 bg-black size-40'>
                    <IconUsers size={64} stroke={2} color='white' />
                </div>
                <div className=''>
                    <h3 className='font-roboto font-bold text-xl'>{stats.data?.users.total} USERS</h3>
                    <p className='text-sm font-roboto '>{stats.data?.users.verified} verified</p>
                </div>
            </div>
            <div className='flex gap-5'>
                <div className='flex flex-col gap-3 w-30'>
                    <div className='rounded-lg border flex items-center justify-center p-5 bg-black'>
                        <IconLetterT size={40} stroke={2} color='white' />
                    </div>
                    <p className='text-sm font-roboto text-center py-1'>{stats.data?.moderation.text.total}</p>
                    <p className='text-sm font-roboto text-center py-1'>{stats.data?.moderation.text.today}</p>
                </div>
                <div className='flex flex-col gap-3 w-30'>
                    <div className='rounded-lg border flex items-center justify-center p-5 bg-black'>
                        <IconSlideshow size={40} stroke={2} color='white' />
                    </div>
                    <p className='text-sm font-roboto text-center py-1'>{stats.data?.moderation.image.total}</p>
                    <p className='text-sm font-roboto text-center py-1'>{stats.data?.moderation.image.today}</p>
                </div>
                <div className='flex flex-col gap-3 w-30'>
                    <div className='rounded-lg border flex items-center justify-center p-5 bg-black'>
                        <IconWaveSine size={40} stroke={2} color='white' />
                    </div>
                    <p className='text-sm font-roboto text-center py-1'>{stats.data?.moderation.audio.total}</p>
                    <p className='text-sm font-roboto text-center py-1'>{stats.data?.moderation.audio.today}</p>
                </div>
                <div className='flex flex-col gap-3 w-30'>
                    <div className='rounded-lg border flex items-center justify-center p-5 bg-black'>
                        <IconVideo size={40} stroke={2} color='white' />
                    </div>
                    <p className='text-sm font-roboto text-center py-1'>{stats.data?.moderation.video.total}</p>
                    <p className='text-sm font-roboto text-center py-1'>{stats.data?.moderation.video.today}</p>
                </div>
                <div className='flex flex-col gap-3 w-30'>
                    <div className='p-5 size-20 ' />
                    <p className='font-bold text-sm font-roboto text-center py-1'>TOTAL</p>
                    <p className='font-bold text-sm font-roboto text-center py-1'>TODAY</p>
                </div>
            </div>
        </section>
    );
}
