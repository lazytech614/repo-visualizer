import { useMemo, useState } from "react";
import {  ArrowLeft, ArrowRight, ArrowUpDown, FilterIcon } from "lucide-react";
import { Input } from "../ui/input";

interface Hotspot {
  file: string;
  incoming: number;
  outgoing: number;
  score: number;
  severity: "low" | "medium" | "high";
}

function getColor(severity: Hotspot["severity"]) {
  switch (severity) {
    case "high":
      return "text-red-500";
    case "medium":
      return "text-yellow-500";
    default:
      return "text-green-500";
  }
}

type SortKey = "score" | "incoming" | "outgoing";

const PAGE_SIZE = 5;

export default function HotspotPanel({
  hotspots,
}: {
  hotspots: Hotspot[];
}) {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | Hotspot["severity"]>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [asc, setAsc] = useState(false);
  const [page, setPage] = useState(1);

  const filteredAndSorted = useMemo(() => {
    let data = [...(hotspots || [])];

    // 🔍 search
    if (search.trim()) {
      data = data.filter((h) =>
        h.file.toLowerCase().includes(search.toLowerCase())
      );
    }

    // severity filter
    if (severityFilter !== "all") {
      data = data.filter((h) => h.severity === severityFilter);
    }

    // sorting
    data.sort((a, b) => {
      const diff = a[sortKey] - b[sortKey];
      return asc ? diff : -diff;
    });

    return data;
  }, [hotspots, search, severityFilter, sortKey, asc]);

  // pagination logic
  const totalPages = Math.ceil(filteredAndSorted.length / PAGE_SIZE);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSorted.slice(start, start + PAGE_SIZE);
  }, [filteredAndSorted, page]);

  return (
    <div className="font-['Segoe_UI',sans-serif] text-sm text-zinc-300 h-full flex-1">

      <div className="flex items-center justify-between border-b border-zinc-700">
        <p className="px-3 py-2 text-xs font-semibold tracking-widest uppercase text-zinc-400">
          Circular Dependencies
        </p>
        {hotspots.length > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400">
            {hotspots.length}
          </span>
        )}
      </div>

      {/* hint */}
      <p className="px-3 pt-2 text-xs text-zinc-500 italic">
        Click a cycle to highlight it in the graph. Click again to deselect.
      </p>

      <div className="flex flex-col gap-y-4 mt-3">
        <div className="flex flex-col gap-y-4">
            {/* Search */}
            <Input
                type="text"
                placeholder="Search file..."
                value={search}
                onChange={(e) => {
                setSearch(e.target.value);
                setPage(1); // reset page
                }}
                className="w-full text-xs p-3 border rounded-md bg-background"
            />

            {/* Filters */}
            <div className="flex gap-2 flex-wrap text-xs items-center">
                <FilterIcon className="w-3.5 h-3.5" />

                {["all", "high", "medium", "low"].map((s) => (
                <button
                    key={s}
                    onClick={() => {
                    setSeverityFilter(s as any);
                    setPage(1);
                    }}
                    className={`px-2 py-1 rounded border ${
                    severityFilter === s ? "bg-primary text-black" : "bg-muted"
                    }`}
                >
                    {s}
                </button>
                ))}
            </div>

            {/* Sort */}
            <div className="flex gap-2 text-xs items-center">
                <ArrowUpDown className="w-3.5 h-3.5" />

                {(["score", "incoming", "outgoing"] as SortKey[]).map((key) => (
                <button
                    key={key}
                    onClick={() => {
                    if (sortKey === key) {
                        setAsc(!asc);
                    } else {
                        setSortKey(key);
                        setAsc(false);
                    }
                    setPage(1);
                    }}
                    className={`px-2 py-1 rounded border ${
                    sortKey === key ? "bg-primary text-black" : "bg-muted"
                    }`}
                >
                    {key}
                </button>
                ))}
            </div>
        </div>

        {/* List */}
        {paginatedData.length === 0 ? (
            <div className="text-sm text-muted-foreground">
            No hotspots found 
            </div>
        ) : (
            paginatedData.map((h) => (
            <div
                key={h.file}
                className="p-2 rounded-md border bg-muted/40 text-xs"
            >
                <div className="font-medium truncate">{h.file}</div>

                <div className="flex justify-between mt-1 text-muted-foreground">
                <span>In: {h.incoming}</span>
                <span>Out: {h.outgoing}</span>
                </div>

                <div className={`mt-1 font-medium ${getColor(h.severity)}`}>
                Score: {h.score.toFixed(1)} ({h.severity})
                </div>
            </div>
            ))
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs">
            <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-2 py-1 border rounded disabled:opacity-50"
            >
                <ArrowLeft className="w-3 h-3" />
                Prev
            </button>

            <span>
                Page {page} / {totalPages}
            </span>

            <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-2 py-1 border rounded disabled:opacity-50"
            >
                Next
                <ArrowRight className="w-3 h-3" />
            </button>
            </div>
        )}
      </div>
    </div>
  );
}