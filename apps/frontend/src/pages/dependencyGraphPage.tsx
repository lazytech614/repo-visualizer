import { useState } from "react";
import DependencyGraph from "../components/dependency-graph/DependencyGraph";
import { getCycles, getDeadFiles, getDependencies, getOverview } from "../services/repository.service";
import { type DependencyGraph as GraphType } from "../types/dependency";
import OverviewDashboard from "../components/dashboard/OverviewDashboard";
import { type OverviewStats } from "../types/overview";
import CyclePanel from "../components/cycles/CyclePanel";
import DeadFilesPanel from "../components/dead-files/DeadFilesPanel";

export default function DependencyGraphPage() {

  const [path, setPath] = useState("");
  const [graph, setGraph] = useState<GraphType | null>(null);
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [cycles, setCycles] = useState<string[][]>([]);
  const [highlightedCycle, setHighlightedCycle] = useState<string[]>([]);
  const [deadFiles, setDeadFiles] = useState<string[]>([]);

  async function analyze() {
    try {
      setLoading(true);

      const [ 
        graphResponse, 
        overviewResponse, 
        cycleResponse, 
        deadFilesResponse 
      ] = await Promise.all([
        getDependencies(path),
        getOverview(path),
        getCycles(path),
        getDeadFiles(path),
      ]);

      setGraph(graphResponse.graph);
      setOverview(overviewResponse);
      setCycles(cycleResponse.cycles);
      setDeadFiles(deadFilesResponse.deadFiles);
    }catch (error) {
      console.error(error);
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-20 flex flex-col items-center justify-between gap-y-6">
      <div>
        <h1>Dependency Graph</h1>
        <input
          value={path}
          onChange={(e) =>
            setPath(e.target.value)
          }
          placeholder="Repository path"
        />
        <button
          onClick={analyze}
        >
          Analyze
        </button>
      </div>

      {loading && (
        <p>
          Generating graph...
        </p>
      )}

      {overview && (
          <OverviewDashboard
            stats={overview}
          />
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:items-start w-full">
        {cycles && (
          <CyclePanel
            cycles={cycles}
            onSelectCycle={
              setHighlightedCycle
            }
          />
        )}

        {deadFiles && (
          <DeadFilesPanel
            deadFiles={deadFiles}
          />
        )}
      </div>

      {graph && (
        <DependencyGraph
          graph={graph}
           highlightedNodes={
            highlightedCycle
          }
        />
      )}
    </div>
  );
}