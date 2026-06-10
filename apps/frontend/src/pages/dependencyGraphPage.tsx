import { useState } from "react";
import DependencyGraph from "../components/dependency-graph/DependencyGraph";
import { getCycles, getDependencies, getOverview } from "../services/repository.service";
import { type DependencyGraph as GraphType } from "../types/dependency";
import OverviewDashboard from "../components/dashboard/OverviewDashboard";
import { type OverviewStats } from "../types/overview";
import CyclePanel from "../components/cycles/CyclePanel";

export default function DependencyGraphPage() {

  const [path, setPath] = useState("");
  const [graph, setGraph] = useState<GraphType | null>(null);
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [cycles, setCycles] = useState<string[][]>([]);
  const [highlightedCycle, setHighlightedCycle] = useState<string[]>([]);

  async function analyze() {
    try {
      setLoading(true);

      const [ graphResponse, overviewResponse, cycleResponse ] = await Promise.all([
        getDependencies(path),
        getOverview(path),
        getCycles(path),
      ]);

      setGraph(graphResponse.graph);
      setOverview(overviewResponse);
      setCycles(cycleResponse.cycles);
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

      {cycles && (
        <CyclePanel
          cycles={cycles}
          onSelectCycle={
            setHighlightedCycle
          }
        />
      )}

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