import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req, ctx) => {
  // 不需要认证的公共路径
  const publicPaths = ['/login', '/api/auth'];

  const path = req.nextUrl.pathname;

  // 检查会话状态
  const session = req.auth; // v5 中通过 req.auth 获取会话

  console.log('🚀 ~ middleware.ts ~ path:', path, 'session:', !!session);

  // 如果用户已登录且访问的是 /login，重定向到 /
  if (session && path === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 如果路径是公共路径，允许访问
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    return NextResponse.next();
  }

  // 如果用户未登录且访问非公共路径，重定向到 /login
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 已登录且访问非 /login 的路径，允许继续
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', // Exclude /api/env
  ],
};
