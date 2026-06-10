import Tree from "rc-tree";
import "rc-tree/assets/index.css";
import { type TreeNode } from "../../types/repository";
import { convertToRcTreeData } from "./tree-utils";

interface Props {
  tree: TreeNode;
}

export default function RepositoryTree({
  tree,
}: Props) {

  const data = [convertToRcTreeData(tree)];

  return (
    <Tree
      treeData={data}
      defaultExpandAll
      showIcon={false}
    />
  );
}