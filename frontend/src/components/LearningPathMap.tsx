import { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  BackgroundVariant
} from '@xyflow/react';
import type { NodeChange, EdgeChange, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sparkles, BookOpen, Lock } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: 'n1',
    type: 'customNode',
    position: { x: 250, y: 50 },
    data: { label: '电路基本定律 (KCL/KVL)', status: 'mastered', score: 95 },
  },
  {
    id: 'n2',
    type: 'customNode',
    position: { x: 100, y: 200 },
    data: { label: '磁路基础与电磁感应', status: 'learning', score: 68 },
  },
  {
    id: 'n3',
    type: 'customNode',
    position: { x: 400, y: 200 },
    data: { label: '单相交流电', status: 'locked' },
  },
  {
    id: 'n4',
    type: 'customNode',
    position: { x: 250, y: 350 },
    data: { label: '变压器原理与等效电路', status: 'locked' },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'n1', target: 'n2', animated: true, style: { stroke: 'rgba(170, 59, 255, 0.6)', strokeWidth: 2 } },
  { id: 'e1-3', source: 'n1', target: 'n3', style: { stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 } },
  { id: 'e2-4', source: 'n2', target: 'n4', style: { stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 } },
  { id: 'e3-4', source: 'n3', target: 'n4', style: { stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 } },
];

function CustomNode({ data }: { data: any }) {
  const isMastered = data.status === 'mastered';
  const isLearning = data.status === 'learning';
  const isLocked = data.status === 'locked';

  let borderColor = 'border-white/10';
  let glow = '';
  
  if (isMastered) {
    borderColor = 'border-primary/50';
    glow = 'neon-text-glow';
  } else if (isLearning) {
    borderColor = 'border-accent/60';
    glow = 'shadow-[0_0_15px_rgba(59,130,246,0.5)]';
  }

  return (
    <div className={`px-4 py-3 rounded-lg bg-card backdrop-blur-md border ${borderColor} ${glow} flex items-center gap-3 w-[220px] transition-all duration-300 hover:scale-105`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-white/20 !border-0" />
      
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${isMastered ? 'bg-primary/20 text-primary' : isLearning ? 'bg-accent/20 text-accent' : 'bg-white/5 text-white/30'}`}>
        {isMastered ? <Sparkles size={16} /> : isLearning ? <BookOpen size={16} /> : <Lock size={16} />}
      </div>
      
      <div className="flex flex-col flex-1">
        <span className={`text-sm font-medium ${isLocked ? 'text-white/30' : 'text-white'}`}>{data.label}</span>
        {data.score !== undefined && (
          <span className="text-[10px] text-white/50 mt-1 uppercase tracking-wider">
            {isMastered ? '已掌握' : '正在学习'} · {data.score}%
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-white/20 !border-0" />
    </div>
  );
}

export function LearningPathMap() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  return (
    <div className="w-full h-full bg-background relative overflow-hidden">
      <div className="absolute top-6 left-6 z-10 glass-panel px-4 py-2 rounded-full">
        <h1 className="text-white text-sm font-medium tracking-wide">《电机学》学习拓扑</h1>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        className="[&_.react-flow__pane]:cursor-grab"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.08)" />
        <Controls className="glass-panel !border-0 !shadow-none [&>button]:!bg-transparent [&>button]:!border-white/10 [&>button]:!text-white" />
      </ReactFlow>
    </div>
  );
}
