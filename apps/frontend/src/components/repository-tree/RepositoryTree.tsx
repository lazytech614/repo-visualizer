import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { type TreeNode } from "../../types/repository";
import { cn } from "../../lib/utils";
import { getFileIcon, getFolderIcon } from "./utils";

interface Props {
  tree: TreeNode;
}

interface TreeItemProps {
  node: TreeNode;
  depth: number;
}

function TreeItem({ node, depth }: TreeItemProps) {
  const [isOpen, setIsOpen] = useState(depth < 2); // auto-expand first 2 levels
  const isLeaf = !node.children || node.children.length === 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-0.75 cursor-pointer rounded-sm mx-1",
          "hover:bg-accent/60 text-sm text-muted-foreground hover:text-foreground",
          "transition-colors duration-100 select-none"
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
        onClick={() => !isLeaf && setIsOpen((o) => !o)}
      >
        {/* Chevron for folders */}
        <span className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
          {!isLeaf ? (
            isOpen
              ? <ChevronDown className="w-3 h-3 text-muted-foreground" />
              : <ChevronRight className="w-3 h-3 text-muted-foreground" />
          ) : null}
        </span>

        {/* Icon */}
        {isLeaf
          ? getFileIcon(node.name, true)
          : getFolderIcon(isOpen)
        }

        {/* Name */}
        <span className="truncate text-xs leading-5">{node.name}</span>
      </div>

      {/* Children */}
      {!isLeaf && isOpen && (
        <div>
          {node.children!.map((child, i) => (
            <TreeItem key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function RepositoryTree({ tree }: Props) {
  return (
    <div className="py-1">
      <TreeItem node={tree} depth={0} />
    </div>
  );
}