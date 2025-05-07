"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { signIn, signOut } from "next-auth/react"

export default function TestPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Auth.js 测试页面</h1>

      <div className="p-4 border rounded-md bg-gray-50 w-full max-w-md">
        <h2 className="font-semibold mb-2">会话状态: {status}</h2>
        {session ? (
          <div>
            <p>已登录为: {session.user?.name}</p>
            <p>用户ID: {session.user?.id}</p>
            <p>邮箱: {session.user?.email}</p>
            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">{JSON.stringify(session, null, 2)}</pre>
          </div>
        ) : (
          <p>未登录</p>
        )}
      </div>

      <div className="flex gap-2">
        {!session ? <Button onClick={() => signIn()}>登录</Button> : <Button onClick={() => signOut()}>登出</Button>}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p>环境变量:</p>
        <p>AUTH_URL: {process.env.AUTH_URL || "未设置"}</p>
        <p>AUTH_SECRET: {process.env.AUTH_SECRET ? "已设置" : "未设置"}</p>
      </div>
    </div>
  )
}
