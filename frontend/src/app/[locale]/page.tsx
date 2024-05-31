import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';

import { DashboardLink } from './components/DashboardLink';
import { HomeButton } from './components/HomeButton';

export default function Home() {
    const t = useTranslations('home');
    const messages = useMessages();
    return (
        <div className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#222222] to-[#000000] py-5 gap-24'>
            <header className='w-full px-[--container-padding-lg]'>
                <nav className='flex align-center justify-end gap-10'>
                    <DashboardLink />
                    <Button asChild className='rounded-full px-5 py-1' variant='ghost'>
                        <Link href='/services/moderation' className='font-overpass text-xl text-white font-medium'>
                            {t('service')}
                        </Link>
                    </Button>
                    <Button asChild className='rounded-full px-5 py-1' variant='ghost'>
                        <Link href='/pricing' className='font-overpass text-xl text-white font-medium'>
                            {t('pricing')}
                        </Link>
                    </Button>
                    <Button asChild className='rounded-full px-5 py-1' variant='ghost'>
                        <Link href='/docs' className='font-overpass text-xl text-white font-medium'>
                            {t('docs')}
                        </Link>
                    </Button>
                </nav>
            </header>
            <main className='size-full px-[--container-padding-lg] flex flex-col items-center grow gap-24'>
                <div className='w-[840px] flex flex-col items-center gap-10'>
                    <h1 className='scroll-m-20 text-[128px] font-black tracking-tight text-white'>{t('title')}</h1>
                    <p className='text-2xl font-roboto text-white text-center'>{t('description')}</p>
                </div>
                <NextIntlClientProvider messages={messages}>
                    <HomeButton />
                </NextIntlClientProvider>
            </main>
        </div>
    );
}
