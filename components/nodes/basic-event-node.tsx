"use client"

import { Handle, Position } from "reactflow"

interface BasicEventNodeProps {
  data: {
    label: string
    probability: number
    onClick?: () => void
  }
  id: string
}

export function BasicEventNode({ data, id }: BasicEventNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <Handle type="target" position={Position.Top} />
      <div
        className="w-[100px] h-[100px] rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center shadow-md cursor-pointer"
        onClick={() => data.onClick && data.onClick()}
      >
        <div className="text-center">
          <div className="text-sm font-medium">{data.label}</div>
          <div className="text-xs text-gray-500">P = {data.probability}</div>
        </div>
      </div>
    </div>
  )
}
