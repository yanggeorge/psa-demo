'use server';

import { AuthError } from 'next-auth';

import { signIn, signOut } from '@/auth';

export async function authenticate(prevState: string | undefined, formData: FormData) {
  console.log('🚀 ~ actions.ts:8 ~ authenticate ~ formData:', formData);
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      console.log('🚀 ~ error:', error);

      return 'Invalid credentials';
    }
    throw error;
  }
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
}
