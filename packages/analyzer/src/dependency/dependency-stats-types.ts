export interface FileCount {
  file: string;
  count: number;
}

export interface DependencyStats {
  totalFiles: number;
  totalDependencies: number;

  averageDependenciesPerFile: number;

  mostImportedFiles: FileCount[];

  mostDependentFiles: FileCount[];

  isolatedFiles: string[];
}