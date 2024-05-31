import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';

export default function NotFoundPage() {
    const t = useTranslations('not-found');
    return (
        <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#222222] to-[#000000]'>
            <h1 className='font-overpass text-[100px] font-black text-white'>{t('title')}</h1>
            <Button asChild className='py-5 w-[300px] bg-transparent' size={null} variant='outline'>
                <Link href='/' className='font-roboto text-xl font-bold text-white'>
                    {t('button')}
                </Link>
            </Button>
        </main>
    );
}
