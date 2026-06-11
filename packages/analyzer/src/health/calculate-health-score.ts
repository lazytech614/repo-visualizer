import { HealthScore, Input, ScoredDimension } from "../types/health";

// Linearly interpolates: maps `value` in [low, high] to a 0–100 score.
// Values at or below `low` score 100; at or above `high` score 0.
function linearScore(value: number, low: number, high: number): number {
  if (value <= low)  return 100;
  if (value >= high) return 0;
  return Math.round(100 * (1 - (value - low) / (high - low)));
}

export function calculateHealthScore(input: Input): HealthScore {
  const deadFileRatio = input.totalFileCount > 0
    ? input.deadFileCount / input.totalFileCount
    : 0;

  const highComplexityRatio = input.totalFileCount > 0
    ? input.highComplexityFileCount / input.totalFileCount
    : 0;

  // Each dimension scores 0–100 and carries a weight.
  // Weights sum to 1.0 for a clean weighted average.
  const dimensions: ScoredDimension[] = [
    {
      label: "Cyclic dependencies",
      // 0 cycles = perfect; 10+ = critical
      score: linearScore(input.cycleCount, 0, 10),
      weight: 0.25,
      penalty: input.cycleCount === 0
        ? "No cycles detected"
        : `${input.cycleCount} cycle${input.cycleCount > 1 ? "s" : ""} found`,
    },
    {
      label: "Average complexity",
      // Industry standard: cyclomatic complexity >10 is high risk
      score: linearScore(input.averageComplexity, 5, 20),
      weight: 0.20,
      penalty: `Avg complexity ${input.averageComplexity.toFixed(1)}`,
    },
    {
      label: "Complexity outliers",
      // A single file at 50+ complexity is a serious smell
      score: linearScore(input.maxComplexity, 10, 50),
      weight: 0.15,
      penalty: `Worst file complexity ${input.maxComplexity}`,
    },
    {
      label: "High-complexity file ratio",
      // More than 20% of files being complex is a red flag
      score: linearScore(highComplexityRatio, 0.05, 0.30),
      weight: 0.15,
      penalty: `${(highComplexityRatio * 100).toFixed(0)}% of files are high complexity`,
    },
    {
      label: "Dead files",
      // More than 10% dead files = poor housekeeping
      score: linearScore(deadFileRatio, 0.02, 0.15),
      weight: 0.15,
      penalty: `${input.deadFileCount} dead file${input.deadFileCount !== 1 ? "s" : ""} (${(deadFileRatio * 100).toFixed(0)}%)`,
    },
    {
      label: "Dependency density",
      // >5 avg dependencies per file starts getting tangled
      score: linearScore(input.dependencyDensity, 3, 10),
      weight: 0.10,
      penalty: `Avg ${input.dependencyDensity.toFixed(1)} dependencies per file`,
    },
  ];

  // Weighted average across all dimensions
  const weightedScore = dimensions.reduce(
    (sum, d) => sum + d.score * d.weight,
    0,
  );

  const score = Math.max(0, Math.min(100, Math.round(weightedScore)));

  // Non-linear grade boundaries — harder to get an A, more nuance in the middle
  let grade: string;
  if (score >= 90)      grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 65) grade = "C";
  else if (score >= 50) grade = "D";
  else                  grade = "F";

  return { score, grade, dimensions };
}