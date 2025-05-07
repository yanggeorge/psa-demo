import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // 不需要认证的公共路径
  const publicPaths = ["/login", "/api/auth"]

  const path = request.nextUrl.pathname

  // 检查路径是否为公共路径
  if (publicPaths.some((publicPath) => path.startsWith(publicPath))) {
    return NextResponse.next()
  }

  // 使用新的环境变量名称
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  })

  // 如果没有令牌且尝试访问受保护的路由，则重定向到登录页面
  if (!token) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
