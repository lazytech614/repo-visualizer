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