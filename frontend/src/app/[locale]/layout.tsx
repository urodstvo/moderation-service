// sort-imports-ignore

import type { Metadata } from 'next';

import '@/styles/reset.css';
import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'Cloud',
    description: 'Web App for Moderation Service',
};

export default function RootLayout({
    children,
    params: { locale },
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
    return (
        <html lang={locale}>
            <body>{children}</body>
        </html>
    );
}
