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

// 示例XML数据 - 增加了更多的基本事件（B3到B20）
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
    <define-basic-event name="B3">
      <label>B3</label>
      <float value="0.015"/>
    </define-basic-event>
    <define-basic-event name="B4">
      <label>B4</label>
      <float value="0.025"/>
    </define-basic-event>
    <define-basic-event name="B5">
      <label>B5</label>
      <float value="0.035"/>
    </define-basic-event>
    <define-basic-event name="B6">
      <label>B6</label>
      <float value="0.045"/>
    </define-basic-event>
    <define-basic-event name="B7">
      <label>B7</label>
      <float value="0.055"/>
    </define-basic-event>
    <define-basic-event name="B8">
      <label>B8</label>
      <float value="0.065"/>
    </define-basic-event>
    <define-basic-event name="B9">
      <label>B9</label>
      <float value="0.075"/>
    </define-basic-event>
    <define-basic-event name="B10">
      <label>B10</label>
      <float value="0.085"/>
    </define-basic-event>
    <define-basic-event name="B11">
      <label>B11</label>
      <float value="0.095"/>
    </define-basic-event>
    <define-basic-event name="B12">
      <label>B12</label>
      <float value="0.105"/>
    </define-basic-event>
    <define-basic-event name="B13">
      <label>B13</label>
      <float value="0.115"/>
    </define-basic-event>
    <define-basic-event name="B14">
      <label>B14</label>
      <float value="0.125"/>
    </define-basic-event>
    <define-basic-event name="B15">
      <label>B15</label>
      <float value="0.135"/>
    </define-basic-event>
    <define-basic-event name="B16">
      <label>B16</label>
      <float value="0.145"/>
    </define-basic-event>
    <define-basic-event name="B17">
      <label>B17</label>
      <float value="0.155"/>
    </define-basic-event>
    <define-basic-event name="B18">
      <label>B18</label>
      <float value="0.165"/>
    </define-basic-event>
    <define-basic-event name="B19">
      <label>B19</label>
      <float value="0.175"/>
    </define-basic-event>
    <define-basic-event name="B20">
      <label>B20</label>
      <float value="0.185"/>
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
  const [basicEventsExpanded, setBasicEventsExpanded] = useState(true) // 默认展开基本事件
  const [houseEventsExpanded, setHouseEventsExpanded] = useState(false)
  const [filterText, setFilterText] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingElement, setEditingElement] = useState<any>(null)
  const [isNewTreeDialogOpen, setIsNewTreeDialogOpen] = useState(false)
  const [newTreeName, setNewTreeName] = useState("")

  // 解析XML数据
  useEffect(() => {
    try {
      const data = parseXML(sampleXmlData)
      setParsedData(data)
    } catch (err) {
      console.error("解析XML数据时出错:", err)
    }
  }, [])

  // 当侧边栏状态改变时，发送自定义事件
  useEffect(() => {
    // 发送侧边栏状态变化事件
    const event = new CustomEvent("leftSidebarToggle", {
      detail: { collapsed },
    })
    window.dispatchEvent(event)
  }, [collapsed])

  // Update the openElementTab function to handle tab opening for different element types
  const openElementTab = (elementType: string) => {
    // Create a custom event to open the correct element type tab
    const event = new CustomEvent("openElementTab", {
      detail: { elementType },
    })
    window.dispatchEvent(event)
  }

  // Add a new function for double-click to edit specific elements
  const editElement = (elementType: string, elementId: string) => {
    // Create a custom event to open the edit dialog for specific element
    const event = new CustomEvent("editElement", {
      detail: { elementType, elementId },
    })
    window.dispatchEvent(event)
  }

  // 打开特定元素
  const openElement = (elementType: string, elementId: string) => {
    // 这里可以实现定位到特定元素的逻辑
    console.log(`打开元素: ${elementType} - ${elementId}`)
    // 先打开对应的标签页
    openElementTab(elementType)
    // 然后可以发送另一个事件，让工作区定位到特定元素
    const event = new CustomEvent("locateElement", {
      detail: { elementType, elementId },
    })
    window.dispatchEvent(event)
  }

  // 打开特定故障树标签页
  const openFaultTreeTab = (treeName: string) => {
    const event = new CustomEvent("openFaultTreeTab", {
      detail: { treeName },
    })
    window.dispatchEvent(event)
  }

  // 创建新故障树
  const createNewFaultTree = () => {
    if (!newTreeName.trim()) return

    // 创建新故障树事件
    const event = new CustomEvent("createFaultTree", {
      detail: { treeName: newTreeName },
    })
    window.dispatchEvent(event)

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
    <div
      className={`border-r bg-muted/20 transition-all ${collapsed ? "w-12" : "w-64"} flex flex-col h-full overflow-hidden`}
    >
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
        <div className="flex-1 overflow-y-auto p-2 thin-scrollbar">
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
                    onDoubleClick={() => {
                      setEditingElement(gate)
                      setEditDialogOpen(true)
                    }}
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
                    onDoubleClick={() => {
                      setEditingElement(event)
                      setEditDialogOpen(true)
                    }}
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
                    onDoubleClick={() => {
                      setEditingElement(event)
                      setEditDialogOpen(true)
                    }}
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openElementTab("faultTreeViewer")}
            title="故障树列表"
          >
            <Network className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openElementTab("gates")}
            title="门列表"
          >
            <Gate className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openElementTab("basicEvents")}
            title="基本事件列表"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openElementTab("houseEvents")}
            title="房屋事件列表"
          >
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
      {/* 编辑元素对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          {editingElement && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {editingElement.type === "and" || editingElement.type === "or"
                    ? "编辑门"
                    : "probability" in editingElement
                      ? "编辑基本事件"
                      : "编辑房屋事件"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-id" className="text-right">
                    ID
                  </Label>
                  <Input id="edit-id" value={editingElement.name || ""} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-label" className="text-right">
                    标签
                  </Label>
                  <Input
                    id="edit-label"
                    value={editingElement.label || ""}
                    onChange={(e) => setEditingElement({ ...editingElement, label: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                {/* 门特有的字段 */}
                {"type" in editingElement && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-type" className="text-right">
                      类型
                    </Label>
                    <select
                      id="edit-type"
                      value={editingElement.type}
                      onChange={(e) => setEditingElement({ ...editingElement, type: e.target.value })}
                      className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="and">AND</option>
                      <option value="or">OR</option>
                      <option value="xor">XOR</option>
                      <option value="not">NOT</option>
                      <option value="nand">NAND</option>
                      <option value="nor">NOR</option>
                    </select>
                  </div>
                )}
                {/* 基本事件特有的字段 */}
                {"probability" in editingElement && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-probability" className="text-right">
                      概率
                    </Label>
                    <Input
                      id="edit-probability"
                      type="number"
                      min="0"
                      max="1"
                      step="0.001"
                      value={editingElement.probability}
                      onChange={(e) =>
                        setEditingElement({ ...editingElement, probability: Number.parseFloat(e.target.value) })
                      }
                      className="col-span-3"
                    />
                  </div>
                )}
                {/* 房屋事件特有的字段 */}
                {"state" in editingElement && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-state" className="text-right">
                      状态
                    </Label>
                    <div className="col-span-3 flex items-center">
                      <input
                        id="edit-state"
                        type="checkbox"
                        checked={editingElement.state}
                        onChange={(e) => setEditingElement({ ...editingElement, state: e.target.checked })}
                        className="mr-2"
                      />
                      <span>{editingElement.state ? "TRUE" : "FALSE"}</span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  取消
                </Button>
                <Button
                  onClick={() => {
                    console.log("保存编辑的元素:", editingElement)
                    setEditDialogOpen(false)
                  }}
                >
                  保存
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
