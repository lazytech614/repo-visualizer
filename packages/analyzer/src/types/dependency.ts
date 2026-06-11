import { Cycle } from "../dependency/cycle-detector";
import { DependencyStats } from "../dependency/dependency-stats-types";
import { HotspotNode } from "../dependency/hotspot-detector";

export interface DependencyNode {
  id: string;
  path: string;
}

export interface DependencyEdge {
  source: string;
  target: string;
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface DependencyResponse {
  graph: DependencyGraph;
  stats: DependencyStats;
  cycles: Cycle[];
  cyclesCount: number;
  hotspots: HotspotNode[];
}