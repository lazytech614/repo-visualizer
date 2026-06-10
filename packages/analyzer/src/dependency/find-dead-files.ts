import { DependencyGraph } from "../types/dependency";

export function findDeadFiles(
  graph: DependencyGraph,
): string[] {

  const incoming =
    new Set<string>();

  const outgoing =
    new Set<string>();

  graph.edges.forEach((edge) => {

    incoming.add(
      edge.target,
    );

    outgoing.add(
      edge.source,
    );
  });

  return graph.nodes
    .filter((node) => {

      const hasIncoming =
        incoming.has(node.id);

      const hasOutgoing =
        outgoing.has(node.id);

      return (
        !hasIncoming &&
        !hasOutgoing
      );
    })
    .map((node) => node.id);
}