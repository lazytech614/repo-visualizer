interface Props {
  cycles: string[][];
}

export default function CyclePanel({ cycles }: Props) {
  if (cycles.length === 0) {
    return (
      <div className="p-4 text-xs text-zinc-500 font-['Segoe_UI',sans-serif]">
        No circular dependencies detected
      </div>
    );
  }

  return (
    <div className="font-['Segoe_UI',sans-serif] text-sm text-zinc-300 h-full">
      <div className="px-3 py-2 text-xs font-semibold tracking-widest uppercase text-zinc-400 border-b border-zinc-700">
        Circular Dependencies
      </div>

      <div className="p-3 space-y-3">
        {cycles.map((cycle, index) => (
          <div
            key={index}
            className="border border-red-900 bg-red-950/30 rounded-md p-3"
          >
            <div className="text-xs font-semibold text-red-400 mb-2">
              ⚠ Cycle #{index + 1}
            </div>

            <ul className="space-y-1">
              {cycle.map((file, i) => {
                const name = file.split(/[\\\/]/).pop() ?? file;
                return (
                  <li key={file} className="flex items-center gap-1 text-xs font-mono text-zinc-300">
                    {i > 0 && (
                      <span className="text-zinc-500">→</span>
                    )}
                    <span className="text-red-300">{name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}