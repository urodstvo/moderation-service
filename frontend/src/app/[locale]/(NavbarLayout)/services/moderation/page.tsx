import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';

import { Demo } from './components/Demo';
import { Integration } from './components/Integration';
import { SideBar } from './components/SideBar';

const Overview = () => {
    return (
        <section className='flex flex-col gap-5' id='overview'>
            <h1 className='font-overpass text-4xl font-bold'>MODERATION SERVICE</h1>
        </section>
    );
};

const Features = () => {
    const t = useTranslations('services');
    return (
        <section className='flex flex-col gap-5' id='features'>
            <h3 className='font-overpass text-2xl font-bold text-[#555]'>{t('features')}</h3>
            <div className='w-full flex flex-col gap-10 '>
                <div className='flex justify-between'>
                    <div className='w-[300px] font-overpass text-2xl px-2 border-l-2 border-[#aaa] font-medium'>
                        {t('diffLang.title')}
                    </div>
                    <p className='flex-1 font-roboto text-xl'>{t('diffLang.description')}</p>
                </div>
                <div className='flex justify-between'>
                    <div className='w-[300px] font-overpass text-2xl px-2 border-l-2 border-[#aaa] font-medium'>
                        {t('varietyFormats.title')}
                    </div>
                    <p className='flex-1 font-roboto text-xl'>{t('varietyFormats.description')}</p>
                </div>
            </div>
        </section>
    );
};

const Documentation = () => {
    const t = useTranslations('services');
    return (
        <section className='flex flex-col gap-5' id='docs'>
            <h3 className='font-overpass text-2xl font-bold text-[#555]'>{t('docs')}</h3>
            <div className='w-full flex flex-col '>
                <div className='border flex flex-col justify-between p-5 items-end gap-2'>
                    <div className='w-full font-overpass text-2xl font-medium'>{t('endpoints.title')}</div>
                    <p className='font-roboto text-xl text-[#333]'>{t('endpoints.description')}</p>
                    <Button asChild className='px-5 py-1 font-roboto text-2xl' size={null} variant='ghost'>
                        <Link href='/docs/moderation/overview'>{t('learnMore')}</Link>
                    </Button>
                </div>
                <div className='border flex flex-col justify-between p-5 items-end gap-2'>
                    <div className='w-full font-overpass text-2xl font-medium'>{t('examples.title')}</div>
                    <p className='font-roboto text-xl text-[#333]'>{t('examples.description')}</p>
                    <Button asChild className='px-5 py-1 font-roboto text-2xl' size={null} variant='ghost'>
                        <Link href='/docs/moderation/examples'>{t('learnMore')}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default function ModerationPage() {
    const t = useTranslations('services');
    const messages = useMessages();
    return (
        <main className='px-[--container-padding-xl] flex justify-between gap-24 py-5'>
            <div className='flex-grow flex flex-col gap-[30px]'>
                <Overview />
                <Button asChild className='w-[300px] py-5 px-10 font-roboto text-xl' size={null}>
                    <Link href='#demo'>{t('tryDemo')}</Link>
                </Button>
                <Features />
                <NextIntlClientProvider messages={messages}>
                    <Demo />
                </NextIntlClientProvider>
                <Documentation />
                <NextIntlClientProvider messages={messages}>
                    <Integration />
                </NextIntlClientProvider>
            </div>
            <NextIntlClientProvider messages={messages}>
                <SideBar />
            </NextIntlClientProvider>
        </main>
    );
}
