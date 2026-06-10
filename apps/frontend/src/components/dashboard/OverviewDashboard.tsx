import StatsCard from "./StatsCard";
import { type OverviewStats } from "../../types/overview";

interface Props {
  stats: OverviewStats;
}

export default function OverviewDashboard({
  stats,
}: Props) {

  return (
    <div className="w-full flex items-center justify-between gap-4">
      <StatsCard
        title="Total Files"
        value={stats.totalFiles}
      />

      <StatsCard
        title="Directories"
        value={
          stats.totalDirectories
        }
      />

      <StatsCard
        title="Dependencies"
        value={
          stats.totalDependencies
        }
      />

      <StatsCard
        title="Cycle Count"
        value={stats.cycleCount}
      />

      {/* <StatsCard
        title="Dependency Density"
        value={
          stats.dependencyDensity.toFixed(
            2
          )
        }
      /> */}
    </div>
  );
}