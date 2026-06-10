import { useState, useRef, useCallback, useMemo } from "react";
import ReactFlow, {
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  type Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { GitFork, FolderTree, ChevronRight, PanelLeftClose, PanelLeftOpen } from "lucide-react";

import NodeDetails from "../sidebar/NodeDetails";
import RepositoryTree from "../repository-tree/RepositoryTree";
import FileNode from "./FileNode";
import { convertToReactFlow } from "../../utils/react-flow-converter";
import { type TreeNode } from "../../types/repository";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";

const nodeTypes = { fileNode: FileNode };

interface Props {
  graph: any;
  highlightedNodes: string[];
  tree?: TreeNode | null;
}

const MIN_WIDTH = 160;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 256;

export default function DependencyGraph({ graph, highlightedNodes, tree }: Props) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeTab, setActiveTab] = useState("tree");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const { nodes, edges } = useMemo(
    () => convertToReactFlow(graph, highlightedNodes),
    [graph, highlightedNodes]
  );

  function handleNodeClick(_: any, node: Node) {
    setSelectedNode(node);
    setActiveTab("details");
  }

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = sidebarWidth;

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - startX.current;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth.current + delta));
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [sidebarWidth]);

  return (
    <div className="flex w-full h-[90vh] overflow-hidden">

      {/* Sidebar */}
      <div
        className="h-full flex flex-col border-r border-border bg-card shrink-0 relative transition-[width] duration-200"
        style={{ width: isCollapsed ? "40px" : `${sidebarWidth}px` }}
      >
        {isCollapsed ? (
          <div className="flex flex-col items-center pt-2 gap-2">
            <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setIsCollapsed(false)}>
              <PanelLeftOpen className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full min-h-0">
              <div className="flex items-center border-b border-border shrink-0">
                <TabsList className="flex-1 rounded-none bg-transparent h-auto m-2 mt-0">
                  <TabsTrigger
                    value="tree"
                    className="flex-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs gap-1.5 p-2.5 rounded-sm"
                  >
                    <FolderTree className="w-3.5 h-3.5" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="flex-1 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-xs gap-1.5 p-2.5 rounded-sm"
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    Details
                    {selectedNode && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </TabsTrigger>
                </TabsList>
                <Button
                  variant="ghost" size="icon"
                  className="w-7 h-7 mr-1 shrink-0"
                  onClick={() => setIsCollapsed(true)}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </Button>
              </div>

              <TabsContent value="tree" className="flex-1 mt-0 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {tree ? <RepositoryTree tree={tree} /> : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4">
                    <FolderTree className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground">No file tree available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="details" className="flex-1 mt-0 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                {selectedNode ? (
                  <NodeDetails node={selectedNode} graph={graph} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-4 pt-16">
                    <ChevronRight className="w-8 h-8 text-muted-foreground/40" />
                    <p className="text-xs text-muted-foreground">Click a node in the graph to see its details</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div
              onMouseDown={onMouseDown}
              className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/40 active:bg-primary/60 transition-colors z-10"
            />
          </>
        )}
      </div>

      {/* Graph */}
      <div className="flex-1 h-full min-h-0">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          onNodeClick={handleNodeClick}
          minZoom={0.1}
          maxZoom={2}
        >
          <Controls className="[&>button]:bg-zinc-800 [&>button]:border-zinc-700 [&>button]:text-zinc-300 [&>button:hover]:bg-zinc-700" />
          <MiniMap
            style={{ background: "#1a1a2e", border: "1px solid #3f3f5a" }}
            nodeColor={(node) => node.data?.highlighted ? "#ef4444" : "#4b5563"}
            maskColor="rgba(0,0,0,0.4)"
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#2a2a3e"
          />
        </ReactFlow>
      </div>

    </div>
  );
}