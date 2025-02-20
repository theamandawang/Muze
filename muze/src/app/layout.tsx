import type { Metadata } from 'next';
import { DM_Sans, Instrument_Sans } from 'next/font/google';
import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import AuthSessionProvider from '@/components/AuthSessionProvider';
import { getServerSession } from 'next-auth';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import LayoutWrapper from './LayoutWrapper';
import './globals.css';

const dmSans = DM_Sans({
    variable: '--font-dm-sans',
    subsets: ['latin'],
});

const instrumentSans = Instrument_Sans({
    variable: '--font-instrument-sans',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Muze',
    description: 'Where listeners become storytellers',
};

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <html lang='en'>
            <AuthSessionProvider session={session}>
                <body className={`${inter.className} ${dmSans.variable} ${instrumentSans.variable} antialiased`}>
                  <LayoutWrapper>{children}</LayoutWrapper>
                </body>
            </AuthSessionProvider>
        </html>
    );
}
