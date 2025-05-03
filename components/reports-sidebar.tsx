"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, FileText } from "lucide-react"

export function ReportsSidebar() {
  const [collapsed, setCollapsed] = useState(true)

  // 当侧边栏状态改变时，发送自定义事件
  useEffect(() => {
    // 发送侧边栏状态变化事件
    const event = new CustomEvent("rightSidebarToggle", {
      detail: { collapsed },
    })
    window.dispatchEvent(event)
  }, [collapsed])

  return (
    <div className={`border-l bg-muted/20 transition-all ${collapsed ? "w-12" : "w-64"} flex flex-col`}>
      <div className="p-2 flex justify-between items-center border-b">
        <h2 className={`font-medium text-sm ${collapsed ? "hidden" : "block"}`}>报告列表</h2>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-7 w-7">
          {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed ? (
        <div className="flex-1 overflow-auto p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-8"
              onClick={() => {
                // Create a custom event to open a report tab
                const event = new CustomEvent("openReportTab", {
                  detail: { reportName: "fault tree1 报告" },
                })
                window.dispatchEvent(event)
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              fault tree1 报告
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-8"
              onClick={() => {
                // Create a custom event to open a report tab
                const event = new CustomEvent("openReportTab", {
                  detail: { reportName: "fault tree2 报告" },
                })
                window.dispatchEvent(event)
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              fault tree2 报告
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center pt-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              // Create a custom event to open a report tab
              const event = new CustomEvent("openReportTab", {
                detail: { reportName: "fault tree1 报告" },
              })
              window.dispatchEvent(event)
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
