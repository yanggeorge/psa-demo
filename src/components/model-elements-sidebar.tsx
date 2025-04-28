"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  ChevronDown,
  Network,
  DoorOpenIcon as Gate,
  Circle,
  Home,
  ChevronLeft,
  Plus,
  Search,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { parseXML } from "@/lib/xml-parser"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useNavigate } from "@tanstack/react-router"

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

export function ModelElementsSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)
  const [gatesExpanded, setGatesExpanded] = useState(false)
  const [basicEventsExpanded, setBasicEventsExpanded] = useState(false)
  const [houseEventsExpanded, setHouseEventsExpanded] = useState(false)
  const [filterText, setFilterText] = useState("")
  const [isNewTreeDialogOpen, setIsNewTreeDialogOpen] = useState(false)
  const [newTreeName, setNewTreeName] = useState("")
  const navigate = useNavigate()

  // 解析XML数据
  useEffect(() => {
    try {
      const data = parseXML(sampleXmlData)
      setParsedData(data)
    } catch (err) {
      console.error("解析XML数据时出错:", err)
    }
  }, [])

  // 打开特定元素
  const openElement = (elementType: string, elementId: string) => {
    // 这里可以实现定位到特定元素的逻辑
    console.log(`打开元素: ${elementType} - ${elementId}`)
    // 导航到对应的路由
    navigate({ to: `/${elementType}` })
  }

  // 打开特定故障树标签页
  const openFaultTreeTab = (treeName: string) => {
    navigate({ to: `/fault-tree/${treeName}` })
  }

  // 创建新故障树
  const createNewFaultTree = () => {
    if (!newTreeName.trim()) return

    // 导航到新故障树页面
    navigate({ to: `/fault-tree/${newTreeName}` })

    // 重置状态
    setNewTreeName("")
    setIsNewTreeDialogOpen(false)
  }

  // 过滤元素
  const filterElements = (items: any[], nameKey = "name") => {
    if (!filterText) return items
    return items.filter(
      (item) =>
        item[nameKey].toLowerCase().includes(filterText.toLowerCase()) ||
        (item.label && item.label.toLowerCase().includes(filterText.toLowerCase())),
    )
  }

  // 过滤后的数据
  const filteredTrees = parsedData ? filterElements(parsedData.faultTrees) : []
  const filteredGates = parsedData ? filterElements(parsedData.gates) : []
  const filteredBasicEvents = parsedData ? filterElements(parsedData.basicEvents) : []
  const filteredHouseEvents = parsedData ? filterElements(parsedData.houseEvents) : []

  return (
    <div className={`border-r bg-muted/20 transition-all ${collapsed ? "w-12" : "w-64"} flex flex-col`}>
      <div className="p-2 flex justify-between items-center border-b">
        <h2 className={`font-medium text-sm ${collapsed ? "hidden" : "block"}`}>模型元素</h2>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-7 w-7">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {!collapsed && (
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="过滤元素..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
      )}

      {!collapsed ? (
        <div className="flex-1 overflow-auto p-2">
          <Collapsible defaultOpen className="mb-2">
            <div className="flex items-center justify-between">
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm hover:bg-muted rounded-md">
                <div className="flex items-center">
                  <Network className="h-4 w-4 mr-2" />
                  <span>故障树</span>
                </div>
                <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 ml-1"
                onClick={() => setIsNewTreeDialogOpen(true)}
                title="新增故障树"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <CollapsibleContent>
              <div className="pl-6 mt-1 space-y-1">
                {filteredTrees.map((tree: any) => (
                  <Button
                    key={tree.name}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={() => openFaultTreeTab(tree.name)}
                  >
                    {tree.name}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={gatesExpanded} onOpenChange={setGatesExpanded} className="mb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm hover:bg-muted rounded-md">
              <div className="flex items-center">
                <Gate className="h-4 w-4 mr-2" />
                <span>门</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs mr-2">
                  {filteredGates.length || 0}
                </Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${gatesExpanded ? "rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pl-6 mt-1 space-y-1">
                {filteredGates.map((gate: any) => (
                  <Button
                    key={gate.name}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={() => openElement("gates", gate.name)}
                  >
                    <span className="truncate">{gate.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({gate.type})</span>
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={basicEventsExpanded} onOpenChange={setBasicEventsExpanded} className="mb-2">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm hover:bg-muted rounded-md">
              <div className="flex items-center">
                <Circle className="h-4 w-4 mr-2" />
                <span>基本事件</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs mr-2">
                  {filteredBasicEvents.length || 0}
                </Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${basicEventsExpanded ? "rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pl-6 mt-1 space-y-1">
                {filteredBasicEvents.map((event: any) => (
                  <Button
                    key={event.name}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={() => openElement("basicEvents", event.name)}
                  >
                    <span className="truncate">{event.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({event.probability})</span>
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={houseEventsExpanded} onOpenChange={setHouseEventsExpanded}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm hover:bg-muted rounded-md">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                <span>房屋事件</span>
              </div>
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs mr-2">
                  {filteredHouseEvents.length || 0}
                </Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${houseEventsExpanded ? "rotate-180" : ""}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pl-6 mt-1 space-y-1">
                {filteredHouseEvents.map((event: any) => (
                  <Button
                    key={event.name}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-7"
                    onClick={() => openElement("houseEvents", event.name)}
                  >
                    <span className="truncate">{event.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">({event.state ? "TRUE" : "FALSE"})</span>
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center pt-2 space-y-4">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate({ to: "/fault-tree" })}>
            <Network className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate({ to: "/gates" })}>
            <Gate className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate({ to: "/basic-events" })}>
            <Circle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate({ to: "/house-events" })}>
            <Home className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* 新增故障树对话框 */}
      <Dialog open={isNewTreeDialogOpen} onOpenChange={setIsNewTreeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增故障树</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tree-name" className="text-right">
                名称
              </Label>
              <Input
                id="tree-name"
                value={newTreeName}
                onChange={(e) => setNewTreeName(e.target.value)}
                className="col-span-3"
                placeholder="请输入故障树名称"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewTreeDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={createNewFaultTree} disabled={!newTreeName.trim()}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
