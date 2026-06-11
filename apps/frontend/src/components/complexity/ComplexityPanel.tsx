import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FileComplexity } from "@/types/complexity";

interface Props {
  files: FileComplexity[] | null;
}

function getSeverity(score: number, max: number): {
  label: string;
  variant: "destructive" | "default" | "secondary" | "outline";
} {
  const pct = score / max;
  if (pct >= 0.75) return { label: "critical", variant: "destructive" };
  if (pct >= 0.5)  return { label: "high",     variant: "default" };
  if (pct >= 0.3)  return { label: "medium",   variant: "secondary" };
  return                  { label: "low",      variant: "outline" };
}

const PAGE_SIZE = 10;
const LIMIT_OPTIONS = [
  { label: "Top 10",  value: "10" },
  { label: "Top 20",  value: "20" },
  { label: "Top 30",  value: "30" },
  { label: "Top 50",  value: "50" },
  { label: "All",     value: "all" },
];

export default function ComplexityPanel({ files }: Props) {
  const [search, setSearch]   = React.useState("");
  const [limit, setLimit]     = React.useState<string>("10");
  const [page, setPage]       = React.useState(1);

  if (!files || files.length === 0) return null;

  // Apply limit first, then search
  const limited = limit === "all" ? files : files.slice(0, Number(limit));
  const filtered = search.trim()
    ? limited.filter(f => f.file.toLowerCase().includes(search.trim().toLowerCase()))
    : limited;

  const globalMax = limited[0]?.complexity ?? 0;
  const avg = limited.length
    ? Math.round(limited.reduce((s, f) => s + f.complexity, 0) / limited.length)
    : 0;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  // Reset to page 1 when filters change
  React.useEffect(() => { setPage(1); }, [search, limit]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xs font-medium">
          High complexity files
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Files that are hard to understand, hard to maintain and likely candidates for refactoring.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Files analysed", value: limited.length },
            { label: "Avg complexity",  value: avg },
            { label: "Highest score",   value: globalMax },
          ].map(stat => (
            <div key={stat.label} className="bg-muted rounded-md p-3">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xl font-medium">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Search files..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs p-3 border rounded-md bg-background"
          />
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="w-28 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              {LIMIT_OPTIONS.map(o => (
                <SelectItem key={o.value} value={o.value} className="text-xs text-muted-foreground">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} files
        </p>

        {/* Bar rows */}
        <div className="space-y-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No files match your search.
            </p>
          ) : (
            paginated.map((file) => {
              const name = file.file.split("/").pop();
              const pct  = Math.round((file.complexity / globalMax) * 100);
              const { label, variant } = getSeverity(file.complexity, globalMax);

              return (
                <div key={file.file} className="flex items-center gap-2 py-1.5 border-b last:border-0">
                  <span style = {{fontFamily: "monospace"}} className="text-[11px] text-[#e2e8f0] sm:w-40 truncate shrink-0 text-right" title={file.file}>
                    {name}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 75 ? "#E24B4A" : pct >= 50 ? "#EF9F27" : pct >= 30 ? "#639922" : "#1D9E75",
                      }}
                    />
                  </div>
                  <div className="flex gap-2 min-w-25">
                    <span className="text-xs font-medium w-8 text-right shrink-0">
                      {file.complexity}
                    </span>
                    <Badge variant={variant} className="text-xs">{label}</Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  );
}