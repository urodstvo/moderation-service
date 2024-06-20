import { NextIntlClientProvider, useMessages } from 'next-intl';

import { SideBar } from './components/sidebar';

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const messages = useMessages();
    return (
        <div className='flex px-[--container-padding-lg] relative items-stretch py-5 gap-10'>
            <NextIntlClientProvider messages={messages}>
                <SideBar />
            </NextIntlClientProvider>
            {children}
        </div>
    );
}
