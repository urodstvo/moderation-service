'use client';

import { useLocale } from 'next-intl';
import React from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePathname, useRouter } from '@/navigation';

interface LocaleSwitcherProps {
    id?: string;
}

export const LocaleSwitcher = (props: LocaleSwitcherProps) => {
    const router = useRouter();
    const [isPending, startTransition] = React.useTransition();
    const pathname = usePathname();

    const activeLocale = useLocale();

    const onSelectChange = (locale: string) => {
        startTransition(() => {
            router.replace(pathname, { locale });
        });
    };

    return (
        <Select defaultValue={activeLocale} disabled={isPending} onValueChange={onSelectChange}>
            <SelectTrigger className='w-full font-roboto' {...props}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value='ru' className='font-roboto '>
                        Русский
                    </SelectItem>
                    <SelectItem value='en' className='font-roboto '>
                        English
                    </SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
