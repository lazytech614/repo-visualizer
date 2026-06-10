import { useState } from "react";
import { 
  GitFork, 
  Search, 
  Loader2, 
  FolderOpen, 
  AlertCircle 
} from "lucide-react";
import DependencyGraph from "../components/dependency-graph/DependencyGraph";
import { 
  getCycles, 
  getDeadFiles, 
  getDependencies, 
  getOverview, 
  getRepositoryTree
} from "../services/repository.service";
import { type DependencyGraph as GraphType } from "../types/dependency";
import OverviewDashboard from "../components/dashboard/OverviewDashboard";
import { type OverviewStats } from "../types/overview";
import CyclePanel from "../components/cycles/CyclePanel";
import DeadFilesPanel from "../components/dead-files/DeadFilesPanel";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import type { TreeNode } from "../types/repository";

export default function DependencyGraphPage() {
  const [path, setPath] = useState("");
  const [graph, setGraph] = useState<GraphType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [cycles, setCycles] = useState<string[][]>([]);
  const [highlightedCycle, setHighlightedCycle] = useState<string[]>([]);
  const [deadFiles, setDeadFiles] = useState<string[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [tree, setTree] = useState<TreeNode | null>(null)

  async function analyze() {
    if (!path.trim()) return;
    try {
      setLoading(true);
      setError(null);

      const [graphResponse, overviewResponse, cycleResponse, deadFilesResponse, treeResponse] =
        await Promise.all([
          getDependencies(path),
          getOverview(path),
          getCycles(path),
          getDeadFiles(path),
          getRepositoryTree(path)
        ]);

      setGraph(graphResponse.graph);
      setOverview(overviewResponse);
      setCycles(cycleResponse.cycles);
      setDeadFiles(deadFilesResponse.deadFiles);
      setTree(treeResponse.tree.tree);
      setHasAnalyzed(true);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze repository. Make sure the path is valid and accessible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10">
            <GitFork className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none">Repo Visualizer</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Dependency graph analysis</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Input card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Analyze a repository</CardTitle>
            <CardDescription>
              Enter an absolute path to a local repository to generate its dependency graph.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={path}
                  onChange={(e: any) => setPath(e.target.value)}
                  onKeyDown={(e: any) => e.key === "Enter" && analyze()}
                  placeholder="/home/user/my-project"
                  className="pl-9 font-mono text-sm"
                />
              </div>
              <Button onClick={analyze} disabled={loading || !path.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {hasAnalyzed && !loading && (
          <div className="space-y-8">
            {/* Overview */}
            {overview && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-medium">Overview</h2>
                  <Separator className="flex-1" />
                </div>
                <OverviewDashboard stats={overview} />
              </div>
            )}

            {/* Cycles + Dead files */}
            {(cycles.length > 0 || deadFiles.length > 0) && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-medium">Issues</h2>
                  {cycles.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {cycles.length} {cycles.length === 1 ? "cycle" : "cycles"}
                    </Badge>
                  )}
                  {deadFiles.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {deadFiles.length} dead {deadFiles.length === 1 ? "file" : "files"}
                    </Badge>
                  )}
                  <Separator className="flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CyclePanel cycles={cycles} onSelectCycle={setHighlightedCycle} />
                  <DeadFilesPanel deadFiles={deadFiles} />
                </div>
              </div>
            )}

            {/* Graph */}
            {graph && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-medium">Dependency graph</h2>
                  <Separator className="flex-1" />
                </div>
                <Card>
                  <CardContent className="p-0 overflow-hidden rounded-xl">
                    <DependencyGraph graph={graph} highlightedNodes={highlightedCycle} tree={tree} />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!hasAnalyzed && !loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
              <GitFork className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No repository analyzed yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Enter a path above and click Analyze to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}