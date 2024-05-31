'use client';

import * as Progress from '@radix-ui/react-progress';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';

import { Link } from '@/navigation';

export const SideBar = () => {
    const t = useTranslations('services.sidebar');
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
            <div className='sticky top-5 flex gap-8 p-5 rounded-lg border'>
                <ul className='flex flex-col gap-1'>
                    <li>
                        <Link href='#overview' className='font-overpass text-xl'>
                            {t('overview')}
                        </Link>
                    </li>

                    <li>
                        <Link href='#features' className='font-overpass text-xl'>
                            {t('features')}
                        </Link>
                    </li>
                    <li>
                        <Link href='#demo' className='font-overpass text-xl'>
                            {t('demo')}
                        </Link>
                    </li>
                    <li>
                        <Link href='#docs' className='font-overpass text-xl'>
                            {t('docs')}
                        </Link>
                    </li>
                    <li>
                        <Link href='#integration' className='font-overpass text-xl'>
                            {t('integration')}
                        </Link>
                    </li>
                </ul>
                <div>
                    <Progress.Root value={progress} className='relative overflow-hidden w-2 h-full rounded-full'>
                        <Progress.Indicator
                            className='size-full bg-blue-500 transition duration-300 ease'
                            style={{ transform: `translateY(-${100 - progress}%)` }}
                        />
                        <div className='absolute top-0 left-0 right-0 bottom-0 bg-neutral-300 z-[-1]' />
                    </Progress.Root>
                </div>
            </div>
        </aside>
    );
};
