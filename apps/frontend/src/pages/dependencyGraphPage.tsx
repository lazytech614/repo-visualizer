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
  Sparkles,
  LayoutDashboard,
  HeartPulse,
  CircleAlert,
} from "lucide-react";
import DependencyGraph from "../components/dependency-graph/DependencyGraph";
import {
  getAiSummary,
  getComplexity,
  getCycles,
  getDeadFiles,
  getDependencies,
  getHealthScore,
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
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import type { TreeNode } from "../types/repository";
import AnalysisSkeleton from "../components/skeletons/AnalysisSkeleton";
import MostImportedFilesChart from "../components/charts/MostImportedFiles";
import type { Hotspot } from "../types/hotspot";
import HotspotPanel from "../components/hotspot/HotspotPanel";
import type { FileComplexity, HealthScore } from "@myapp/analyzer";
import ComplexityPanel from "@/components/complexity/ComplexityPanel";
import HealthScorePanel from "@/components/health/HealthScorePanel";
import SummaryPanel from "@/components/summary/SummaryPanel";

const TAB_VALUES = {
  Overview:         "overview",
  HealthScore:      "health",
  Issues:           "issues",
  "AI Summary":     "ai-summary",
  "Dependency Graph": "graph",
} as const;

type TabLabel = keyof typeof TAB_VALUES;

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
  const [hotspots, setHotspots] = useState<Hotspot[] | null>(null);
  const [complexityFiles, setComplexityFiles] = useState<FileComplexity[] | null>(null);
  const [health, setHealth] = useState<HealthScore | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const tabs: { label: TabLabel; icon: React.ReactNode }[] = [
    { label: "Overview",          icon: <LayoutDashboard size={20} color="#60a5fa" /> },
    { label: "HealthScore",       icon: <HeartPulse      size={20} color="#34d399" /> },
    { label: "Issues",            icon: <CircleAlert     size={20} color="#f87171" /> },
    { label: "AI Summary",        icon: <Sparkles        size={20} color="#a78bfa" /> },
    { label: "Dependency Graph",  icon: <GitFork         size={20} color="#fb923c" /> },
  ];

  async function analyze() {
    if (!path.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setAiSummary(null);

      const [
        graphResponse,
        overviewResponse,
        cycleResponse,
        deadFilesResponse,
        treeResponse,
        complexityResponse,
        healthResponse,
      ] = await Promise.all([
        getDependencies(path),
        getOverview(path),
        getCycles(path),
        getDeadFiles(path),
        getRepositoryTree(path),
        getComplexity(path),
        getHealthScore(path),
      ]);

      setGraph(graphResponse.graph);
      setHotspots(graphResponse.hotspots);
      setOverview(overviewResponse);
      setCycles(cycleResponse.cycles);
      setDeadFiles(deadFilesResponse.deadFiles);
      setTree(treeResponse.tree.tree);
      setComplexityFiles(complexityResponse.files);
      setHealth(healthResponse);
      setHasAnalyzed(true);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze repository. Make sure the path is valid and accessible.");
    } finally {
      setLoading(false);
    }
  }

  async function generateAiSummary() {
    if (!path.trim()) return;
    try {
      setSummaryLoading(true);
      const summary = await getAiSummary(path);
      setAiSummary(summary.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  }

  const issuesCount =
    cycles.length + deadFiles.length + (hotspots?.length ?? 0);
  const hasIssues = issuesCount > 0;
  const issueTabCount =
    (cycles.length > 0 ? 1 : 0) +
    (deadFiles.length > 0 ? 1 : 0) +
    ((hotspots?.length ?? 0) > 0 ? 1 : 0);
  const defaultIssueTab =
    cycles.length > 0 ? "cycles" : deadFiles.length > 0 ? "dead-files" : "hotspots";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Input card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Analyze a repository</CardTitle>
            <CardDescription>
              Enter an absolute path to a local repository to generate its dependency graph.
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

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main tabs */}
        {hasAnalyzed && !loading && (
          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start h-auto flex-wrap gap-1 min-h-10">
              {tabs.map(({ label, icon }) => (
                <TabsTrigger key={label} value={TAB_VALUES[label]}>
                  <span className={`mr-1.5 flex items-center`}>{icon}</span>
                  <span className="hidden md:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              {overview && <OverviewDashboard stats={overview} />}
              <div className="flex gap-4 flex-col lg:flex-row">
                {overview && <MostImportedFilesChart data={overview.mostImportedFiles} />}
                {complexityFiles && <ComplexityPanel files={complexityFiles} />}
              </div>
            </TabsContent>

            {/* Health Score */}
            <TabsContent value="health" className="mt-6">
              {health && <HealthScorePanel health={health} />}
            </TabsContent>

            {/* Issues */}
            <TabsContent value="issues" className="mt-6">
              {!hasIssues ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-3">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No issues found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This repository has no cycles, dead files, or hotspots.
                  </p>
                </div>
              ) : (
                <Tabs defaultValue={defaultIssueTab}>
                  {issueTabCount > 1 && (
                    <TabsList className="mb-4">
                      {cycles.length > 0 && (
                        <TabsTrigger value="cycles">
                          <RefreshCwIcon className="h-4 w-4 sm:hidden" />
                          <span className="hidden sm:inline">Cyclic dependencies</span>
                          <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0">
                            {cycles.length}
                          </Badge>
                        </TabsTrigger>
                      )}
                      {deadFiles.length > 0 && (
                        <TabsTrigger value="dead-files">
                          <Trash2Icon className="h-4 w-4 sm:hidden" />
                          <span className="hidden sm:inline">Dead files</span>
                          <Badge variant="secondary" className="ml-2 text-xs px-1.5 py-0 border border-white/20">
                            {deadFiles.length}
                          </Badge>
                        </TabsTrigger>
                      )}
                      {hotspots && hotspots.length > 0 && (
                        <TabsTrigger value="hotspots">
                          <AlertTriangleIcon className="h-4 w-4 sm:hidden" />
                          <span className="hidden sm:inline">Hotspots</span>
                          <Badge variant="destructive" className="ml-2 text-xs px-1.5 py-0">
                            {hotspots.length}
                          </Badge>
                        </TabsTrigger>
                      )}
                    </TabsList>
                  )}
                  <TabsContent value="cycles">
                    <CyclePanel cycles={cycles} onSelectCycle={setHighlightedCycle} />
                  </TabsContent>
                  <TabsContent value="dead-files">
                    <DeadFilesPanel deadFiles={deadFiles} />
                  </TabsContent>
                  <TabsContent value="hotspots">
                    <HotspotPanel hotspots={hotspots ?? []} />
                  </TabsContent>
                </Tabs>
              )}
            </TabsContent>

            {/* AI Summary */}
            <TabsContent value="ai-summary" className="mt-6 space-y-4">
              {!aiSummary ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-3">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No summary generated yet</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Generate an AI-powered architectural analysis of your repository.
                  </p>
                  <Button onClick={generateAiSummary} disabled={summaryLoading}>
                    {summaryLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate AI summary
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAiSummary}
                      disabled={summaryLoading}
                    >
                      {summaryLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          Regenerate
                        </>
                      )}
                    </Button>
                  </div>
                  <SummaryPanel summary={aiSummary} />
                </div>
              )}
            </TabsContent>

            {/* Dependency Graph */}
            <TabsContent value="graph" className="mt-6">
              {graph && (
                <Card>
                  <CardContent className="p-0 overflow-hidden rounded-xl">
                    <DependencyGraph
                      graph={graph}
                      highlightedNodes={highlightedCycle}
                      tree={tree}
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

          </Tabs>
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