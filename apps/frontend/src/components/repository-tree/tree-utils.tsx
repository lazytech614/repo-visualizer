import { type TreeNode } from "../../types/repository";
import {
  Folder,
  File
} from "lucide-react";

export function convertToRcTreeData(
  node: TreeNode
): any {

  return {
    key: node.path,

    title: (
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {node.type === "directory"
          ? <Folder size={16}/>
          : <File size={16}/>
        }

        {node.name}
      </div>
    ),

    children:
      node.children?.map(
        convertToRcTreeData
      ) ?? [],
  };
}