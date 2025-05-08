import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: '用户名', type: 'text' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        // 简单的凭证检查
        if (credentials?.username === 'psaadmin' && credentials?.password === '123456') {
          return {
            id: '1',
            name: 'PSA管理员',
            email: 'admin@example.com',
          };
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
