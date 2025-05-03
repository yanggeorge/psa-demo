"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GatesTable } from "./tables/gates-table"
import { BasicEventsTable } from "./tables/basic-events-table"
import { HouseEventsTable } from "./tables/house-events-table"
import { FaultTreeViewer } from "./fault-tree-viewer"
import { ReportViewer } from "./report-viewer"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, X } from "lucide-react"

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

// 每个标签的固定宽度
const FIXED_TAB_WIDTH = 120 // 单位：像素
// 更多标签按钮的宽度
const MORE_TABS_BUTTON_WIDTH = 100 // 单位：像素
// 关闭所有标签按钮的宽度
const CLOSE_ALL_BUTTON_WIDTH = 40 // 单位：像素
// 其他UI元素（边框、内边距等）占用的空间
const UI_ELEMENTS_WIDTH = 20 // 单位：像素
// 左侧边栏展开和收起的宽度
const LEFT_SIDEBAR_EXPANDED_WIDTH = 256 // 64rem = 256px
const LEFT_SIDEBAR_COLLAPSED_WIDTH = 48 // 12rem = 48px
// 右侧边栏展开和收起的宽度
const RIGHT_SIDEBAR_EXPANDED_WIDTH = 256 // 64rem = 256px
const RIGHT_SIDEBAR_COLLAPSED_WIDTH = 48 // 12rem = 48px

export function WorkArea() {
  // 标签页管理
  const [tabs, setTabs] = useState<TabInfo[]>([])
  const [activeTab, setActiveTab] = useState<string>("")
  const [containerWidth, setContainerWidth] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true) // 默认右侧边栏是收起的
  const tabContainerRef = useRef<HTMLDivElement>(null)

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    // 初始化窗口宽度
    setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // 监听左侧边栏状态变化
  useEffect(() => {
    const handleLeftSidebarToggle = (event: CustomEvent<{ collapsed: boolean }>) => {
      setLeftSidebarCollapsed(event.detail.collapsed)
    }

    window.addEventListener("leftSidebarToggle", handleLeftSidebarToggle as EventListener)

    return () => {
      window.removeEventListener("leftSidebarToggle", handleLeftSidebarToggle as EventListener)
    }
  }, [])

  // 监听右侧边栏状态变化
  useEffect(() => {
    const handleRightSidebarToggle = (event: CustomEvent<{ collapsed: boolean }>) => {
      setRightSidebarCollapsed(event.detail.collapsed)
    }

    window.addEventListener("rightSidebarToggle", handleRightSidebarToggle as EventListener)

    return () => {
      window.removeEventListener("rightSidebarToggle", handleRightSidebarToggle as EventListener)
    }
  }, [])

  // 计算工作区实际宽度
  const workAreaWidth = useMemo(() => {
    const leftSidebarWidth = leftSidebarCollapsed ? LEFT_SIDEBAR_COLLAPSED_WIDTH : LEFT_SIDEBAR_EXPANDED_WIDTH
    const rightSidebarWidth = rightSidebarCollapsed ? RIGHT_SIDEBAR_COLLAPSED_WIDTH : RIGHT_SIDEBAR_EXPANDED_WIDTH

    // 总宽度减去两侧边栏宽度
    return windowWidth - leftSidebarWidth - rightSidebarWidth
  }, [windowWidth, leftSidebarCollapsed, rightSidebarCollapsed])

  // 计算可见和隐藏的标签页
  const { visibleTabs, hiddenTabs } = useMemo(() => {
    // 如果工作区宽度为0，说明还没有测量，返回所有标签
    if (workAreaWidth === 0) {
      return {
        visibleTabs: tabs,
        hiddenTabs: [],
      }
    }

    // 计算可用于显示标签的宽度
    // 总是为关闭所有按钮预留空间
    const availableWidth = workAreaWidth - CLOSE_ALL_BUTTON_WIDTH - UI_ELEMENTS_WIDTH

    // 计算可以显示的标签数量
    let maxVisibleTabs = Math.floor(availableWidth / FIXED_TAB_WIDTH)

    // 如果有隐藏的标签，需要为"更多标签"按钮预留空间
    if (maxVisibleTabs < tabs.length) {
      maxVisibleTabs = Math.floor((availableWidth - MORE_TABS_BUTTON_WIDTH) / FIXED_TAB_WIDTH)
    }

    // 确保至少显示一个标签
    maxVisibleTabs = Math.max(1, maxVisibleTabs)
    // 确保不超过标签总数
    maxVisibleTabs = Math.min(maxVisibleTabs, tabs.length)

    // 如果所有标签都可以显示
    if (maxVisibleTabs >= tabs.length) {
      return {
        visibleTabs: tabs,
        hiddenTabs: [],
      }
    }

    // 确保活动标签总是可见的
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
    let visibleIndexes: number[] = []

    // 如果活动标签在可见范围内，就显示前maxVisibleTabs个标签
    if (activeTabIndex < maxVisibleTabs) {
      visibleIndexes = Array.from({ length: maxVisibleTabs }, (_, i) => i)
    } else {
      // 活动标签不在可见范围内，需要确保它可见
      // 显示活动标签及其前后的标签
      const startIdx = Math.max(0, activeTabIndex - Math.floor(maxVisibleTabs / 2))
      const endIdx = Math.min(tabs.length - 1, startIdx + maxVisibleTabs - 1)

      visibleIndexes = Array.from({ length: endIdx - startIdx + 1 }, (_, i) => startIdx + i)
    }

    const visible = tabs.filter((_, index) => visibleIndexes.includes(index))
    const hidden = tabs.filter((_, index) => !visibleIndexes.includes(index))

    return { visibleTabs: visible, hiddenTabs: hidden }
  }, [tabs, activeTab, workAreaWidth])

  // 监听来自侧边栏的事件
  useEffect(() => {
    const handleOpenElementTab = (event: CustomEvent<{ elementType: string }>) => {
      const { elementType } = event.detail

      // 检查标签页是否已存在
      const existingTabIndex = tabs.findIndex((tab) => tab.type === elementType)

      if (existingTabIndex === -1) {
        // 如果标签页不存在，添加它
        const newTab: TabInfo = {
          id: `tab-${Date.now()}`,
          type: elementType,
          label:
            elementType === "gates"
              ? "门"
              : elementType === "basicEvents"
                ? "基本事件"
                : elementType === "houseEvents"
                  ? "房屋事件"
                  : "故障树可视化",
        }

        setTabs((prev) => [...prev, newTab])
        setActiveTab(newTab.id)
      } else {
        // 如果标签页已存在，激活它
        setActiveTab(tabs[existingTabIndex].id)
      }
    }

    // 添加事件监听器
    window.addEventListener("openElementTab", handleOpenElementTab as EventListener)

    // 清理函数
    return () => {
      window.removeEventListener("openElementTab", handleOpenElementTab as EventListener)
    }
  }, [tabs])

  // 监听打开故障树标签页事件
  useEffect(() => {
    const handleOpenFaultTreeTab = (event: CustomEvent<{ treeName: string }>) => {
      const { treeName } = event.detail

      // 检查该故障树的标签页是否已存在
      const existingTabIndex = tabs.findIndex((tab) => tab.type === "faultTree" && tab.treeName === treeName)

      if (existingTabIndex === -1) {
        // 如果标签页不存在，添加它
        const newTab: TabInfo = {
          id: `tree-${Date.now()}`,
          type: "faultTree",
          label: treeName,
          treeName: treeName,
        }

        setTabs((prev) => [...prev, newTab])
        setActiveTab(newTab.id)
      } else {
        // 如果标签页已存在，激活它
        setActiveTab(tabs[existingTabIndex].id)
      }
    }

    window.addEventListener("openFaultTreeTab", handleOpenFaultTreeTab as EventListener)

    return () => {
      window.removeEventListener("openFaultTreeTab", handleOpenFaultTreeTab as EventListener)
    }
  }, [tabs])

  // 监听创建新故障树事件
  useEffect(() => {
    const handleCreateFaultTree = (event: CustomEvent<{ treeName: string }>) => {
      const { treeName } = event.detail

      // 创建新标签页
      const newTab: TabInfo = {
        id: `tree-${Date.now()}`,
        type: "faultTree",
        label: treeName,
        treeName: treeName,
      }

      setTabs((prev) => [...prev, newTab])
      setActiveTab(newTab.id)
    }

    window.addEventListener("createFaultTree", handleCreateFaultTree as EventListener)

    return () => {
      window.removeEventListener("createFaultTree", handleCreateFaultTree as EventListener)
    }
  }, [])

  // 监听打开报告标签页事件
  useEffect(() => {
    const handleOpenReportTab = (event: CustomEvent<{ reportName: string }>) => {
      const { reportName } = event.detail

      // 检查该报告的标签页是否已存在
      const existingTabIndex = tabs.findIndex((tab) => tab.type === "report" && tab.label === reportName)

      if (existingTabIndex === -1) {
        // 如果标签页不存在，添加它
        const newTab: TabInfo = {
          id: `report-${Date.now()}`,
          type: "report",
          label: reportName,
        }

        setTabs((prev) => [...prev, newTab])
        setActiveTab(newTab.id)
      } else {
        // 如果标签页已存在，激活它
        setActiveTab(tabs[existingTabIndex].id)
      }
    }

    window.addEventListener("openReportTab", handleOpenReportTab as EventListener)

    return () => {
      window.removeEventListener("openReportTab", handleOpenReportTab as EventListener)
    }
  }, [tabs])

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
        <div className="border-b flex items-center w-full" ref={tabContainerRef}>
          {/* 使用flex-1让标签列表占据所有可用空间 */}
          <div className="flex-1 flex items-center justify-between">
            {/* 左侧标签列表 */}
            <div className="flex items-center">
              <TabsList className="h-9">
                {visibleTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="text-xs flex items-center gap-1 relative pr-8 w-[120px]"
                  >
                    <span className="truncate">{tab.label}</span>
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

            {/* 右侧按钮组 */}
            <div className="flex items-center">
              {hiddenTabs.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8">
                      <span className="mr-1">更多标签</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {hiddenTabs.map((tab) => (
                      <DropdownMenuItem
                        key={tab.id}
                        className="flex justify-between items-center"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span className="truncate">{tab.label}</span>
                        <button
                          className="rounded-full hover:bg-muted p-0.5 ml-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            closeTab(tab.id, e)
                          }}
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
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {tabs.length > 0 && (
                <div className="flex items-center px-2 border-l ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      // Close all tabs
                      setTabs([])
                      setActiveTab("")
                    }}
                    title="关闭所有标签页"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="flex-1 relative data-[state=inactive]:hidden">
            {tab.type === "gates" && <GatesTable />}
            {tab.type === "basicEvents" && <BasicEventsTable />}
            {tab.type === "houseEvents" && <HouseEventsTable />}
            {tab.type === "faultTree" && <FaultTreeViewer xmlData={sampleXmlData} initialTreeName={tab.treeName} />}
            {tab.type === "report" && <ReportViewer reportName={tab.label} />}
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
                  : currentTabType === "report"
                    ? `报告 - ${tabs.find((tab) => tab.id === activeTab)?.label || ""}`
                    : ""}
        </span>
        <span className="ml-auto">就绪</span>
      </div>
    </div>
  )
}
