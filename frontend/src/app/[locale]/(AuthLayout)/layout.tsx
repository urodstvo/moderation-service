import { IconHome } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { Provider } from './provider';

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <Provider>
            <div className='flex min-h-screen flex-col'>
                <header className='w-full px-[--container-padding-lg] pt-5'>
                    <Button asChild variant='ghost' size={null} className='p-2 flex items-end w-fit'>
                        <Link href='/'>
                            <IconHome size={32} stroke={1.5} />
                        </Link>
                    </Button>
                </header>
                <main className='flex-1 flex items-center justify-center'>{children}</main>
            </div>
        </Provider>
    );
}
