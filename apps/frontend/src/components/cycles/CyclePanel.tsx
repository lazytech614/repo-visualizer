import { useState } from "react";

interface Props {
  cycles: string[][];
  onSelectCycle: (cycle: string[]) => void;
}

export default function CyclePanel({ cycles, onSelectCycle }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (cycles.length === 0) {
    return (
      <div className="p-4 text-xs text-zinc-500 font-['Segoe_UI',sans-serif]">
        No circular dependencies detected
      </div>
    );
  }

  function handleCycleClick(cycle: string[], index: number) {
    if (selectedIndex === index) {
      // deselect — clear the highlight
      setSelectedIndex(null);
      onSelectCycle([]);
    } else {
      setSelectedIndex(index);
      onSelectCycle(cycle);
    }
  }

  return (
    <div className="font-['Segoe_UI',sans-serif] text-sm text-zinc-300 h-full flex-1">
      <div className="flex items-center justify-between border-b border-zinc-700">
        <p className="px-3 py-2 text-xs font-semibold tracking-widest uppercase text-zinc-400">
          Circular Dependencies
        </p>
        {cycles.length > 0 && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400">
            {cycles.length}
          </span>
        )}
      </div>

      {/* hint */}
      <p className="px-3 pt-2 text-xs text-zinc-500 italic">
        Click a cycle to highlight it in the graph. Click again to deselect.
      </p>

      <div className="p-3 space-y-3 flex flex-col gap-y-2">
        {cycles.map((cycle, index) => {
          const isSelected = selectedIndex === index;
          return (
            <div
              key={index}
              className={`border rounded-md p-3 cursor-pointer transition-colors ${
                isSelected
                  ? "border-red-500 bg-red-950/60 ring-1 ring-red-500"
                  : "border-red-900 bg-red-950/30 hover:bg-red-950/50"
              }`}
              onClick={() => handleCycleClick(cycle, index)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-red-400">
                  ⚠ Cycle #{index + 1}
                </span>
                {isSelected && (
                  <span className="text-xs text-red-300 italic">highlighted</span>
                )}
              </div>

              <ul className="space-y-1">
                {cycle.map((file, i) => {
                  const name = file.split(/[\\\/]/).pop() ?? file;
                  return (
                    <li
                      key={file}
                      className="flex items-center gap-1 text-xs font-mono text-zinc-300"
                    >
                      {i > 0 && <span className="text-zinc-500">→</span>}
                      <span className="text-red-300">{name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}