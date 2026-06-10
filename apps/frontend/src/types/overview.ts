export interface OverviewStats {
  totalFiles: number;
  totalDirectories: number;
  totalDependencies: number;
  averageDependenciesPerFile: number;
  mostImportedFiles: {
    count: number;
    file: string;
  }[];
  cycleCount: number;
}