'use client';

import { Handle, Position } from 'reactflow';

interface GateNodeProps {
  data: {
    label: string;
    type: string;
    isReference?: boolean;
    onClick?: () => void;
  };
  id: string;
}

export function GateNode({ data, id }: GateNodeProps) {
  // 根据门类型选择不同的符号
  const getGateSymbol = (type: string) => {
    switch (type.toLowerCase()) {
      case 'and':
        return '∧';
      case 'or':
        return '∨';
      case 'xor':
        return '⊕';
      case 'not':
        return '¬';
      case 'nand':
        return '⊼';
      case 'nor':
        return '⊽';
      case 'iff':
        return '⟺';
      case 'imply':
        return '→';
      case 'atleast':
        return '≥k';
      case 'cardinality':
        return 'k..l';
      default:
        return '?';
    }
  };

  // 获取门类型的背景颜色
  const getGateColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'and':
        return 'bg-yellow-50';
      case 'or':
        return 'bg-orange-50';
      case 'xor':
        return 'bg-red-50';
      case 'not':
        return 'bg-purple-50';
      case 'nand':
      case 'nor':
        return 'bg-indigo-50';
      case 'iff':
      case 'imply':
        return 'bg-blue-50';
      case 'atleast':
      case 'cardinality':
        return 'bg-green-50';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div
      className={`rounded-md border-2 px-4 py-2 shadow-md ${
        data.isReference ? 'border-dashed border-orange-500' : 'border-yellow-500'
      } ${getGateColor(data.type)} min-w-[120px] cursor-pointer text-center`}
      onClick={() => data.onClick && data.onClick()}
    >
      <Handle type="target" position={Position.Top} />
      <div className="text-2xl font-bold">{getGateSymbol(data.type)}</div>
      <div className="text-sm font-medium">{data.label}</div>
      <div className="text-xs text-gray-500">{data.type}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
