import { useState } from "react";
import {
  GitFork,
  Search,
  Loader2,
  FolderOpen,
  AlertCircle,
  RefreshCwIcon,
  Trash2Icon,
  AlertTriangleIcon,
} from "lucide-react";
import DependencyGraph from "../components/dependency-graph/DependencyGraph";
import {
  getCycles,
  getDeadFiles,
  getDependencies,
  getOverview,
  getRepositoryTree,
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
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import type { TreeNode } from "../types/repository";
import AnalysisSkeleton from "../components/skeletons/AnalysisSkeleton";
import MostImportedFilesChart from "../components/charts/MostImportedFiles";
import type { Hotspot } from "../types/hotspot";
import HotspotPanel from "../components/hotspot/HotspotPanel";

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
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[] | null>(null)

  async function analyze() {
    if (!path.trim()) return;
    try {
      setLoading(true);
      setError(null);

      const [
        graphResponse,
        overviewResponse,
        cycleResponse,
        deadFilesResponse,
        treeResponse,
      ] = await Promise.all([
        getDependencies(path),
        getOverview(path),
        getCycles(path),
        getDeadFiles(path),
        getRepositoryTree(path),
      ]);

      setGraph(graphResponse.graph);
      setHotspots(graphResponse.hotspots)
      setOverview(overviewResponse);
      setCycles(cycleResponse.cycles);
      setDeadFiles(deadFilesResponse.deadFiles);
      setTree(treeResponse.tree.tree);
      setHasAnalyzed(true);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to analyze repository. Make sure the path is valid and accessible."
      );
    } finally {
      setLoading(false);
    }
  }

  const hasIssues = cycles.length > 0 || deadFiles.length > 0;

  // Determine default tab: prefer cycles if present, else dead-files
  const defaultTab = cycles.length > 0 ? "cycles" : "dead-files";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Input card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Analyze a repository</CardTitle>
            <CardDescription>
              Enter an absolute path to a local repository to generate its
              dependency graph.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
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
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && <AnalysisSkeleton />}

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
                <MostImportedFilesChart data={overview.mostImportedFiles} />
              </div>
            )}

            {/* Issues — tabbed */}
            {hasIssues && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-medium">Issues</h2>
                  <Separator className="flex-1" />
                </div>

                <Tabs defaultValue={defaultTab}>
                  <TabsList className="mb-4">
                    {cycles.length > 0 && (
                      <TabsTrigger value="cycles" disabled={cycles.length === 0}>
                        <RefreshCwIcon className="h-4 w-4 sm:hidden" />
                        <span className="hidden sm:inline">Circular dependencies</span>
                        {cycles.length > 0 && (
                          <Badge
                            variant="destructive"
                            className="ml-2 text-xs px-1.5 py-0"
                          >
                            {cycles.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    )}

                    {deadFiles.length > 0 && (
                      <TabsTrigger
                        value="dead-files"
                        disabled={deadFiles.length === 0}
                      >
                        <Trash2Icon className="h-4 w-4 sm:hidden" />
                        <span className="hidden sm:inline">Dead files</span>
                        {deadFiles.length > 0 && (
                          <Badge
                            variant="secondary"
                            className="ml-2 text-xs px-1.5 py-0 border border-white/20"
                          >
                            {deadFiles.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    )}

                    {hotspots &&hotspots.length > 0 && (
                      <TabsTrigger value="hotspots" disabled={hotspots.length === 0}>
                      <AlertTriangleIcon className="h-4 w-4 sm:hidden" />
                      <span className="hidden sm:inline">Hotspots</span>
                      {hotspots.length > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-2 text-xs px-1.5 py-0"
                        >
                          {hotspots.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="cycles">
                    <CyclePanel
                      cycles={cycles}
                      onSelectCycle={setHighlightedCycle}
                    />
                  </TabsContent>

                  <TabsContent value="dead-files">
                    <DeadFilesPanel deadFiles={deadFiles} />
                  </TabsContent>

                  <TabsContent value="hotspots" className="flex-1 mt-0 min-h-0 overflow-y-auto">
                    <HotspotPanel hotspots={hotspots || []} />
                  </TabsContent>
                </Tabs>
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
                    <DependencyGraph
                      graph={graph}
                      highlightedNodes={highlightedCycle}
                      tree={tree}
                    />
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