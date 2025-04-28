"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GatesTable } from "./tables/gates-table"
import { BasicEventsTable } from "./tables/basic-events-table"
import { HouseEventsTable } from "./tables/house-events-table"
import { FaultTreeViewer } from "./fault-tree-viewer"
import { useParams } from "@tanstack/react-router"

// 示例XML数据
const sampleXmlData = `<?xml version="1.0" encoding="UTF-8"?>
<opsa-mef name="abc">
  <define-fault-tree name="Tree1">
    <define-gate name="And1">
      <label>And1</label>
      <and>
        <event name="House1"/>
        <event name="House2"/>
      </and>
    </define-gate>
  </define-fault-tree>
  <define-fault-tree name="Tree2">
    <define-gate name="Or1">
      <label>Or1</label>
      <or>
        <event name="And1"/>
        <event name="B1"/>
      </or>
    </define-gate>
  </define-fault-tree>
  <model-data>
    <define-basic-event name="B1">
      <label>B1</label>
      <float value="0.01"/>
    </define-basic-event>
    <define-basic-event name="B2">
      <label>B2</label>
      <float value="0.1"/>
    </define-basic-event>
    <define-house-event name="House1">
      <label>House1</label>
      <constant value="true"/>
    </define-house-event>
    <define-house-event name="House2">
      <label>House2</label>
      <constant value="false"/>
    </define-house-event>
  </model-data>
</opsa-mef>`

// 标签页类型定义
interface TabInfo {
  id: string
  type: string
  label: string
  treeName?: string
}

export function WorkArea() {
  // 标签页管理
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [activeTab, setActiveTab] = useState<string>("")
  const params = useParams()

  // 初始化标签页
  useEffect(() => {
    // 根据路由参数创建初始标签页
    const initialTab: TabInfo = {
      id: `tab-${Date.now()}`,
      type: "faultTree",
      label: "故障树可视化",
      treeName: "Tree1",
    }

    setTabs([initialTab])
    setActiveTab(initialTab.id)
  }, [])

  // 关闭标签页
  const closeTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    const newTabs = tabs.filter((tab) => tab.id !== tabId)
    setTabs(newTabs)

    // 如果关闭的是当前活动的标签页，切换到第一个标签页
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id)
    }
  }

  // 获取当前标签页的类型和树名称
  const getCurrentTabInfo = () => {
    const currentTab = tabs.find((tab) => tab.id === activeTab)
    if (!currentTab) return { type: "", treeName: "" }

    return {
      type: currentTab.type,
      treeName: currentTab.treeName || "",
    }
  }

  const { type: currentTabType, treeName: currentTreeName } = getCurrentTabInfo()

  return (
    <div className="flex-1 flex flex-col">
      <Tabs value={activeTab} className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <div className="border-b px-2 flex items-center overflow-x-auto">
          <TabsList className="h-9">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs flex items-center gap-1 relative pr-8">
                {tab.label}
                <button
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full hover:bg-muted p-0.5"
                  onClick={(e) => closeTab(tab.id, e)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-x"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="flex-1 relative data-[state=inactive]:hidden">
            {tab.type === "gates" && <GatesTable />}
            {tab.type === "basicEvents" && <BasicEventsTable />}
            {tab.type === "houseEvents" && <HouseEventsTable />}
            {tab.type === "faultTree" && <FaultTreeViewer xmlData={sampleXmlData} initialTreeName={tab.treeName} />}
          </TabsContent>
        ))}
      </Tabs>

      <div className="h-6 border-t bg-muted/30 px-2 flex items-center text-xs text-muted-foreground">
        <span>
          当前视图:{" "}
          {currentTabType === "gates"
            ? "门"
            : currentTabType === "basicEvents"
              ? "基本事件"
              : currentTabType === "houseEvents"
                ? "房屋事件"
                : currentTabType === "faultTree"
                  ? `故障树 - ${currentTreeName}`
                  : ""}
        </span>
        <span className="ml-auto">就绪</span>
      </div>
    </div>
  )
}
