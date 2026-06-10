import { useState } from "react";
import RepositoryTree from "../components/repository-tree/RepositoryTree";
import { getRepositoryTree } from "../services/repository.service";
import { type TreeNode } from "../types/repository";
import { Search } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function RepositoryPage() {
  const [path, setPath] = useState("");
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    try {
      setLoading(true);
      const response = await getRepositoryTree(path);
      setTree(response.tree.tree);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
        <Input
          value={path}
          onChange={(e: any) => setPath(e.target.value)}
          onKeyDown={(e: any) => e.key === "Enter" && analyze()}
          placeholder="Repository path"
          className="w-80 h-8 text-sm"
        />
        <Button
          onClick={analyze}
          disabled={loading}
          size="sm"
          className="gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          {loading ? "Scanning..." : "Analyze"}
        </Button>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {tree && <RepositoryTree tree={tree} />}
      </div>
    </div>
  );
}