"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Minimize, Maximize } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface NodeEditorProps {
  node: any
  onClose: () => void
  onUpdate: (updatedNode: any) => void
  viewportDimensions: { width: number; height: number }
}

export function NodeEditor({ node, onClose, onUpdate, viewportDimensions }: NodeEditorProps) {
  const [nodeData, setNodeData] = useState<any>(node)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    setNodeData(node)
  }, [node])

  // 处理窗口最小化
  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
    setIsMaximized(false)
  }

  // 处理窗口最大化
  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    setIsMinimized(false)
  }

  // 处理更新
  const handleUpdate = () => {
    onUpdate(nodeData)
  }

  // 根据节点类型渲染不同的编辑表单
  const renderEditorContent = () => {
    if (isMinimized) return null

    if (node.type === "gate") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gate-id">ID</Label>
            <Input
              id="gate-id"
              value={nodeData.id}
              onChange={(e) => setNodeData({ ...nodeData, id: e.target.value })}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gate-label">标签</Label>
            <Input
              id="gate-label"
              value={nodeData.data.label}
              onChange={(e) => setNodeData({ ...nodeData, data: { ...nodeData.data, label: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gate-type">类型</Label>
            <Select
              value={nodeData.data.type}
              onValueChange={(value) => setNodeData({ ...nodeData, data: { ...nodeData.data, type: value } })}
            >
              <SelectTrigger id="gate-type">
                <SelectValue placeholder="选择门类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="and">AND</SelectItem>
                <SelectItem value="or">OR</SelectItem>
                <SelectItem value="xor">XOR</SelectItem>
                <SelectItem value="not">NOT</SelectItem>
                <SelectItem value="nand">NAND</SelectItem>
                <SelectItem value="nor">NOR</SelectItem>
                <SelectItem value="iff">IFF</SelectItem>
                <SelectItem value="imply">IMPLY</SelectItem>
                <SelectItem value="atleast">ATLEAST</SelectItem>
                <SelectItem value="cardinality">CARDINALITY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(nodeData.data.type === "atleast" || nodeData.data.type === "cardinality") && (
            <div className="space-y-2">
              <Label htmlFor="gate-k">K值 (至少K个输入为真)</Label>
              <Input
                id="gate-k"
                type="number"
                min="1"
                value={nodeData.data.k || 1}
                onChange={(e) =>
                  setNodeData({ ...nodeData, data: { ...nodeData.data, k: Number.parseInt(e.target.value) } })
                }
              />
            </div>
          )}
          {nodeData.data.type === "cardinality" && (
            <div className="space-y-2">
              <Label htmlFor="gate-l">L值 (最多L个输入为真)</Label>
              <Input
                id="gate-l"
                type="number"
                min="1"
                value={nodeData.data.l || 1}
                onChange={(e) =>
                  setNodeData({ ...nodeData, data: { ...nodeData.data, l: Number.parseInt(e.target.value) } })
                }
              />
            </div>
          )}
        </div>
      )
    } else if (node.type === "basicEvent") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-id">ID</Label>
            <Input
              id="event-id"
              value={nodeData.id}
              onChange={(e) => setNodeData({ ...nodeData, id: e.target.value })}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-label">标签</Label>
            <Input
              id="event-label"
              value={nodeData.data.label}
              onChange={(e) => setNodeData({ ...nodeData, data: { ...nodeData.data, label: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="event-probability">概率</Label>
            <Input
              id="event-probability"
              type="number"
              min="0"
              max="1"
              step="0.001"
              value={nodeData.data.probability}
              onChange={(e) =>
                setNodeData({
                  ...nodeData,
                  data: { ...nodeData.data, probability: Number.parseFloat(e.target.value) },
                })
              }
            />
          </div>
        </div>
      )
    } else if (node.type === "houseEvent") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="house-id">ID</Label>
            <Input
              id="house-id"
              value={nodeData.id}
              onChange={(e) => setNodeData({ ...nodeData, id: e.target.value })}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="house-label">标签</Label>
            <Input
              id="house-label"
              value={nodeData.data.label}
              onChange={(e) => setNodeData({ ...nodeData, data: { ...nodeData.data, label: e.target.value } })}
            />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="house-state"
              checked={nodeData.data.state}
              onCheckedChange={(checked) => setNodeData({ ...nodeData, data: { ...nodeData.data, state: checked } })}
            />
            <Label htmlFor="house-state">状态: {nodeData.data.state ? "TRUE" : "FALSE"}</Label>
          </div>
        </div>
      )
    }

    return <div>未知节点类型</div>
  }

  // 计算编辑器位置和尺寸
  const editorStyle = isMaximized
    ? { position: "absolute", inset: "10px", width: "auto", height: "auto", zIndex: 50 }
    : {
        position: "absolute",
        top: "10px",
        right: "10px",
        width: isMinimized ? "200px" : "350px",
        zIndex: 50,
      }

  return (
    <div style={editorStyle as React.CSSProperties}>
      <Card className="shadow-lg border">
        <CardHeader className="p-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center">
            {node.type === "gate"
              ? "编辑门"
              : node.type === "basicEvent"
                ? "编辑基本事件"
                : node.type === "houseEvent"
                  ? "编辑房屋事件"
                  : "编辑节点"}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleMinimize}>
              <Minimize className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleMaximize}>
              <Maximize className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4">
            {renderEditorContent()}
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={onClose}>
                取消
              </Button>
              <Button onClick={handleUpdate}>保存</Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
