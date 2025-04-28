"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  Position,
  type Node,
  ReactFlowProvider,
} from "reactflow"
import "reactflow/dist/style.css"
import { Badge } from "@/components/ui/badge"
import { parseXML } from "@/lib/xml-parser"
import { NodeEditor } from "./node-editor"

// 自定义节点类型
import { GateNode } from "./nodes/gate-node"
import { BasicEventNode } from "./nodes/basic-event-node"
import { HouseEventNode } from "./nodes/house-event-node"

// 注册自定义节点
const nodeTypes = {
  gate: GateNode,
  basicEvent: BasicEventNode,
  houseEvent: HouseEventNode,
}

interface FaultTreeViewerProps {
  xmlData: string
  initialTreeName?: string
}

// 内部流程图组件，使用ReactFlow钩子
function FlowChart({
  tree,
  parsedData,
  onNodeClick,
}: {
  tree: any
  parsedData: any
  onNodeClick: (node: Node) => void
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 })
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // 监听视口尺寸变化
  useEffect(() => {
    const updateViewportDimensions = () => {
      if (reactFlowWrapper.current) {
        const { width, height } = reactFlowWrapper.current.getBoundingClientRect()
        setViewportDimensions({ width, height })
      }
    }

    updateViewportDimensions()
    window.addEventListener("resize", updateViewportDimensions)

    return () => {
      window.removeEventListener("resize", updateViewportDimensions)
    }
  }, [])

  // 构建节点和边
  const buildNodesAndEdges = useCallback(() => {
    if (!parsedData || !tree) return

    const newNodes: any[] = []
    const newEdges: any[] = []
    const processedNodes = new Set()

    // 递归构建节点和边
    const processNode = (nodeName: string, x: number, y: number, parentId?: string): string => {
      // 检查节点是否已处理，避免重复
      if (processedNodes.has(nodeName)) {
        if (parentId) {
          newEdges.push({
            id: `e-${parentId}-${nodeName}`,
            source: parentId,
            target: nodeName,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          })
        }
        return nodeName
      }

      // 查找门
      const gate = parsedData.gates.find((g: any) => g.name === nodeName)
      if (gate) {
        // 添加门节点
        newNodes.push({
          id: nodeName,
          type: "gate",
          position: { x, y },
          data: {
            label: gate.label || gate.name,
            type: gate.type,
            onClick: () => {}, // 这里会在渲染后被覆盖
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        })
        processedNodes.add(nodeName)

        // 如果有父节点，添加边
        if (parentId) {
          newEdges.push({
            id: `e-${parentId}-${nodeName}`,
            source: parentId,
            target: nodeName,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          })
        }

        // 处理子节点
        const childSpacing = 180
        const startX = x - ((gate.children.length - 1) * childSpacing) / 2

        gate.children.forEach((child: string, index: number) => {
          const childX = startX + index * childSpacing
          const childY = y + 150
          processNode(child, childX, childY, nodeName)
        })

        return nodeName
      }

      // 查找基本事件
      const basicEvent = parsedData.basicEvents.find((e: any) => e.name === nodeName)
      if (basicEvent) {
        newNodes.push({
          id: nodeName,
          type: "basicEvent",
          position: { x, y },
          data: {
            label: basicEvent.label || basicEvent.name,
            probability: basicEvent.probability,
            onClick: () => {}, // 这里会在渲染后被覆盖
          },
          targetPosition: Position.Top,
        })
        processedNodes.add(nodeName)

        if (parentId) {
          newEdges.push({
            id: `e-${parentId}-${nodeName}`,
            source: parentId,
            target: nodeName,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          })
        }

        return nodeName
      }

      // 查找房屋事件
      const houseEvent = parsedData.houseEvents.find((e: any) => e.name === nodeName)
      if (houseEvent) {
        newNodes.push({
          id: nodeName,
          type: "houseEvent",
          position: { x, y },
          data: {
            label: houseEvent.label || houseEvent.name,
            state: houseEvent.state,
            onClick: () => {}, // 这里会在渲染后被覆盖
          },
          targetPosition: Position.Top,
        })
        processedNodes.add(nodeName)

        if (parentId) {
          newEdges.push({
            id: `e-${parentId}-${nodeName}`,
            source: parentId,
            target: nodeName,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          })
        }

        return nodeName
      }

      // 如果找不到节点，可能是引用了另一棵树中的门
      const referencedGate = parsedData.gates.find((g: any) => g.name === nodeName)
      if (referencedGate) {
        newNodes.push({
          id: nodeName,
          type: "gate",
          position: { x, y },
          data: {
            label: referencedGate.label || referencedGate.name,
            type: referencedGate.type,
            isReference: true,
            onClick: () => {}, // 这里会在渲染后被覆盖
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        })
        processedNodes.add(nodeName)

        if (parentId) {
          newEdges.push({
            id: `e-${parentId}-${nodeName}`,
            source: parentId,
            target: nodeName,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          })
        }

        return nodeName
      }

      // 未知节点
      newNodes.push({
        id: nodeName,
        position: { x, y },
        data: {
          label: nodeName,
          onClick: () => {}, // 这里会在渲染后被覆盖
        },
        targetPosition: Position.Top,
      })
      processedNodes.add(nodeName)

      if (parentId) {
        newEdges.push({
          id: `e-${parentId}-${nodeName}`,
          source: parentId,
          target: nodeName,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
        })
      }

      return nodeName
    }

    // 从顶层门开始构建
    const topGates = tree.gates.filter((g: any) => {
      // 顶层门是那些没有被其他门引用的门
      const isReferenced = tree.gates.some((otherGate: any) => otherGate.children.includes(g.name))
      return !isReferenced
    })

    // 如果是空树或没有顶层门，创建一个空白画布
    if (topGates.length === 0) {
      setNodes([])
      setEdges([])
      return
    }

    topGates.forEach((gate: any, index: number) => {
      processNode(gate.name, 400, 100 + index * 300)
    })

    // 添加点击事件处理
    const nodesWithClickHandlers = newNodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onClick: () => onNodeClick(node),
      },
    }))

    setNodes(nodesWithClickHandlers)
    setEdges(newEdges)
  }, [parsedData, tree, setNodes, setEdges, onNodeClick])

  // 构建节点和边
  useEffect(() => {
    buildNodesAndEdges()
  }, [buildNodesAndEdges])

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <Panel position="top-left" className="bg-background/80 p-2 rounded-md shadow-md">
          <h3 className="text-sm font-medium">故障树: {tree.name}</h3>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="bg-yellow-100">
              门: {tree.gates.length}
            </Badge>
            <Badge variant="outline" className="bg-blue-100">
              基本事件: {parsedData.basicEvents.length}
            </Badge>
            <Badge variant="outline" className="bg-green-100">
              房屋事件: {parsedData.houseEvents.length}
            </Badge>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export function FaultTreeViewer({ xmlData, initialTreeName }: FaultTreeViewerProps) {
  const [parsedData, setParsedData] = useState<any>(null)
  const [activeTree, setActiveTree] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [viewportDimensions, setViewportDimensions] = useState({ width: 0, height: 0 })

  // 解析XML数据
  useEffect(() => {
    try {
      const data = parseXML(xmlData)
      setParsedData(data)

      // 设置默认活动树
      if (initialTreeName) {
        setActiveTree(initialTreeName)
      } else if (data.faultTrees && data.faultTrees.length > 0) {
        setActiveTree(data.faultTrees[0].name)
      }
    } catch (err) {
      setError("解析XML数据时出错")
      console.error(err)
    }
  }, [xmlData, initialTreeName])

  // 处理节点点击
  const handleNodeClick = (node: Node) => {
    setSelectedNode(node)
  }

  // 更新节点数据
  const handleNodeUpdate = (updatedNode: Node) => {
    // 节点更新逻辑将在FlowChart组件内部处理
    setSelectedNode(null)
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!parsedData) {
    return <div className="p-4">加载中...</div>
  }

  // 获取当前活动的树
  const currentTree = parsedData.faultTrees.find((t: any) => t.name === activeTree)
  if (!currentTree) {
    return <div className="p-4">找不到故障树: {activeTree}</div>
  }

  return (
    <div className="w-full h-full">
      <ReactFlowProvider>
        <FlowChart tree={currentTree} parsedData={parsedData} onNodeClick={handleNodeClick} />
        {selectedNode && (
          <NodeEditor
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={handleNodeUpdate}
            viewportDimensions={viewportDimensions}
          />
        )}
      </ReactFlowProvider>
    </div>
  )
}
