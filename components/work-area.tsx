'use client';

import { ChevronDown, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { parseXML } from '@/lib/xml-parser';

import { FaultTreeViewer } from './fault-tree-viewer';
import { ReportViewer } from './report-viewer';
import { BasicEventsTable } from './tables/basic-events-table';
import { GatesTable } from './tables/gates-table';
import { HouseEventsTable } from './tables/house-events-table';

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
</opsa-mef>`;

// 标签页类型定义
interface TabInfo {
  id: string;
  type: string;
  label: string;
  treeName?: string;
}

// 每个标签的固定宽度
const FIXED_TAB_WIDTH = 120; // 单位：像素
// 更多标签按钮的宽度
const MORE_TABS_BUTTON_WIDTH = 100; // 单位：像素
// 关闭所有标签按钮的宽度
const CLOSE_ALL_BUTTON_WIDTH = 40; // 单位：像素
// 其他UI元素（边框、内边距等）占用的空间
const UI_ELEMENTS_WIDTH = 20; // 单位：像素
// 左侧边栏展开和收起的宽度
const LEFT_SIDEBAR_EXPANDED_WIDTH = 256; // 64rem = 256px
const LEFT_SIDEBAR_COLLAPSED_WIDTH = 48; // 12rem = 48px
// 右侧边栏展开和收起的宽度
const RIGHT_SIDEBAR_EXPANDED_WIDTH = 256; // 64rem = 256px
const RIGHT_SIDEBAR_COLLAPSED_WIDTH = 48; // 12rem = 48px

export function WorkArea() {
  // 标签页管理
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [containerWidth, setContainerWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true); // 默认右侧边栏是收起的
  const tabContainerRef = useRef<HTMLDivElement>(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingElement, setEditingElement] = useState<{ type: string; id: string; data: any } | null>(null);

  // Parse the sample XML data to get element data
  const xmlData = useMemo(() => {
    try {
      return parseXML(sampleXmlData);
    } catch (err) {
      console.error('解析XML数据时出错:', err);
      return { gates: [], basicEvents: [], houseEvents: [] };
    }
  }, []);

  // Handle element edit requests
  useEffect(() => {
    const handleEditElement = (event: CustomEvent<{ elementType: string; elementId: string }>) => {
      const { elementType, elementId } = event.detail;

      // Find element data based on type and ID
      let elementData = null;
      if (elementType === 'gates') {
        elementData = xmlData.gates.find((gate) => gate.name === elementId);
      } else if (elementType === 'basicEvents') {
        elementData = xmlData.basicEvents.find((event) => event.name === elementId);
      } else if (elementType === 'houseEvents') {
        elementData = xmlData.houseEvents.find((event) => event.name === elementId);
      }

      if (elementData) {
        setEditingElement({
          type: elementType,
          id: elementId,
          data: elementData,
        });
        setIsEditDialogOpen(true);
      }
    };

    window.addEventListener('editElement', handleEditElement as EventListener);

    return () => {
      window.removeEventListener('editElement', handleEditElement as EventListener);
    };
  }, [xmlData]);

  // Save edited element
  const handleSaveEdit = () => {
    // In a real application, you'd update the actual data or send changes to a server
    console.log('Saving edited element:', editingElement);

    // Close dialog and reset state
    setIsEditDialogOpen(false);
    setEditingElement(null);
  };

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 初始化窗口宽度
    setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 监听左侧边栏状态变化
  useEffect(() => {
    const handleLeftSidebarToggle = (event: CustomEvent<{ collapsed: boolean }>) => {
      setLeftSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('leftSidebarToggle', handleLeftSidebarToggle as EventListener);

    return () => {
      window.removeEventListener('leftSidebarToggle', handleLeftSidebarToggle as EventListener);
    };
  }, []);

  // 监听右侧边栏状态变化
  useEffect(() => {
    const handleRightSidebarToggle = (event: CustomEvent<{ collapsed: boolean }>) => {
      setRightSidebarCollapsed(event.detail.collapsed);
    };

    window.addEventListener('rightSidebarToggle', handleRightSidebarToggle as EventListener);

    return () => {
      window.removeEventListener('rightSidebarToggle', handleRightSidebarToggle as EventListener);
    };
  }, []);

  // 计算工作区实际宽度
  const workAreaWidth = useMemo(() => {
    const leftSidebarWidth = leftSidebarCollapsed ? LEFT_SIDEBAR_COLLAPSED_WIDTH : LEFT_SIDEBAR_EXPANDED_WIDTH;
    const rightSidebarWidth = rightSidebarCollapsed ? RIGHT_SIDEBAR_COLLAPSED_WIDTH : RIGHT_SIDEBAR_EXPANDED_WIDTH;

    // 总宽度减去两侧边栏宽度
    return windowWidth - leftSidebarWidth - rightSidebarWidth;
  }, [windowWidth, leftSidebarCollapsed, rightSidebarCollapsed]);

  // 计算可见和隐藏的标签页
  const { visibleTabs, hiddenTabs } = useMemo(() => {
    // 如果工作区宽度为0，说明还没有测量，返回所有标签
    if (workAreaWidth === 0) {
      return {
        visibleTabs: tabs,
        hiddenTabs: [],
      };
    }

    // 计算可用于显示标签的宽度
    // 总是为关闭所有按钮预留空间
    const availableWidth = workAreaWidth - CLOSE_ALL_BUTTON_WIDTH - UI_ELEMENTS_WIDTH;

    // 计算可以显示的标签数量
    let maxVisibleTabs = Math.floor(availableWidth / FIXED_TAB_WIDTH);

    // 如果有隐藏的标签，需要为"更多标签"按钮预留空间
    if (maxVisibleTabs < tabs.length) {
      maxVisibleTabs = Math.floor((availableWidth - MORE_TABS_BUTTON_WIDTH) / FIXED_TAB_WIDTH);
    }

    // 确保至少显示一个标签
    maxVisibleTabs = Math.max(1, maxVisibleTabs);
    // 确保不超过标签总数
    maxVisibleTabs = Math.min(maxVisibleTabs, tabs.length);

    // 如果所有标签都可以显示
    if (maxVisibleTabs >= tabs.length) {
      return {
        visibleTabs: tabs,
        hiddenTabs: [],
      };
    }

    // 确保活动标签总是可见的
    const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
    let visibleIndexes: number[] = [];

    // 如果活动标签在可见范围内，就显示前maxVisibleTabs个标签
    if (activeTabIndex < maxVisibleTabs) {
      visibleIndexes = Array.from({ length: maxVisibleTabs }, (_, i) => i);
    } else {
      // 活动标签不在可见范围内，需要确保它可见
      // 显示活动标签及其前后的标签
      const startIdx = Math.max(0, activeTabIndex - Math.floor(maxVisibleTabs / 2));
      const endIdx = Math.min(tabs.length - 1, startIdx + maxVisibleTabs - 1);

      visibleIndexes = Array.from({ length: endIdx - startIdx + 1 }, (_, i) => startIdx + i);
    }

    const visible = tabs.filter((_, index) => visibleIndexes.includes(index));
    const hidden = tabs.filter((_, index) => !visibleIndexes.includes(index));

    return { visibleTabs: visible, hiddenTabs: hidden };
  }, [tabs, activeTab, workAreaWidth]);

  // 监听来自侧边栏的事件
  useEffect(() => {
    const handleOpenElementTab = (event: CustomEvent<{ elementType: string }>) => {
      const { elementType } = event.detail;

      // 检查标签页是否已存在
      const existingTabIndex = tabs.findIndex((tab) => tab.type === elementType);

      if (existingTabIndex === -1) {
        // 如果标签页不存在，添加它
        const newTab: TabInfo = {
          id: `tab-${Date.now()}`,
          type: elementType,
          label:
            elementType === 'gates'
              ? '门'
              : elementType === 'basicEvents'
                ? '基本事件'
                : elementType === 'houseEvents'
                  ? '房屋事件'
                  : '故障树可视化',
        };

        setTabs((prev) => [...prev, newTab]);
        setActiveTab(newTab.id);
      } else {
        // 如果标签页已存在，激活它
        setActiveTab(tabs[existingTabIndex].id);
      }
    };

    // 添加事件监听器
    window.addEventListener('openElementTab', handleOpenElementTab as EventListener);

    // 清理函数
    return () => {
      window.removeEventListener('openElementTab', handleOpenElementTab as EventListener);
    };
  }, [tabs]);

  // 监听打开故障树标签页事件
  useEffect(() => {
    const handleOpenFaultTreeTab = (event: CustomEvent<{ treeName: string }>) => {
      const { treeName } = event.detail;

      // 检查该故障树的标签页是否已存在
      const existingTabIndex = tabs.findIndex((tab) => tab.type === 'faultTree' && tab.treeName === treeName);

      if (existingTabIndex === -1) {
        // 如果标签页不存在，添加它
        const newTab: TabInfo = {
          id: `tree-${Date.now()}`,
          type: 'faultTree',
          label: treeName,
          treeName: treeName,
        };

        setTabs((prev) => [...prev, newTab]);
        setActiveTab(newTab.id);
      } else {
        // 如果标签页已存在，激活它
        setActiveTab(tabs[existingTabIndex].id);
      }
    };

    window.addEventListener('openFaultTreeTab', handleOpenFaultTreeTab as EventListener);

    return () => {
      window.removeEventListener('openFaultTreeTab', handleOpenFaultTreeTab as EventListener);
    };
  }, [tabs]);

  // 监听创建新故障树事件
  useEffect(() => {
    const handleCreateFaultTree = (event: CustomEvent<{ treeName: string }>) => {
      const { treeName } = event.detail;

      // 创建新标签页
      const newTab: TabInfo = {
        id: `tree-${Date.now()}`,
        type: 'faultTree',
        label: treeName,
        treeName: treeName,
      };

      setTabs((prev) => [...prev, newTab]);
      setActiveTab(newTab.id);
    };

    window.addEventListener('createFaultTree', handleCreateFaultTree as EventListener);

    return () => {
      window.removeEventListener('createFaultTree', handleCreateFaultTree as EventListener);
    };
  }, []);

  // 监听打开报告标签页事件
  useEffect(() => {
    const handleOpenReportTab = (event: CustomEvent<{ reportName: string }>) => {
      const { reportName } = event.detail;

      // 检查该报告的标签页是否已存在
      const existingTabIndex = tabs.findIndex((tab) => tab.type === 'report' && tab.label === reportName);

      if (existingTabIndex === -1) {
        // 如果标签页不存在，添加它
        const newTab: TabInfo = {
          id: `report-${Date.now()}`,
          type: 'report',
          label: reportName,
        };

        setTabs((prev) => [...prev, newTab]);
        setActiveTab(newTab.id);
      } else {
        // 如果标签页已存在，激活它
        setActiveTab(tabs[existingTabIndex].id);
      }
    };

    window.addEventListener('openReportTab', handleOpenReportTab as EventListener);

    return () => {
      window.removeEventListener('openReportTab', handleOpenReportTab as EventListener);
    };
  }, [tabs]);

  // 关闭标签页
  const closeTab = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);

    // 如果关闭的是当前活动的标签页，切换到第一个标签页
    if (activeTab === tabId && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  // 获取当前标签页的类型和树名称
  const getCurrentTabInfo = () => {
    const currentTab = tabs.find((tab) => tab.id === activeTab);
    if (!currentTab) return { type: '', treeName: '' };

    return {
      type: currentTab.type,
      treeName: currentTab.treeName || '',
    };
  };

  const { type: currentTabType, treeName: currentTreeName } = getCurrentTabInfo();

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <Tabs value={activeTab} className="flex h-full flex-1 flex-col" onValueChange={setActiveTab}>
        {/* 标签页头部 - 固定不滚动 */}
        <div className="flex w-full items-center border-b" ref={tabContainerRef}>
          {/* 使用flex-1让标签列表占据所有可用空间 */}
          <div className="flex flex-1 items-center justify-between">
            {/* 左侧标签列表 */}
            <div className="flex items-center">
              <TabsList className="h-9">
                {visibleTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="relative flex w-[120px] items-center gap-1 pr-8 text-xs"
                  >
                    <span className="truncate">{tab.label}</span>
                    <button
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-0.5 hover:bg-muted"
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
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {hiddenTabs.map((tab) => (
                      <DropdownMenuItem
                        key={tab.id}
                        className="flex items-center justify-between"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span className="truncate">{tab.label}</span>
                        <button
                          className="ml-2 rounded-full p-0.5 hover:bg-muted"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeTab(tab.id, e);
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
                <div className="ml-2 flex items-center border-l px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => {
                      // Close all tabs
                      setTabs([]);
                      setActiveTab('');
                    }}
                    title="关闭所有标签页"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 内容区域 - 可滚动 */}
        <div className="relative flex-1 overflow-hidden">
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="absolute inset-0 h-full overflow-hidden data-[state=inactive]:hidden"
            >
              <div className="thin-scrollbar h-full overflow-auto">
                {tab.type === 'gates' && <GatesTable />}
                {tab.type === 'basicEvents' && <BasicEventsTable />}
                {tab.type === 'houseEvents' && <HouseEventsTable />}
                {tab.type === 'faultTree' && <FaultTreeViewer xmlData={sampleXmlData} initialTreeName={tab.treeName} />}
                {tab.type === 'report' && <ReportViewer reportName={tab.label} />}
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>

      {/* 底部状态栏 - 固定不滚动 */}
      <div className="flex h-6 items-center border-t bg-muted/30 px-2 text-xs text-muted-foreground">
        <span>
          当前视图:{' '}
          {currentTabType === 'gates'
            ? '门'
            : currentTabType === 'basicEvents'
              ? '基本事件'
              : currentTabType === 'houseEvents'
                ? '房屋事件'
                : currentTabType === 'faultTree'
                  ? `故障树 - ${currentTreeName}`
                  : currentTabType === 'report'
                    ? `报告 - ${tabs.find((tab) => tab.id === activeTab)?.label || ''}`
                    : ''}
        </span>
        <span className="ml-auto">就绪</span>
      </div>

      {/* Element Edit Dialog */}
      {isEditDialogOpen && editingElement && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingElement.type === 'gates'
                  ? '编辑门'
                  : editingElement.type === 'basicEvents'
                    ? '编辑基本事件'
                    : '编辑房屋事件'}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Common fields */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="element-id" className="text-right">
                  ID
                </Label>
                <Input id="element-id" value={editingElement.id} className="col-span-3" disabled />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="element-label" className="text-right">
                  标签
                </Label>
                <Input
                  id="element-label"
                  value={editingElement.data.label || ''}
                  className="col-span-3"
                  onChange={(e) =>
                    setEditingElement({
                      ...editingElement,
                      data: { ...editingElement.data, label: e.target.value },
                    })
                  }
                />
              </div>

              {/* Gate specific fields */}
              {editingElement.type === 'gates' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="element-type" className="text-right">
                    类型
                  </Label>
                  <Select
                    value={editingElement.data.type || ''}
                    onValueChange={(value) =>
                      setEditingElement({
                        ...editingElement,
                        data: { ...editingElement.data, type: value },
                      })
                    }
                  >
                    <SelectTrigger id="element-type" className="col-span-3">
                      <SelectValue placeholder="选择门类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="and">AND</SelectItem>
                      <SelectItem value="or">OR</SelectItem>
                      <SelectItem value="xor">XOR</SelectItem>
                      <SelectItem value="not">NOT</SelectItem>
                      <SelectItem value="nand">NAND</SelectItem>
                      <SelectItem value="nor">NOR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Basic event specific fields */}
              {editingElement.type === 'basicEvents' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="element-probability" className="text-right">
                    概率
                  </Label>
                  <Input
                    id="element-probability"
                    type="number"
                    min="0"
                    max="1"
                    step="0.001"
                    value={editingElement.data.probability || 0}
                    className="col-span-3"
                    onChange={(e) =>
                      setEditingElement({
                        ...editingElement,
                        data: { ...editingElement.data, probability: Number(e.target.value) },
                      })
                    }
                  />
                </div>
              )}

              {/* House event specific fields */}
              {editingElement.type === 'houseEvents' && (
                <div className="flex items-center justify-end space-x-2 pr-2 pt-2">
                  <Switch
                    id="element-state"
                    checked={editingElement.data.state || false}
                    onCheckedChange={(checked) =>
                      setEditingElement({
                        ...editingElement,
                        data: { ...editingElement.data, state: checked },
                      })
                    }
                  />
                  <Label htmlFor="element-state">状态: {editingElement.data.state ? 'TRUE' : 'FALSE'}</Label>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSaveEdit}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
