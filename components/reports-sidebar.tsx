'use client';

import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export function ReportsSidebar() {
  const [collapsed, setCollapsed] = useState(true);

  // 当侧边栏状态改变时，发送自定义事件
  useEffect(() => {
    // 发送侧边栏状态变化事件
    const event = new CustomEvent('rightSidebarToggle', {
      detail: { collapsed },
    });
    window.dispatchEvent(event);
  }, [collapsed]);

  return (
    <div
      className={`border-l bg-muted/20 transition-all ${collapsed ? 'w-12' : 'w-64'} flex h-full flex-col overflow-hidden`}
    >
      <div className="flex items-center justify-between border-b p-2">
        <h2 className={`text-sm font-medium ${collapsed ? 'hidden' : 'block'}`}>报告列表</h2>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="size-7">
          {collapsed ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
        </Button>
      </div>

      {!collapsed ? (
        <div className="thin-scrollbar flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start text-sm"
              onClick={() => {
                // Create a custom event to open a report tab
                const event = new CustomEvent('openReportTab', {
                  detail: { reportName: 'fault tree1 报告' },
                });
                window.dispatchEvent(event);
              }}
            >
              <FileText className="mr-2 size-4" />
              fault tree1 报告
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full justify-start text-sm"
              onClick={() => {
                // Create a custom event to open a report tab
                const event = new CustomEvent('openReportTab', {
                  detail: { reportName: 'fault tree2 报告' },
                });
                window.dispatchEvent(event);
              }}
            >
              <FileText className="mr-2 size-4" />
              fault tree2 报告
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center pt-2">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => {
              // Create a custom event to open a report tab
              const event = new CustomEvent('openReportTab', {
                detail: { reportName: 'fault tree1 报告' },
              });
              window.dispatchEvent(event);
            }}
          >
            <FileText className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
