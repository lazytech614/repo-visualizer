import { Injectable } from "@nestjs/common";

import {
  TreeService,
  DependencyService,
  findDeadFiles
} from "@myapp/analyzer";

@Injectable()
export class RepositoryService {

  private treeService = new TreeService();
  getTree(path: string) {

    return this.treeService.generateTree(
      path
    );
  }

  private dependencyService = new DependencyService();
  getDependencies(path: string) {
    return this.dependencyService.analyze(path);
  }

  getOverview(path: string) {
    const treeResult = this.treeService.generateTree(path);
    const dependencyResult = this.dependencyService.analyze(path);

    return {
      totalFiles: treeResult.stats.totalFiles,
      totalDirectories: treeResult.stats.totalDirectories,
      totalDependencies: dependencyResult.stats.totalDependencies,
      dependencyDensity: dependencyResult.stats.dependencyDensity,
      cycleCount: dependencyResult.cycles.length,
      mostImportedFiles: dependencyResult.stats.mostImportedFiles,
    };
  }

  getCycles(path: string) {

    const dependencyResult =
      this.dependencyService.analyze(path);

    return {
      cycles:
        dependencyResult.cycles,
    };
  }

  getDeadFiles(path: string) {
    const result =
      this.dependencyService.analyze(
        path,
      );

    return {
      deadFiles:
        findDeadFiles(
          result.graph,
        ),
    };
  }
}