import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error') || '未知错误';

  // 重定向到错误页面
  return NextResponse.redirect(new URL(`/auth/error?error=${error}`, request.url));
}
