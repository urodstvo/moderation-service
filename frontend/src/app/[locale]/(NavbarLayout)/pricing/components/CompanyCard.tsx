import { NextIntlClientProvider, useMessages, useTranslations } from 'next-intl';

import { CompanyCardButton } from './CompanyCardButton';
import { CompanyCardTerms } from './CompanyCardTerms';

export const CompanyCard = () => {
    const t = useTranslations('company-card');
    const messages = useMessages();
    return (
        <article className='rounded-lg border border-t-4 p-10 border-yellow-500 w-[350px] h-[600px] flex flex-col items-center gap-[60px]'>
            <div className='flex flex-col'>
                <h1 className='text-center font-overpass font-bold text-4xl text-yellow-600'>COMPANY</h1>
                <p className='text-center font-roboto text-2xl'>FREE</p>
            </div>

            <div className='w-full flex-1'>
                <ul className='font-roboto text-lg'>
                    <li className='flex gap-2'>
                        <span>—</span>
                        {t('requests')}
                    </li>
                    <li className='flex gap-2'>
                        <span>—</span>
                        {t('access')}
                    </li>
                </ul>
            </div>

            <NextIntlClientProvider messages={messages}>
                <div className='w-full h-[84px]'>
                    <h3 className='font-roboto text-lg font-bold w-full'>{t('terms')}</h3>
                    <CompanyCardTerms />
                </div>
                <CompanyCardButton />
            </NextIntlClientProvider>
        </article>
    );
};
