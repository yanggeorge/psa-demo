import { Menu } from "@/components/menu"
import { Toolbar } from "@/components/toolbar"
import { ModelElementsSidebar } from "@/components/model-elements-sidebar"
import { ReportsSidebar } from "@/components/reports-sidebar"
import { WorkArea } from "@/components/work-area"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Menu />
      <Toolbar />
      <div className="flex-1 flex">
        <ModelElementsSidebar />
        <WorkArea />
        <ReportsSidebar />
      </div>
    </main>
  )
}
