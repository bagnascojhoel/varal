import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { determineTimeState } from '@/core/domain/wash-decision';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'Varal',
  description: 'Should I wash my clothes today? Based on rain forecast.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hour = new Date().getHours();
  const timeState = determineTimeState(hour);
  const dayEnded = hour >= 21;

  return (
    <html
      lang="pt-BR"
      data-time={timeState}
      data-day-ended={dayEnded ? '' : undefined}
      suppressHydrationWarning
    >
      <body className={`${inter.className} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
