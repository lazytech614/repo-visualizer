import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface FileEntry {
  file: string;
  count: number;
  label?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: FileEntry }[];
}

interface Props {
  data: FileEntry[];
}

function parseFileName(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  return normalized.split("/").pop() ?? filePath;
}

function parseFileDir(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  const lastSlash = normalized.lastIndexOf("/");
  return lastSlash === -1 ? "" : normalized.slice(0, lastSlash);
}

// Interpolates red → yellow → green based on position (0 = red, 1 = green)
function getGradientColor(t: number): string {
  if (t < 0.5) {
    // red → yellow: t from 0 → 0.5
    const f = t / 0.5;
    const r = 239;
    const g = Math.round(68 + (234 - 68) * f);  // 68 → 234
    const b = Math.round(68 + (179 - 68) * f);  // 68 → 179 (small shift)
    return `rgb(${r},${g},${b})`;
  } else {
    // yellow → green: t from 0.5 → 1
    const f = (t - 0.5) / 0.5;
    const r = Math.round(234 - (234 - 34) * f);  // 234 → 34
    const g = Math.round(179 + (197 - 179) * f); // 179 → 197
    const b = Math.round(8 + (94 - 8) * f);      // 8 → 94
    return `rgb(${r},${g},${b})`;
  }
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const { file, count } = payload[0].payload;
  const name = parseFileName(file);
  const dir = parseFileDir(file);

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-md px-3 py-2.5 max-w-xs">
      <p className="font-mono text-xs font-semibold mb-0.5">{name}</p>
      {dir && (
        <p className="font-mono text-xs text-muted-foreground mb-2 break-all">
          {dir}
        </p>
      )}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Imported</span>
        <span className="text-xs font-semibold tabular-nums">
          {count} {count === 1 ? "time" : "times"}
        </span>
      </div>
    </div>
  );
}

// Truncate long filenames so they don't overflow the Y axis
function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

export default function MostImportedFilesChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  const max = data[0].count;
  const total = data.length;

  const chartData = data.map((item) => ({
    ...item,
    label: truncate(parseFileName(item.file), 18),
  }));

  return (
    <div className="w-full">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h2 className="text-xs font-medium">Most imported files</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Files referenced most often across the codebase
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">Least</span>
          <div
            className="h-2 w-24 rounded-full"
            style={{
              background:
                "linear-gradient(to right, rgb(34,197,94), rgb(234,179,8), rgb(239,68,68))",
            }}
          />
          <span className="text-xs text-muted-foreground">Most</span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
            barCategoryGap="30%"
          >
            <XAxis
              type="number"
              domain={[0, max]}
              tickCount={max + 1}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={148}
              tick={{
                fontSize: 11,
                fontFamily: "monospace",
                fill: "#e2e8f0", // slate-200 — always visible on dark bg
                fontWeight: 500,
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {chartData.map((entry, index) => {
                // index 0 = most imported = red (t=0), last = green (t=1)
                const t = total === 1 ? 0 : index / (total - 1);
                return (
                  <Cell
                    key={entry.file}
                    fill={getGradientColor(t)}
                    fillOpacity={0.95}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}