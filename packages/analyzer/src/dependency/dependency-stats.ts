import {
  DependencyGraph,
} from "./dependency-type.js";

import {
  DependencyStats,
  FileCount,
} from "./dependency-stats-types.js";

export function calculateDependencyStats(
  graph: DependencyGraph
): DependencyStats {
    const totalFiles = graph.nodes.length;
    const totalDependencies = graph.edges.length;
    const averageDependenciesPerFile = 
                                    totalFiles === 0
                                        ? 0
                                        : totalDependencies / totalFiles;

    // Finding most imported files
    const incomingCount = new Map<string, number>();
    for (const edge of graph.edges) {
        incomingCount.set(
            edge.target,
            (incomingCount.get(edge.target) ?? 0) + 1
        );
    }

    // Convert map to array
    const mostImportedFiles =
        Array.from(incomingCount.entries())
            .map(([file, count]) => ({
            file,
            count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

    // Finding most dependent files
    const outgoingCount = new Map<string, number>();
    for (const edge of graph.edges) {
        outgoingCount.set(
            edge.source,
            (outgoingCount.get(edge.source) ?? 0) + 1
        );
    }

    // Convert map to array
    const mostDependentFiles =
        Array.from(outgoingCount.entries())
            .map(([file, count]) => ({
            file,
            count,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

    // Finding isolated files
    const connectedFiles = new Set<string>();
    for (const edge of graph.edges) {
        connectedFiles.add(edge.source);
        connectedFiles.add(edge.target);
    }

    const isolatedFiles =
        graph.nodes
            .filter(
            node =>
                !connectedFiles.has(node.id)
            )
            .map(node => node.id);

    return {
        totalFiles,
        totalDependencies,
        averageDependenciesPerFile,
        mostImportedFiles,
        mostDependentFiles,
        isolatedFiles,
    };
}