import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';

import { auth } from '@/auth';
import { ThemeProvider } from '@/components/theme-provider';

import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PSA分析系统',
  description: '概率安全分析系统',
  generator: 'v0.dev',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers session={session}>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
