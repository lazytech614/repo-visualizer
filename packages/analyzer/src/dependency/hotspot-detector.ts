import { DependencyGraph } from "./dependency-type.js";

export type HotspotSeverity = "low" | "medium" | "high";

export interface HotspotNode {
  file: string;
  incoming: number;
  outgoing: number;
  score: number;
  severity: HotspotSeverity;
}

function computeMetrics(graph: DependencyGraph) {
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, number>();

  // initialize
  for (const node of graph.nodes) {
    incoming.set(node.id, 0);
    outgoing.set(node.id, 0);
  }

  // build counts
  for (const edge of graph.edges) {
    outgoing.set(edge.source, (outgoing.get(edge.source) || 0) + 1);
    incoming.set(edge.target, (incoming.get(edge.target) || 0) + 1);
  }

  return { incoming, outgoing };
}

function getSeverity(score: number): HotspotSeverity {
  if (score > 15) return "high";
  if (score > 7) return "medium";
  return "low";
}

export function detectHotspots(graph: DependencyGraph): HotspotNode[] {
  const { incoming, outgoing } = computeMetrics(graph);

  const hotspots: HotspotNode[] = [];

  for (const node of graph.nodes) {
    const inCount = incoming.get(node.id) || 0;
    const outCount = outgoing.get(node.id) || 0;

    // 🔥 Hotspot scoring formula
    const score = inCount * 2 + outCount * 1.2;

    hotspots.push({
      file: node.id,
      incoming: inCount,
      outgoing: outCount,
      score,
      severity: getSeverity(score),
    });
  }

  return hotspots.sort((a, b) => b.score - a.score);
}