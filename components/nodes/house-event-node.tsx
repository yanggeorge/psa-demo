'use client';

import { Handle, Position } from 'reactflow';

interface HouseEventNodeProps {
  data: {
    label: string;
    state: boolean;
    onClick?: () => void;
  };
  id: string;
}

export function HouseEventNode({ data, id }: HouseEventNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <Handle type="target" position={Position.Top} />
      <div
        className="flex h-[80px] w-[100px] cursor-pointer items-center justify-center border-2 border-green-500 bg-green-50 shadow-md"
        style={{ clipPath: 'polygon(0% 20%, 50% 0%, 100% 20%, 100% 100%, 0% 100%)' }}
        onClick={() => data.onClick && data.onClick()}
      >
        <div className="text-center">
          <div className="text-sm font-medium">{data.label}</div>
          <div className="text-xs text-gray-500">{data.state ? 'TRUE' : 'FALSE'}</div>
        </div>
      </div>
    </div>
  );
}
