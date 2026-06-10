import { detectCycles } from "./cycle-detector.js";
import { analyzeDependencies } from "./dependency-analyzer.js";
import { calculateDependencyStats } from "./dependency-stats.js";

export class DependencyService {

  analyze(path: string) {

    const graph = analyzeDependencies(path);
    const stats = calculateDependencyStats(graph);
    const cycles = detectCycles(graph);
    const cyclesCount = cycles.length;

    return {
      graph,
      stats,
      cycles,
      cyclesCount
    };
  }

}