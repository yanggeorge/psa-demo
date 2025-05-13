'use client';

import { Menu } from '@/components/menu';
import { ModelElementsSidebar } from '@/components/model-elements-sidebar';
import { ReportsSidebar } from '@/components/reports-sidebar';
import { Toolbar } from '@/components/toolbar';
import { WorkArea } from '@/components/work-area';

export default function Home() {
  console.log('🚀 ~ Home begin');
  console.log('🚀 ~ Home end');
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden">
      <Menu />
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <ModelElementsSidebar />
        <WorkArea />
        <ReportsSidebar />
      </div>
    </main>
  );
}
