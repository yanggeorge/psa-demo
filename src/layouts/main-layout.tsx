import { Outlet } from "@tanstack/react-router"
import { Menu } from "@/components/menu"
import { Toolbar } from "@/components/toolbar"
import { ModelElementsSidebar } from "@/components/model-elements-sidebar"
import { ReportsSidebar } from "@/components/reports-sidebar"

export function MainLayout() {
  return (
    <main className="min-h-screen flex flex-col">
      <Menu />
      <Toolbar />
      <div className="flex-1 flex">
        <ModelElementsSidebar />
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
        <ReportsSidebar />
      </div>
    </main>
  )
}
