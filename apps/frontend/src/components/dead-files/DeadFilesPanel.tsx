import { useMemo, useState } from "react";
import { Input } from "../ui/input";

interface Props {
  deadFiles: string[];
}

const PAGE_SIZE = 5;

export default function DeadFilesPanel({ deadFiles }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // 🔍 filtered list
  const filteredFiles = useMemo(() => {
    if (!search.trim()) return deadFiles;

    return deadFiles.filter((file) =>
      file.toLowerCase().includes(search.toLowerCase())
    );
  }, [deadFiles, search]);

  const totalPages = Math.ceil(filteredFiles.length / PAGE_SIZE);

  // 📦 paginated list
  const paginatedFiles = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredFiles.slice(start, start + PAGE_SIZE);
  }, [filteredFiles, page]);

  return (
    <div className="font-['Segoe_UI',sans-serif] text-sm text-zinc-300 h-full flex-1 flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-700">
        <p className="px-3 py-2 text-xs font-semibold tracking-widest uppercase text-zinc-400">
          Dead Files
        </p>

        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400">
          {deadFiles.length}
        </span>
      </div>

      {/* Hint */}
      <p className="px-3 pt-2 text-xs text-zinc-500 italic">
        Files not connected to dependency graph
      </p>

      {/* 🔍 Search */}
      <div className="mt-3">
        <Input
          type="text"
          value={search}
          placeholder="Search file..."
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); 
          }}
          className="w-full text-xs p-3 border rounded-md bg-background"
        />
      </div>

      {/* List */}
      <div className="rounded-xl mt-3 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-1">
        <ul>
          {paginatedFiles.length === 0 ? (
            <div className="p-4 text-xs text-zinc-500">
              No matching files found 🔍
            </div>
          ) : (
            paginatedFiles.map((file, i) => {
              const parts = file.replace(/\\/g, "/").split("/");
              const filename = parts.pop() ?? file;
              const [name, ...extParts] = filename.split(".");
              const ext = extParts.join(".");
              const dir = parts.join("/");

              return (
                <li
                  key={file}
                  className={`flex items-center gap-3 px-4 py-2.5 ${
                    i < paginatedFiles.length - 1
                      ? "border-b border-zinc-100 dark:border-zinc-800"
                      : ""
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex gap-x-2">
                      <div className="text-xs text-zinc-500">Name:</div>
                      <div className="text-xs font-mono text-zinc-300 break-all">
                        {name}
                        {ext && (
                          <span className="text-zinc-400">.{ext}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-x-2">
                      <div className="text-xs text-zinc-500">Path:</div>
                      <div className="text-xs font-mono text-zinc-300 break-all">
                        {dir}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-zinc-800 text-xs">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded border border-zinc-700 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-zinc-400">
            Page {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 rounded border border-zinc-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}