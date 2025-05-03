import { Menu } from "@/components/menu"
import { Toolbar } from "@/components/toolbar"
import { ModelElementsSidebar } from "@/components/model-elements-sidebar"
import { ReportsSidebar } from "@/components/reports-sidebar"
import { WorkArea } from "@/components/work-area"

export default function Home() {
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
