import { Skeleton } from "../ui/skeleton";

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-8">
      {/* Overview skeleton */}
<div>
  <div className="flex items-center gap-2 mb-4">
    <Skeleton className="h-5 w-16 rounded-full" />
    <Skeleton className="h-px flex-1" />
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {["Total Files", "Directories", "Dependencies", "Cycle Count"].map((label) => (
      <div key={label} className="rounded-lg border border-border p-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    ))}
  </div>
</div>

{/* Chart skeleton */}
<div className="mt-8">
  {/* Header */}
  <div className="flex items-start justify-between mb-4">
    <div className="space-y-1.5">
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-3 w-56" />
    </div>
    {/* Legend pill */}
    <div className="flex items-center gap-2 mt-0.5">
      <Skeleton className="h-3 w-8" />
      <Skeleton className="h-2 w-24 rounded-full" />
      <Skeleton className="h-3 w-8" />
    </div>
  </div>

  {/* Chart body */}
  <div className="space-y-3">
    {[100, 82, 78, 61, 58, 55, 52, 50, 46, 44].map((widthPct, i) => (
      <div key={i} className="flex items-center gap-3">
        {/* Y-axis label */}
        <Skeleton className="h-3 shrink-0 w-28" />
        {/* Bar */}
        <Skeleton
          className="h-5 rounded-r-md"
          style={{ width: `${widthPct}%` }}
        />
      </div>
    ))}
  </div>

  {/* X-axis ticks */}
  <div className="flex justify-between mt-3 pl-31">
    {[0, 1, 2, 3, 4, 5, 6].map((n) => (
      <Skeleton key={n} className="h-2.5 w-3" />
    ))}
  </div>
</div>

      {/* Issues skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-px flex-1" />
        </div>
        <div className="rounded-lg border border-border p-4 space-y-3">
              <Skeleton className="h-3 w-32" />
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-3" style={{ width: `${60 + j * 15}%` }} />
                </div>
              ))}
            </div>
      </div>

      {/* Graph skeleton */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-5 w-32 rounded-full" />
          <Skeleton className="h-px flex-1" />
        </div>
        <div className="rounded-xl border border-border overflow-hidden bg-muted/20" style={{ height: "400px" }}>
          {/* Fake nodes */}
          <div className="relative w-full h-full">
            {[
              { top: "15%", left: "20%" },
              { top: "15%", left: "50%" },
              { top: "15%", left: "75%" },
              { top: "45%", left: "10%" },
              { top: "45%", left: "35%" },
              { top: "45%", left: "62%" },
              { top: "72%", left: "25%" },
              { top: "72%", left: "55%" },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute"
                style={{ top: pos.top, left: pos.left }}
              >
                <Skeleton className="h-9 w-36 rounded-lg" />
              </div>
            ))}

            {/* Fake edges as SVG lines */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              {[
                [200, 70, 480, 70],
                [480, 70, 710, 70],
                [200, 70, 110, 195],
                [480, 70, 340, 195],
                [710, 70, 590, 195],
                [110, 195, 250, 320],
                [340, 195, 520, 320],
              ].map(([x1, y1, x2, y2], i) => (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="hsl(var(--border))"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              ))}
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-xs text-muted-foreground font-mono animate-pulse opacity-20">
                building dependency graph...
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}