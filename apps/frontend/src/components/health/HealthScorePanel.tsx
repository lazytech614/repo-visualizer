import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { HealthScore } from "@/types/health";

interface Props {
  health: HealthScore | null;
}

function barColor(score: number) {
  if (score >= 80) return "#1D9E75";
  if (score >= 50) return "#EF9F27";
  return "#E24B4A";
}

function gradeStyle(grade: string): { bg: string; color: string } {
  if (grade === "A") return { bg: "#E1F5EE", color: "#085041" };
  if (grade === "B") return { bg: "#EAF3DE", color: "#27500A" };
  if (grade === "C") return { bg: "#FAEEDA", color: "#633806" };
  if (grade === "D") return { bg: "#FCEBEB", color: "#791F1F" };
  return                    { bg: "#F7C1C1", color: "#501313" };
}

const DIMENSION_ICONS: Record<string, string> = {
  "Cyclic dependencies":      "circle-off",
  "Average complexity":       "chart-line",
  "Complexity outliers":      "alert-triangle",
  "High-complexity file ratio": "files",
  "Dead files":               "file-off",
  "Dependency density":       "git-branch",
};

export default function HealthScorePanel({ health }: Props) {
  if (!health) return null;

  const scoreColor = barColor(health.score);
  const { bg, color } = gradeStyle(health.grade);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs font-medium">Repository health</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Weighted score across complexity, dependencies, and dead code.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">

        {/* Score hero */}
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor"
                className="text-muted" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke={scoreColor} strokeWidth="3"
                strokeDasharray={`${health.score} ${100 - health.score}`}
                strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-medium">
              {health.score}
            </span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Overall score</p>
            <p className="text-3xl font-medium leading-none mb-2">{health.score}<span className="text-sm text-muted-foreground font-normal"> / 100</span></p>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: bg, color }}>
              Grade {health.grade}
            </span>
          </div>
        </div>

        <hr className="border-border" />

        {/* Dimensions */}
        <div className="space-y-0">
          {health.dimensions.map((d) => {
            const icon = DIMENSION_ICONS[d.label] ?? "chart-bar";
            return (
              <div key={d.label} className="flex items-center gap-3 py-2 border-b last:border-0">
                <i className={`ti ti-${icon} text-muted-foreground text-base w-5 text-center shrink-0`} aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-none mb-1">{d.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.penalty} · weight {Math.round(d.weight * 100)}%
                  </p>
                </div>
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden shrink-0">
                  <div className="h-full rounded-full"
                    style={{ width: `${d.score}%`, background: barColor(d.score) }} />
                </div>
                <span className="text-xs font-medium w-7 text-right shrink-0"
                  style={{ color: barColor(d.score) }}>
                  {d.score}
                </span>
              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}