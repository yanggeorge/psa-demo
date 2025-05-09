import { auth } from '@/auth';

export default auth((req, ctx) => {
  // 不需要认证的公共路径
  const publicPaths = ['/login', '/api/auth'];

  const path = req.nextUrl.pathname;
  console.log('🚀 ~ middleware.ts:8 ~ auth ~ path:', path);
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Exclude /api/env
  ],
};
