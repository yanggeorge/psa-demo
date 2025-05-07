"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Menu } from "@/components/menu"
import { Toolbar } from "@/components/toolbar"
import { ModelElementsSidebar } from "@/components/model-elements-sidebar"
import { ReportsSidebar } from "@/components/reports-sidebar"
import { WorkArea } from "@/components/work-area"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // 如果用户未经身份验证，则重定向到登录页面
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // 如果正在检查身份验证状态，则显示加载指示器
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // 如果用户未经身份验证，则不显示任何内容
  if (!session) {
    return null
  }

  // 如果用户已通过身份验证，则显示应用程序
  return (
    <main className="h-screen w-screen flex flex-col overflow-hidden">
      <Menu />
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <ModelElementsSidebar />
        <WorkArea />
        <ReportsSidebar />
      </div>
    </main>
  )
}
