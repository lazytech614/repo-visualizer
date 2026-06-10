import { memo } from "react";
import { Handle, Position } from "reactflow";
import { getFileIcon } from "../repository-tree/utils";

function FileNode({ data }: { data: any }) {
  return (
    <div
      style={{
        background: data.highlighted ? "rgba(239,68,68,0.2)" : "#1e1e2e",
        border: data.highlighted ? "1.5px solid #ef4444" : "1px solid #3f3f5a",
        borderRadius: "8px",
        padding: "6px 10px",
        minWidth: "160px",
        maxWidth: "200px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: data.highlighted
          ? "0 0 0 3px rgba(239,68,68,0.25)"
          : "0 2px 8px rgba(0,0,0,0.4)",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: "#6b7280", width: 6, height: 6 }} />

      <span style={{ flexShrink: 0 }}>{getFileIcon(data.label, true)}</span>

      <span style={{
        fontSize: "11px",
        fontFamily: "ui-monospace, Consolas, monospace",
        color: "#e2e8f0",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        flex: 1,
      }}>
        {data.label}
      </span>

      <Handle type="source" position={Position.Bottom} style={{ background: "#6b7280", width: 6, height: 6 }} />
    </div>
  );
}

export default memo(FileNode);