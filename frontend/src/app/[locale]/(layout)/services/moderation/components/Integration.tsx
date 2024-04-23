'use client';

import { IconCopy, IconEye, IconEyeOff } from '@tabler/icons-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Integration = () => {
    const [isHidden, setIsHidden] = React.useState(true);
    const value = '--api-key--';
    return (
        <section className='flex flex-col gap-5' id='integration'>
            <h3 className='font-overpass text-2xl font-bold text-[#555]'>API Integration</h3>
            <div className='flex items-center gap-2'>
                <div className='relative'>
                    <Input className='w-[300px]' value={value} type={isHidden ? 'password' : 'text'} readOnly />
                    <Button
                        onClick={() => setIsHidden(!isHidden)}
                        variant='ghost'
                        size={null}
                        className='absolute right-1 top-1 p-1'
                    >
                        {isHidden ? <IconEye stroke={1.5} size={24} /> : <IconEyeOff stroke={1.5} size={24} />}
                    </Button>
                </div>
                <Button variant='ghost' size='icon' onClick={() => navigator.clipboard.writeText(value)}>
                    <IconCopy stroke={1.5} size={24} />
                </Button>
            </div>
            <Button className='w-[300px]' disabled>
                Generate API Key
            </Button>
        </section>
    );
};

//TODO: add logic
