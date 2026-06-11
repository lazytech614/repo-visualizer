import { Skeleton } from "../ui/skeleton";

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-8">

      {/* Tabs bar skeleton */}
      <div className="flex gap-1 flex-wrap w-full">
        <Skeleton className="h-9 rounded-md w-full flex items-center justify-between gap-x-2" />
      </div>

      {/* OverviewDashboard — stat cards grid */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {["Total Files", "Directories", "Dependencies", "Cycles", "Dependency Density"].map((label) => (
          <div key={label} className="rounded-lg border border-border p-4 space-y-3 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-12" />
          </div>
        ))}
      </div>

      {/* MostImportedFilesChart + ComplexityPanel row */}
      <div className="flex gap-4 flex-col lg:flex-row">

        {/* MostImportedFilesChart */}
        <div className="flex-1 rounded-lg border border-border p-4 space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <div className="flex gap-x-2">
            {["Average Imports", "Most Imported"].map((label) => (
              <div key={label} className="rounded-lg border border-border p-2 space-y-3 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="h-8 w-full" />
          <div className="space-y-3">
            {[100, 84, 76, 68, 60, 54, 46, 40, 34, 28].map((pct, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-28 shrink-0" />
                <Skeleton className="h-5 rounded-r-sm" style={{ width: `${pct}%` }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-2.5 w-4" />
            ))}
          </div>
        </div>

        {/* ComplexityPanel */}
        <div className="flex-1 rounded-lg border border-border p-4 space-y-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex gap-x-2">
            {["Files analysed", "Average Complexity", "Highest Score"].map((label) => (
              <div key={label} className="rounded-lg border border-border p-2 space-y-3 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-12" />
              </div>
            ))}
          </div>
          <div className="flex gap-x-2">
            <Skeleton className="h-8 w-5/6" />
            <Skeleton className="h-8 w-1/6" />
          </div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-1">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}