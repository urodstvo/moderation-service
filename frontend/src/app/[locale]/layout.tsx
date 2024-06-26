// sort-imports-ignore

import type { Metadata } from 'next';

import '@/styles/reset.css';
import '@/styles/globals.css';
import { Provider } from './provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
    title: 'Cloud',
    description: 'Web App for Moderation Service',
};

export default function RootLayout({
    children,
    params: { locale },
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
    return (
        <html lang={locale} className='scroll-smooth'>
            <body>
                <Provider>{children}</Provider>
                <Toaster richColors />
            </body>
        </html>
    );
}
