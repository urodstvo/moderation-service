import { IconHome } from '@tabler/icons-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';

import { NavBarActions } from './NavBarActions';

export const Navbar = () => {
    return (
        <header className='flex pt-2 w-full px-[--container-padding-lg] justify-between'>
            <nav className='flex gap-5 items-end'>
                <Button asChild variant='link' size='icon'>
                    <Link href='/'>
                        <IconHome stroke={1.5} size={24} />
                    </Link>
                </Button>
                <Button asChild variant='link' size={null}>
                    <Link href='/services/moderation' className='font-overpass !text-2xl !font-light'>
                        Service
                    </Link>
                </Button>
                <Button asChild variant='link' size={null}>
                    <Link href='/pricing' className='font-overpass !text-2xl !font-light'>
                        Pricing
                    </Link>
                </Button>
                <Button asChild variant='link' size={null}>
                    <Link href='/docs' className='font-overpass !text-2xl !font-light'>
                        Documentation
                    </Link>
                </Button>
            </nav>
            <NavBarActions />
        </header>
    );
};
