import { FileCount } from "../dependency/dependency-stats-types";

export interface OverviewResponse {
    totalFiles: number,
    totalDirectories: number,
    totalDependencies: number,
    averageDependenciesPerFile: number,
    cycleCount: number,
    mostImportedFiles: FileCount[],
}