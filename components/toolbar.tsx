"use client"

import {
  Clipboard,
  Copy,
  FileDown,
  FileIcon,
  FileUp,
  Maximize,
  Play,
  Plus,
  Redo2,
  Save,
  Scissors,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Toolbar() {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-1">
      <TooltipProvider>
        {/* 文件操作 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <FileIcon className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>新建模型</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <FileUp className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>导入模型文件</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Save className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>保存模型</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <FileDown className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>导出模型文件</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* 添加元素 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Plus className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>添加元素</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* 编辑操作 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Undo2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>撤销</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Redo2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>恢复</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Scissors className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>剪切</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Copy className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>复制</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Clipboard className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>粘贴</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* 视图操作 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ZoomOut className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>缩小</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ZoomIn className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>放大</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Maximize className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>适中</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* 分析操作 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <Play className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>运行</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
