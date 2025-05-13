import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('🚀 ~ auth.config.ts:9 ~ authorized ~ auth:', auth);
      const isLoggedIn = !!auth?.user;
      if (!isLoggedIn) {
        return false;
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;
