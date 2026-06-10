import fs from "fs";
import path from "path";
import { TreeNode } from "../types/tree-node.js";
import { IGNORE_DIRS } from "./constants.js";

export function scanRepository(
  repositoryPath: string
): TreeNode {

  const stats = fs.statSync(repositoryPath);

  const node: TreeNode = {
    name: path.basename(repositoryPath),
    path: repositoryPath,
    type: stats.isDirectory()
      ? "directory"
      : "file",
    size: stats.size,
    extension: path.extname(repositoryPath),
  };

  if (stats.isDirectory() &&
    !IGNORE_DIRS.includes(
        path.basename(repositoryPath)
    )) {
    const children = fs
      .readdirSync(repositoryPath)
      .map((child: any) =>
        scanRepository(
          path.join(repositoryPath, child)
        )
      );

    node.children = children;
  }

  return node;
}