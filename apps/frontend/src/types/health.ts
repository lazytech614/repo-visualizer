export interface ScoredDimension {
  label: string;
  score: number;   // 0–100
  weight: number;  // relative weight
  penalty: string; // human-readable reason
}

export interface HealthScore {
  score: number;
  grade: string;
  dimensions: ScoredDimension[];
}