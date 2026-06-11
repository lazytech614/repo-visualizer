import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface FileEntry {
  file: string;
  count: number;
}

interface Props {
  data: FileEntry[] | null;
}

function getSeverity(count: number, max: number): {
  label: string;
  variant: "destructive" | "default" | "secondary" | "outline";
} {
  const pct = count / max;
  if (pct >= 0.75) return { label: "critical", variant: "destructive" };
  if (pct >= 0.5)  return { label: "high",     variant: "default" };
  if (pct >= 0.3)  return { label: "medium",   variant: "secondary" };
  return                  { label: "low",      variant: "outline" };
}

function parseFileName(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  return normalized.split("/").pop() ?? filePath;
}

const DISPLAY_LIMIT = 10;

export default function MostImportedFilesChart({ data }: Props) {
  const [search, setSearch] = React.useState("");

  if (!data || data.length === 0) return null;

  const limited  = data.slice(0, DISPLAY_LIMIT);
  const filtered = search.trim()
    ? limited.filter(f => f.file.toLowerCase().includes(search.trim().toLowerCase()))
    : limited;

  const globalMax = limited[0]?.count ?? 0;
  const avg = limited.length
    ? Math.round(limited.reduce((s, f) => s + f.count, 0) / limited.length)
    : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xs font-medium">
          Most imported files
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Files referenced most often across the codebase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Avg imports",   value: avg },
            { label: "Most imported", value: globalMax },
          ].map(stat => (
            <div key={stat.label} className="bg-muted rounded-md p-3">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xl font-medium">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <Input
          placeholder="Search files..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full text-xs p-3 border rounded-md bg-background"
        />

        {/* Bar rows */}
        <div className="space-y-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No files match your search.
            </p>
          ) : (
            filtered.map((file) => {
              const name = parseFileName(file.file);
              const pct  = Math.round((file.count / globalMax) * 100);
              const { label, variant } = getSeverity(file.count, globalMax);

              return (
                <div key={file.file} className="flex items-center gap-2 py-1.5 border-b last:border-0">
                  <span
                    style={{ fontFamily: "monospace" }}
                    className="text-[11px] text-[#e2e8f0] w-40 truncate shrink-0 text-right"
                    title={file.file}
                  >
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
                      {file.count}
                    </span>
                    <Badge variant={variant} className="text-xs">{label}</Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </CardContent>
    </Card>
  );
}