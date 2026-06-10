import { TreeNode } from "../types/tree-node.js";
import { TreeStats } from "./tree-stats-types.js";

export function generateTreeStats(
  tree: TreeNode
): TreeStats {

  const stats: TreeStats = {
    totalFiles: 0,
    totalDirectories: 0,

    totalSize: 0,

    typescriptFiles: 0,
    javascriptFiles: 0,

    jsxFiles: 0,
    tsxFiles: 0,

    largestFile: undefined,
  };

  function traverse(node: TreeNode) {

    if (node.type === "directory") {

      stats.totalDirectories++;

      node.children?.forEach(child =>
        traverse(child)
      );

      return;
    }

    stats.totalFiles++;

    const fileSize = node.size ?? 0;

    stats.totalSize += fileSize;

    if (
      !stats.largestFile ||
      fileSize > stats.largestFile.size
    ) {
      stats.largestFile = {
        path: node.path,
        size: fileSize,
      };
    }

    switch (node.extension) {
      case ".ts":
        stats.typescriptFiles++;
        break;

      case ".tsx":
        stats.tsxFiles++;
        break;

      case ".js":
        stats.javascriptFiles++;
        break;

      case ".jsx":
        stats.jsxFiles++;
        break;
    }
  }

  traverse(tree);

  return stats;
}