'use client';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Link, usePathname } from '@/navigation';

const selected = 'font-roboto text-xl border-l-2 border-blue-500 px-3 font-medium';
const standard = 'font-roboto text-xl border-l-2 border-[#aaa] px-3';

export const SideBar = () => {
    const t = useTranslations('docs.sidebar');
    const pathname = usePathname();
    return (
        <aside className='relative'>
            <ul className='flex flex-col gap-2 sticky top-10 border rounded-lg p-5 shadow w-60  '>
                <li className={clsx('hover:bg-blue-100 transition duration-200')}>
                    <Link
                        href={'/docs'}
                        className={clsx({
                            [selected]: pathname === '/docs',
                            [standard]: pathname !== '/docs',
                        })}
                    >
                        {t('intro')}
                    </Link>
                </li>
                <p className='rounded border-2 border-neutral-700 bg-neutral-700 text-white px-3 font-medium text-lg'>
                    Moderation Service
                </p>
                <ul className='flex flex-col gap-2 ml-3'>
                    <li className={clsx('hover:bg-blue-100 transition duration-200')}>
                        <Link
                            href={'/docs/moderation/overview'}
                            className={clsx({
                                [selected]: pathname === '/docs/moderation/overview',
                                [standard]: pathname !== '/docs/moderation/overview',
                            })}
                        >
                            {t('overview')}
                        </Link>
                    </li>
                    <li className={clsx('hover:bg-blue-100 transition duration-200')}>
                        <Link
                            href={'/docs/moderation/examples'}
                            className={clsx({
                                [selected]: pathname === '/docs/moderation/examples',
                                [standard]: pathname !== '/docs/moderation/examples',
                            })}
                        >
                            {t('examples')}
                        </Link>
                    </li>
                </ul>
            </ul>
        </aside>
    );
};
