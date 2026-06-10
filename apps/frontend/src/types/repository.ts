export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";

  size?: number;

  extension?: string;

  children?: TreeNode[];
}

export interface TreeStats {
  totalFiles: number;
  totalDirectories: number;
  totalSize: number;
  typescriptFiles: number;
  javascriptFiles: number;
}

export interface TreeResponse {
  tree: {
    tree: TreeNode;
    stats: TreeStats;
  };
}