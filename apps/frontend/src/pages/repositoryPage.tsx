import { useState } from "react";
import RepositoryTree from "../components/repository-tree/RepositoryTree";
import { getRepositoryTree } from "../services/repository.service";
import { type TreeNode } from "../types/repository";

export default function RepositoryPage() {

  const [path, setPath] =
    useState("");

  const [tree, setTree] =
    useState<TreeNode | null>(null);

  const [loading, setLoading] =
    useState(false);

  async function analyze() {

    try {

      setLoading(true);

      const response =
        await getRepositoryTree(path);

      setTree(response.tree.tree);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  return (
  <div style={{
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#1e1e1e",
    color: "#cccccc",
    fontFamily: "'Segoe UI', sans-serif",
  }}>
    {/* Top bar */}
    <div style={{ padding: "8px 12px", borderBottom: "1px solid #333" }}>
      <input
        value={path}
        onChange={(e) => setPath(e.target.value)}
        placeholder="Repository path"
        style={{
          backgroundColor: "#3c3c3c",
          border: "1px solid #555",
          color: "#ccc",
          padding: "4px 8px",
          fontSize: "13px",
          width: "300px",
        }}
      />
      <button
        onClick={analyze}
        style={{
          marginLeft: "8px",
          backgroundColor: "#0e639c",
          color: "#fff",
          border: "none",
          padding: "4px 12px",
          cursor: "pointer",
          fontSize: "13px",
        }}
      >
        Analyze
      </button>
    </div>

    {/* Sidebar-style tree */}
    <div style={{ padding: "4px 0", overflowY: "auto", flex: 1 }}>
      {loading && <p style={{ padding: "8px 12px" }}>Scanning...</p>}
      {tree && <RepositoryTree tree={tree} />}
    </div>
  </div>
);
}