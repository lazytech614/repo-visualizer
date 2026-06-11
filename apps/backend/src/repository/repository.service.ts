import { Injectable } from "@nestjs/common";

import {
  TreeService,
  DependencyService,
  findDeadFiles,
  analyzeComplexity,
  TreeResponse,
  DependencyResponse,
  OverviewResponse,
  Cycle,
  calculateHealthScore,
  generateSummaryPrompt,
  AiService
} from "@myapp/analyzer";

@Injectable()
export class RepositoryService {

  private treeService = new TreeService();
  getTree(path: string): TreeResponse {

    return this.treeService.generateTree(
      path
    );
  }

  private dependencyService = new DependencyService();
  getDependencies(path: string): DependencyResponse {
    return this.dependencyService.analyze(path);
  }

  getOverview(path: string): OverviewResponse {
    const treeResult = this.treeService.generateTree(path);
    const dependencyResult = this.dependencyService.analyze(path);

    return {
      totalFiles: treeResult.stats.totalFiles,
      totalDirectories: treeResult.stats.totalDirectories,
      totalDependencies: dependencyResult.stats.totalDependencies,
      averageDependenciesPerFile: dependencyResult.stats.averageDependenciesPerFile,
      cycleCount: dependencyResult.cycles.length,
      mostImportedFiles: dependencyResult.stats.mostImportedFiles,
    };
  }

  getCycles(path: string): any {

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

  getComplexity(
    repositoryPath: string,
  ) {

    return {
      files:
        analyzeComplexity(
          repositoryPath,
        ),
    };
  }

  getHealthScore(path: string) {
    const treeResult = this.treeService.generateTree(path);
    const dependencyResult = this.dependencyService.analyze(path);
    const complexityResult = analyzeComplexity(path);
    const deadFiles = findDeadFiles(dependencyResult.graph);

    const totalFileCount = treeResult.stats.totalFiles;
    const averageComplexity =
      complexityResult.length > 0
        ? complexityResult.reduce((s, f) => s + f.complexity, 0) / complexityResult.length
        : 0;
    const maxComplexity =
      complexityResult.length > 0
        ? complexityResult[0].complexity  // already sorted descending by analyzeComplexity
        : 0;
    const highComplexityFileCount = complexityResult.filter(
      f => f.complexity > 10  // cyclomatic complexity danger threshold
    ).length;

    return calculateHealthScore({
      cycleCount: dependencyResult.cycles.length,
      dependencyDensity: dependencyResult.stats.averageDependenciesPerFile,
      deadFileCount: deadFiles.length,
      totalFileCount,
      averageComplexity,
      maxComplexity,
      highComplexityFileCount,
    });
  }

  private aiService = new AiService(process.env.GEMINI_API_KEY!);
  async getSummary(repositoryPath: string) {
    const dependencyResult = this.dependencyService.analyze(repositoryPath);
    const complexity = analyzeComplexity(repositoryPath);
    const deadFiles = findDeadFiles(dependencyResult.graph);
    const treeResult = this.treeService.generateTree(repositoryPath);

    // reuse already-computed results instead of calling getHealthScore()
    const health = calculateHealthScore({
      cycleCount: dependencyResult.cycles.length,
      dependencyDensity: dependencyResult.stats.averageDependenciesPerFile,
      deadFileCount: deadFiles.length,
      totalFileCount: treeResult.stats.totalFiles,
      averageComplexity: complexity.length > 0
        ? complexity.reduce((s, f) => s + f.complexity, 0) / complexity.length
        : 0,
      maxComplexity: complexity[0]?.complexity ?? 0,
      highComplexityFileCount: complexity.filter(f => f.complexity > 10).length,
    });

    const prompt = generateSummaryPrompt({
      totalFiles: dependencyResult.graph.nodes.length,
      totalDependencies: dependencyResult.graph.edges.length,
      cycleCount: dependencyResult.cycles.length,
      deadFiles,
      hotspots: [],
      complexityFiles: complexity,
      healthScore: health.score,
    });

    return {
      summary: await this.aiService.generate(prompt),
    };
  }
}