"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Minimize, Maximize, Move } from "lucide-react"

export function FloatingWindow() {
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // 处理拖拽开始
  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  // 处理拖拽中
  const handleDrag = (e: React.MouseEvent) => {
    if (isDragging && !isMaximized) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    setIsDragging(false)
  }

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

  // 处理窗口关闭
  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div
      className={`absolute ${isMaximized ? "inset-0" : ""}`}
      style={
        isMaximized
          ? {}
          : {
              left: `${position.x}px`,
              top: `${position.y}px`,
              width: isMinimized ? "200px" : "300px",
            }
      }
    >
      <Card className="shadow-lg border">
        <CardHeader
          className="p-2 flex flex-row items-center justify-between cursor-move"
          onMouseDown={handleDragStart}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <CardTitle className="text-sm flex items-center">
            <Move className="h-4 w-4 mr-2" />
            属性面板
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleMinimize}>
              <Minimize className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleMaximize}>
              <Maximize className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleClose}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-3">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">名称</label>
                <input type="text" className="w-full mt-1 px-2 py-1 text-sm border rounded" defaultValue="示例对象" />
              </div>
              <div>
                <label className="text-sm font-medium">尺寸</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input type="text" className="px-2 py-1 text-sm border rounded" defaultValue="100" />
                  <input type="text" className="px-2 py-1 text-sm border rounded" defaultValue="100" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">颜色</label>
                <input type="color" className="w-full mt-1 h-8 p-0 border rounded" defaultValue="#ff5722" />
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
