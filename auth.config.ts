import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('🚀 ~ auth.config.ts:9 ~ authorized ~ auth:', auth);
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
  trustHost: true,
} satisfies NextAuthConfig;
