export interface SummaryContext {
  totalFiles: number;
  totalDirectories: number;

  totalDependencies: number;
  dependencyDensity: number;

  cycleCount: number;

  deadFiles: string[];

  hotspots: string[];

  complexityFiles: {
    file: string;
    complexity: number;
  }[];

  healthScore: number;

  healthGrade: string;
}

interface BuildSummaryContextParams {
  totalFiles: number;
  totalDirectories: number;

  totalDependencies: number;
  dependencyDensity: number;

  cycleCount: number;

  deadFiles: string[];

  hotspots: string[];

  complexityFiles: {
    file: string;
    complexity: number;
  }[];

  healthScore: number;

  healthGrade: string;
}

export function buildSummaryContext(
  params: BuildSummaryContextParams,
): SummaryContext {
  return {
    totalFiles: params.totalFiles,

    totalDirectories:
      params.totalDirectories,

    totalDependencies:
      params.totalDependencies,

    dependencyDensity:
      params.dependencyDensity,

    cycleCount:
      params.cycleCount,

    deadFiles:
      params.deadFiles,

    hotspots:
      params.hotspots,

    complexityFiles:
      params.complexityFiles,

    healthScore:
      params.healthScore,

    healthGrade:
      params.healthGrade,
  };
}