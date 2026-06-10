import { type Node, type Edge, MarkerType } from "reactflow";
import { type DependencyGraph } from "../types/dependency";
import dagre from "dagre";

const NODE_WIDTH = 200;
const NODE_HEIGHT = 40;

export function convertToReactFlow(
  graph: DependencyGraph,
  highlightedNodes: string[]
): { nodes: Node[]; edges: Edge[] } {

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: "TB",
    nodesep: 80,
    ranksep: 100,
    marginx: 60,
    marginy: 60,
  });

  graph.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  graph.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const highlightedSet = new Set(highlightedNodes);

  const nodes: Node[] = graph.nodes.map((node) => {
    const position = dagreGraph.node(node.id);
    const fileName = node.id.split(/[/\\]/).pop() ?? node.id;

    return {
      id: node.id,
      type: "fileNode",  // custom node type
      data: {
        label: fileName,
        fullPath: node.id,
        highlighted: highlightedSet.has(node.id),
      },
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });

  const edges: Edge[] = graph.edges.map((edge, index) => ({
    id: `edge-${index}`,
    source: edge.source,
    target: edge.target,
    animated: false,
    style: { stroke: "#4b5563", strokeWidth: 1.5 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: "#4b5563",
    },
  }));

  return { nodes, edges };
}