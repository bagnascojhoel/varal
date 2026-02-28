import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { DateTime } from 'luxon';
import { determineTimeState } from '@/core/domain/wash-decision';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import messages from '../../messages/pt-BR.json';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
});

export const metadata: Metadata = {
  title: messages.App.title,
  description: messages.App.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hour = DateTime.now().hour;
  const timeState = determineTimeState(hour);
  const dayEnded = hour >= 21;
  const allMessages = await getMessages();

  return (
    <html
      lang="pt-BR"
      data-time={timeState}
      data-day-ended={dayEnded ? '' : undefined}
      suppressHydrationWarning
    >
      <body className={`${inter.className} antialiased min-h-screen`}>
        <NextIntlClientProvider messages={allMessages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
