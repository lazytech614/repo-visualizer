import { useState } from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  type Node,
} from "reactflow";

import "reactflow/dist/style.css";

import NodeDetails from "../sidebar/NodeDetails";
import { convertToReactFlow } from "../../utils/react-flow-converter";

export default function DependencyGraph({ graph }: any) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const { nodes, edges } = convertToReactFlow(graph);

  return (
    <div className="flex w-full h-200">

      {/* Sidebar LEFT */}
      <div className="w-64 h-full border-r border-zinc-700 bg-zinc-900 overflow-y-auto shrink-0">
        <NodeDetails node={selectedNode} graph={graph} />
      </div>

      {/* Graph */}
      <div className="flex-1 h-full min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onNodeClick={(_, node) => setSelectedNode(node)}
        >
          <Controls />
          <MiniMap />
          <Background />
        </ReactFlow>
      </div>

    </div>
  );
}