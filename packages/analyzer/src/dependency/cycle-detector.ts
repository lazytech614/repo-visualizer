import {
  DependencyGraph
} from "./dependency-type.js";

export type Cycle = string[];

function buildAdjacencyList(
  graph: DependencyGraph
) {
    const adjacency = new Map<string, string[]>();
    for (const edge of graph.edges) {
        if (!adjacency.has(edge.source)) {
            adjacency.set(edge.source, []);
        }

        adjacency.get(edge.source)!.push(edge.target);

    }

    return adjacency;
}

export function detectCycles(
  graph: DependencyGraph
): Cycle[] {
    const adjacency = buildAdjacencyList(graph);
    const cycles: Cycle[] = [];

    // DFS Data Structures
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    function dfs(
        node: string,
        path: string[]
    ) {
        visited.add(node);
        recursionStack.add(node);
        path.push(node);

        const neighbours = adjacency.get(node) || [];
        for (const neighbour of neighbours) {
            if (!visited.has(neighbour)) {
                dfs(neighbour,[...path]);
            }else if (recursionStack.has(neighbour)) {
                const cycleStart = path.indexOf(neighbour);
                const cycle = path.slice(cycleStart);
                cycle.push(neighbour);
                cycles.push(cycle);
            }
        }

        recursionStack.delete(node);
    }

    for (const node of graph.nodes) {
        if (!visited.has(node.id)) {
            dfs(node.id, []);
        }
    }

    return cycles;
}