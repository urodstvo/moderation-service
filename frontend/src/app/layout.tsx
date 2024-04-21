import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
    title: 'Cloud',
    description: 'Web App for Moderation Service',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang='en'>
            <body>{children}</body>
        </html>
    );
}
