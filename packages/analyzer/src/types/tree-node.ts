export interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  extension?: string;
  children?: TreeNode[];
}

export interface TreeResponse {
  tree: TreeNode;
}
