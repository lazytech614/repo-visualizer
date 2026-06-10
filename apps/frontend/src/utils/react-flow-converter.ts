import { type Node, type Edge } from "reactflow";
import { type DependencyGraph } from "../types/dependency";
import dagre from "dagre";

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(
  () => ({})
);

const NODE_WIDTH = 250;
const NODE_HEIGHT = 60;

export function convertToReactFlow(
  graph: DependencyGraph,
  highlightedNodes: string[]
): {
  nodes: Node[];
  edges: Edge[];
} {

  dagreGraph.setGraph({
    rankdir: "TB",
  });

  graph.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  graph.edges.forEach((edge) => {
    dagreGraph.setEdge(
      edge.source,
      edge.target
    );
  });

  dagre.layout(dagreGraph);

  const highlightedSet =
  new Set(highlightedNodes);

  const nodes: Node[] =
    graph.nodes.map((node) => {

      const position =
        dagreGraph.node(node.id);

      return {
        id: node.id,

        data: {
          label:
            node.id.split("/").pop(),
        },

        position: {
          x: position.x,
          y: position.y,
        },

        style: {
          border:
            highlightedSet.has(
              node.id
            )
              ? "3px solid red"
              : "1px solid #ddd",
        },
      };
    });

  const edges: Edge[] =
    graph.edges.map(
      (edge, index) => ({
        id: `edge-${index}`,

        source: edge.source,

        target: edge.target,

        animated: true,
      })
    );

  return {
    nodes,
    edges,
  };
}