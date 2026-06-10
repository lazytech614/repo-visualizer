export interface OverviewResponseDto {
  totalFiles: number;
  totalDirectories: number;
  totalDependencies: number;
  dependencyDensity: number;
  cycleCount: number;
}