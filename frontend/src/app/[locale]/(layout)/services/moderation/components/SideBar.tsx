'use client';

import * as Progress from '@radix-ui/react-progress';
import React, { useEffect } from 'react';

import { Link } from '@/navigation';

export const SideBar = () => {
    const [progress, setProgress] = React.useState(0);
    useEffect(() => {
        const onScroll = () => {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            let windowHeight =
                window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            let documentHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.body.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight,
                document.documentElement.clientHeight,
            );

            const percent = (scrollTop / (documentHeight - windowHeight)) * 100;
            setProgress(percent);
        };

        onScroll();

        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <aside>
            <div className='sticky top-5 flex gap-2 p-5'>
                <ul className='flex flex-col gap-2'>
                    <li>
                        <Link href='#overview' className='font-overpass text-2xl'>
                            Overview
                        </Link>
                    </li>

                    <li className='font-overpass text-2xl'>
                        <Link href='#features' className='font-overpass text-2xl'>
                            Features
                        </Link>
                    </li>
                    <li className='font-overpass text-2xl'>
                        <Link href='#demo' className='font-overpass text-2xl'>
                            Demo
                        </Link>
                    </li>
                    <li className='font-overpass text-2xl'>
                        <Link href='#docs' className='font-overpass text-2xl'>
                            Documentation
                        </Link>
                    </li>
                    <li className='font-overpass text-2xl'>
                        <Link href='#integration' className='font-overpass text-2xl'>
                            Integration
                        </Link>
                    </li>
                </ul>
                <div>
                    <Progress.Root value={progress} className='relative overflow-hidden w-2 h-full rounded-full'>
                        <Progress.Indicator
                            className='size-full bg-blue-500 transition duration-300 ease'
                            style={{ transform: `translateY(-${100 - progress}%)` }}
                        />
                    </Progress.Root>
                </div>
            </div>
        </aside>
    );
};
