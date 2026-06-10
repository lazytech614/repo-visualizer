import { scanRepository } from "./scanner.js";
import { generateTreeStats } from "./tree-stats.js";

export class TreeService {
  generateTree(path: string) {
    const tree = scanRepository(path);
    const stats = generateTreeStats(tree);

    return { tree, stats };
  }
}