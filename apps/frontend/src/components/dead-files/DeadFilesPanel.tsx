interface Props {
  deadFiles: string[];
}

export default function DeadFilesPanel({ deadFiles }: Props) {
  if (deadFiles.length === 0) {
    return (
      <div className="p-4 text-xs text-zinc-500 font-['Segoe_UI',sans-serif]">
        No dead files detected
      </div>
    );
  }

  return (
    <div className="font-['Segoe_UI',sans-serif] text-sm text-zinc-300 h-full flex-1">
      <div className="flex items-center justify-between border-b border-zinc-700">
        <p className="px-3 py-2 text-xs font-semibold tracking-widest uppercase text-zinc-400">
          Dead Files
        </p>
        {deadFiles.length > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400">
            {deadFiles.length}
          </span>
        )}
      </div>

      {/* hint */}
      <p className="px-3 pt-2 text-xs text-zinc-500 italic">
        Dead files are files that are not imported by any other file and no other files are imported by them.
      </p>

      <div className="rounded-xl mt-3 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {!deadFiles.length ? (
          <div className="flex flex-col items-center gap-1.5 py-8 text-center">
            <span className="text-lg">✓</span>
            <p className="text-sm text-zinc-400">No dead files detected</p>
          </div>
        ) : (
          <ul>
            {deadFiles.map((file, i) => {
              const parts = file.replace(/\\/g, "/").split("/");
              const filename = parts.pop() ?? file;
              const [name, ...extParts] = filename.split(".");
              const ext = extParts.join(".");
              const dir = parts.join("/");

              return (
                <li
                  key={file}
                  className={`flex items-center gap-3 px-4 py-2.5 ${
                    i < deadFiles.length - 1
                      ? "border-b border-zinc-100 dark:border-zinc-800"
                      : ""
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex gap-x-2">
                      <div className="text-xs text-zinc-500 mb-1">Name:</div>
                      <div className="text-xs font-mono text-zinc-300 break-all text-start">{name}
                        {ext && (
                          <span className="text-zinc-400 font-normal">
                            .{ext}
                          </span>
                        )}</div>
                    </div>
                    <div className="flex gap-x-2">
                      <div className="text-xs text-zinc-500 mb-1">Path:</div>
                      <div className="text-xs font-mono text-zinc-300 break-all text-start">{dir}</div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}