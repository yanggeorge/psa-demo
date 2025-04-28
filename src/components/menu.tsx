"use client"

import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  FileIcon,
  Edit,
  Save,
  FileUp,
  FileDown,
  Undo2,
  Redo2,
  Scissors,
  Copy,
  Clipboard,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize,
  Play,
  Eye,
  BarChart,
  Settings,
  User,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Menu() {
  // 移动端菜单状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <>
      {/* 桌面端水平菜单 */}
      <div className="hidden md:flex border-b bg-background justify-between">
        <div className="flex items-center">
          <div className="font-semibold px-4 py-2 text-primary">PSA分析</div>
          <div className="flex items-center space-x-1 p-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  文件
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <FileIcon className="mr-2 h-4 w-4" />
                  <span>新建模型</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileUp className="mr-2 h-4 w-4" />
                  <span>导入模型文件</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Save className="mr-2 h-4 w-4" />
                  <span>保存模型</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <FileDown className="mr-2 h-4 w-4" />
                  <span>导出模型文件</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  编辑
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <Undo2 className="mr-2 h-4 w-4" />
                  <span>撤销</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Redo2 className="mr-2 h-4 w-4" />
                  <span>恢复</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Scissors className="mr-2 h-4 w-4" />
                  <span>剪切</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" />
                  <span>复制</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clipboard className="mr-2 h-4 w-4" />
                  <span>粘贴</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>添加元素</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  视图
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <ZoomOut className="mr-2 h-4 w-4" />
                  <span>缩小</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ZoomIn className="mr-2 h-4 w-4" />
                  <span>放大</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Maximize className="mr-2 h-4 w-4" />
                  <span>适中</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8">
                  分析
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem>
                  <Play className="mr-2 h-4 w-4" />
                  <span>运行</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 右侧用户和设置 */}
        <div className="flex items-center mr-2">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>用户</AvatarFallback>
                  </Avatar>
                  <span>用户名</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>个人资料</DropdownMenuItem>
                <DropdownMenuItem>我的项目</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" className="h-8" onClick={() => setIsLoggedIn(true)}>
              <User className="mr-2 h-4 w-4" />
              登录/注册
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>应用设置</DropdownMenuItem>
              <DropdownMenuItem>用户偏好</DropdownMenuItem>
              <DropdownMenuItem>主题设置</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>关于</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className="md:hidden border-b p-2 flex justify-between items-center">
        <div className="font-semibold text-primary">PSA分析</div>
        <div className="flex items-center">
          {isLoggedIn ? (
            <Avatar className="h-7 w-7 mr-2">
              <AvatarFallback>用户</AvatarFallback>
            </Avatar>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 mr-1" onClick={() => setIsLoggedIn(true)}>
              <User className="h-4 w-4" />
            </Button>
          )}

          <Button variant="ghost" size="icon" className="h-8 w-8 mr-1">
            <Settings className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-12 left-0 right-0 bg-background border-b z-50 p-2 shadow-lg">
            <Button variant="ghost" className="w-full justify-start mb-1">
              <FileIcon className="mr-2 h-4 w-4" />
              文件
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-1">
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </Button>
            <Button variant="ghost" className="w-full justify-start mb-1">
              <Eye className="mr-2 h-4 w-4" />
              视图
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <BarChart className="mr-2 h-4 w-4" />
              分析
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
