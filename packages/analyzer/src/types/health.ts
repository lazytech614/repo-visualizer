export interface Input {
  // Dependency health
  cycleCount: number;
  dependencyDensity: number;       // avg dependencies per file

  // Dead code
  deadFileCount: number;
  totalFileCount: number;          // needed to make dead file % relative

  // Complexity
  averageComplexity: number;
  maxComplexity: number;           // worst single file — catches outliers

  // Maintainability signals
  highComplexityFileCount: number; // files above a danger threshold
}

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