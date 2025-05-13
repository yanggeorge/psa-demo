'use client';

import { SessionProvider } from 'next-auth/react';
import type React from 'react';

export function Providers({ children, session }: { children: React.ReactNode; session: any }) {
  return (
    // https://github.com/nextauthjs/next-auth/issues/9504#issuecomment-2516665386
    // the key is used to force a re-render of the SessionProvider when the session changes
    <SessionProvider session={session} key={session?.user?.email}>
      {children}
    </SessionProvider>
  );
}
