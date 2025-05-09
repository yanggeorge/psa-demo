'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportViewerProps {
  reportName: string;
}

export function ReportViewer({ reportName }: ReportViewerProps) {
  return (
    <div className="thin-scrollbar size-full overflow-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{reportName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">分析结果摘要</h3>
              <p className="text-muted-foreground">
                此报告包含对故障树的分析结果，包括最小割集、重要度分析和概率计算。
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium">最小割集</h3>
              <div className="mt-2 rounded-md border p-2">
                <ul className="list-inside list-disc space-y-1">
                  <li>E1, E2</li>
                  <li>E3, E4, E5</li>
                  <li>E6</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">概率分析</h3>
              <div className="mt-2">
                <p>系统失效概率: 2.34E-3</p>
                <p>平均修复时间: 24.5小时</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">重要度分析</h3>
              <table className="mt-2 w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">事件</th>
                    <th className="p-2 text-left">Birnbaum重要度</th>
                    <th className="p-2 text-left">Fussell-Vesely重要度</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">E1</td>
                    <td className="p-2">0.0123</td>
                    <td className="p-2">0.456</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">E2</td>
                    <td className="p-2">0.0098</td>
                    <td className="p-2">0.321</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">E6</td>
                    <td className="p-2">0.0234</td>
                    <td className="p-2">0.789</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
