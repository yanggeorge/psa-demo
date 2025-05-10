'use client';

import {
  BarChart,
  Clipboard,
  Copy,
  Edit,
  Eye,
  FileDown,
  FileIcon,
  FileUp,
  LogOut,
  Maximize,
  Play,
  Plus,
  Redo2,
  Save,
  Scissors,
  Settings,
  Undo2,
  User,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { logOut } from '@/lib/actions';
export function Menu() {
  const { data: session } = useSession();

  // 移动端菜单状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const leftMenuRef = useRef<HTMLDivElement>(null);
  const rightMenuRef = useRef<HTMLDivElement>(null);

  // 处理菜单按钮点击
  const handleMenuClick = (menuName: string) => {
    if (activeMenu === menuName) {
      // 如果点击的是当前活跃菜单，则关闭菜单
      setActiveMenu(null);
    } else {
      // 否则切换到新菜单
      setActiveMenu(menuName);
    }
  };

  // 处理菜单按钮悬停
  const handleMenuHover = (menuName: string) => {
    // 只有当已经有菜单打开时，悬停才会切换菜单
    if (activeMenu !== null) {
      setActiveMenu(menuName);
    }
  };

  // 处理菜单项点击
  const handleMenuItemClick = (action: () => void | Promise<void> = () => {}) => {
    console.log('handleMenuItemClick');
    try {
      // 统一处理同步和异步函数
      Promise.resolve(action());
    } catch (error) {
      console.error('Action execution failed:', error);
    }

    // 关闭菜单
    setActiveMenu(null);
  };

  // 处理登出
  const handleSignOut = async () => {
    console.log('Logging out...');
    await logOut();
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      console.log('handleClickOutside triggered');
      if (
        leftMenuRef.current &&
        !leftMenuRef.current.contains(event.target as Node) &&
        rightMenuRef.current &&
        !rightMenuRef.current.contains(event.target as Node)
      ) {
        console.log('Outside click detected, closing menu');
        setActiveMenu(null);
      }
    };

    if (activeMenu !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenu]);

  // 渲染菜单内容
  const renderMenuContent = () => {
    switch (activeMenu) {
      case 'file':
        return (
          <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md bg-popover p-1 shadow-md">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <FileIcon className="mr-2 size-4" />
              <span>新建模型</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <FileUp className="mr-2 size-4" />
              <span>导入模型文件</span>
            </Button>
            <div className="my-1 h-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <Save className="mr-2 size-4" />
              <span>保存模型</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <FileDown className="mr-2 size-4" />
              <span>导出模型文件</span>
            </Button>
          </div>
        );
      case 'edit':
        return (
          <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md bg-popover p-1 shadow-md">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <Undo2 className="mr-2 size-4" />
              <span>撤销</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <Redo2 className="mr-2 size-4" />
              <span>恢复</span>
            </Button>
            <div className="my-1 h-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <Scissors className="mr-2 size-4" />
              <span>剪切</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <Copy className="mr-2 size-4" />
              <span>复制</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <Clipboard className="mr-2 size-4" />
              <span>粘贴</span>
            </Button>
            <div className="my-1 h-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick(() => console.log('添加元素'))}
            >
              <Plus className="mr-2 size-4" />
              <span>添加元素</span>
            </Button>
          </div>
        );
      case 'view':
        return (
          <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md bg-popover p-1 shadow-md">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <ZoomOut className="mr-2 size-4" />
              <span>缩小</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <ZoomIn className="mr-2 size-4" />
              <span>放大</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <Maximize className="mr-2 size-4" />
              <span>适中</span>
            </Button>
          </div>
        );
      case 'analysis':
        return (
          <div className="absolute left-0 top-full z-50 mt-1 w-48 rounded-md bg-popover p-1 shadow-md">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <Play className="mr-2 size-4" />
              <span>运行</span>
            </Button>
          </div>
        );
      case 'user':
        return (
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md bg-popover p-1 shadow-md">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              <User className="mr-2 size-4" />
              <span>个人资料</span>
            </Button>
            <div className="my-1 h-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick(handleSignOut)}
            >
              <LogOut className="mr-2 size-4" />
              <span>退出登录</span>
            </Button>
          </div>
        );
      case 'settings':
        return (
          <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md bg-popover p-1 shadow-md">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              应用设置
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              用户偏好
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              主题设置
            </Button>
            <div className="my-1 h-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => handleMenuItemClick()}
            >
              关于
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* 桌面端水平菜单 */}
      <div className="hidden justify-between border-b bg-background md:flex">
        <div className="flex items-center">
          <div className="px-4 py-2 font-semibold text-primary">PSA分析</div>
          <div className="flex items-center space-x-1 p-1" ref={leftMenuRef}>
            {/* 文件菜单 */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 ${activeMenu === 'file' ? 'bg-accent' : ''}`}
                onClick={() => handleMenuClick('file')}
                onMouseEnter={() => handleMenuHover('file')}
              >
                文件
              </Button>
              {activeMenu === 'file' && renderMenuContent()}
            </div>

            {/* 编辑菜单 */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 ${activeMenu === 'edit' ? 'bg-accent' : ''}`}
                onClick={() => handleMenuClick('edit')}
                onMouseEnter={() => handleMenuHover('edit')}
              >
                编辑
              </Button>
              {activeMenu === 'edit' && renderMenuContent()}
            </div>

            {/* 视图菜单 */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 ${activeMenu === 'view' ? 'bg-accent' : ''}`}
                onClick={() => handleMenuClick('view')}
                onMouseEnter={() => handleMenuHover('view')}
              >
                视图
              </Button>
              {activeMenu === 'view' && renderMenuContent()}
            </div>

            {/* 分析菜单 */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 ${activeMenu === 'analysis' ? 'bg-accent' : ''}`}
                onClick={() => handleMenuClick('analysis')}
                onMouseEnter={() => handleMenuHover('analysis')}
              >
                分析
              </Button>
              {activeMenu === 'analysis' && renderMenuContent()}
            </div>
          </div>
        </div>

        {/* 右侧用户和设置 */}
        <div className="mr-2 flex items-center" ref={rightMenuRef}>
          {session ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 gap-2 ${activeMenu === 'user' ? 'bg-accent' : ''}`}
                onClick={() => handleMenuClick('user')}
                onMouseEnter={() => handleMenuHover('user')}
              >
                <Avatar className="size-6">
                  <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span>{session.user?.name || '用户'}</span>
              </Button>
              {activeMenu === 'user' && renderMenuContent()}
            </div>
          ) : null}

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className={`ml-2 size-8 ${activeMenu === 'settings' ? 'bg-accent' : ''}`}
              onClick={() => handleMenuClick('settings')}
              onMouseEnter={() => handleMenuHover('settings')}
            >
              <Settings className="size-4" />
            </Button>
            {activeMenu === 'settings' && renderMenuContent()}
          </div>
        </div>
      </div>

      {/* 移动端菜单 */}
      <div className="flex items-center justify-between border-b p-2 md:hidden">
        <div className="font-semibold text-primary">PSA分析</div>
        <div className="flex items-center">
          {session ? (
            <Avatar className="mr-2 size-7">
              <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          ) : null}

          <Button variant="ghost" size="icon" className="mr-1 size-8">
            <Settings className="size-4" />
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
          <div className="absolute inset-x-0 top-12 z-50 border-b bg-background p-2 shadow-lg">
            <Button variant="ghost" className="mb-1 w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
              <FileIcon className="mr-2 size-4" />
              文件
            </Button>
            <Button variant="ghost" className="mb-1 w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
              <Edit className="mr-2 size-4" />
              编辑
            </Button>
            <Button variant="ghost" className="mb-1 w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
              <Eye className="mr-2 size-4" />
              视图
            </Button>
            <Button variant="ghost" className="mb-1 w-full justify-start" onClick={() => setMobileMenuOpen(false)}>
              <BarChart className="mr-2 size-4" />
              分析
            </Button>
            {session && (
              <>
                <div className="my-1 h-px bg-border" />
                <Button variant="ghost" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="mr-2 size-4" />
                  退出登录
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
