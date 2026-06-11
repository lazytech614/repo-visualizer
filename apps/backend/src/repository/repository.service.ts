import { Injectable } from "@nestjs/common";

import {
  TreeService,
  DependencyService,
  findDeadFiles,
  analyzeComplexity,
  TreeResponse,
  DependencyResponse,
  OverviewResponse,
  calculateHealthScore,
  generateSummaryPrompt,
  AiService,
} from "@myapp/analyzer";

import { GithubService } from "../github/github.service";
import { ScanRepositoryDto } from "./dto/scan-repository.dto";

@Injectable()
export class RepositoryService {
  constructor(
    private readonly githubService: GithubService,
  ) {}

  private treeService = new TreeService();
  private dependencyService = new DependencyService();

  private aiService = new AiService(
    process.env.GEMINI_API_KEY!,
  );

  private async resolveRepositoryPath(
    body: ScanRepositoryDto,
  ): Promise<string> {
    if (
      body.source === "github" &&
      body.githubUrl
    ) {
      return this.githubService.cloneRepository(
        body.githubUrl,
      );
    }

    if (!body.path) {
      throw new Error(
        "Repository path is required",
      );
    }

    return body.path;
  }

  private cleanupRepository(
    body: ScanRepositoryDto,
    repositoryPath: string,
  ) {
    if (body.source === "github") {
      this.githubService.cleanup(
        repositoryPath,
      );
    }
  }

  async getTree(
    body: ScanRepositoryDto,
  ): Promise<TreeResponse> {
    const repositoryPath =
      await this.resolveRepositoryPath(
        body,
      );

    try {
      return this.treeService.generateTree(
        repositoryPath,
      );
    } finally {
      this.cleanupRepository(
        body,
        repositoryPath,
      );
    }
  }

  async getDependencies(
    body: ScanRepositoryDto,
  ): Promise<DependencyResponse> {
    const repositoryPath =
      await this.resolveRepositoryPath(
        body,
      );

    try {
      return this.dependencyService.analyze(
        repositoryPath,
      );
    } finally {
      this.cleanupRepository(
        body,
        repositoryPath,
      );
    }
  }

  async getOverview(
    body: ScanRepositoryDto,
  ): Promise<OverviewResponse> {
    const repositoryPath =
      await this.resolveRepositoryPath(
        body,
      );

    try {
      const treeResult =
        this.treeService.generateTree(
          repositoryPath,
        );

      const dependencyResult =
        this.dependencyService.analyze(
          repositoryPath,
        );

      return {
        totalFiles:
          treeResult.stats.totalFiles,

        totalDirectories:
          treeResult.stats.totalDirectories,

        totalDependencies:
          dependencyResult.stats
            .totalDependencies,

        averageDependenciesPerFile:
          dependencyResult.stats
            .averageDependenciesPerFile,

        cycleCount:
          dependencyResult.cycles.length,

        mostImportedFiles:
          dependencyResult.stats
            .mostImportedFiles,
      };
    } finally {
      this.cleanupRepository(
        body,
        repositoryPath,
      );
    }
  }

  async getCycles(
    body: ScanRepositoryDto,
  ): Promise<any> {
    const repositoryPath =
      await this.resolveRepositoryPath(
        body,
      );

    try {
      const dependencyResult =
        this.dependencyService.analyze(
          repositoryPath,
        );

      return {
        cycles:
          dependencyResult.cycles,
      };
    } finally {
      this.cleanupRepository(
        body,
        repositoryPath,
      );
    }
  }

  async getDeadFiles(
    body: ScanRepositoryDto,
  ) {
    const repositoryPath =
      await this.resolveRepositoryPath(
        body,
      );
      
    try {
      const result =
        this.dependencyService.analyze(
          repositoryPath,
        );

      return {
        deadFiles:
          findDeadFiles(
            result.graph,
          ),
      };
    } finally {
      this.cleanupRepository(
        body,
        repositoryPath,
      );
    }
  }

  async getComplexity(
    body: ScanRepositoryDto,
  ) {
    const repositoryPath =
      await this.resolveRepositoryPath(
        body,
      );

    try {
      return {
        files:
          analyzeComplexity(
            repositoryPath,
          ),
      };
    } finally {
      this.cleanupRepository(
        body,
        repositoryPath,
      );
    }
  }

  async getHealthScore(
    body: ScanRepositoryDto,
  ) {
    const repositoryPath =
      await this.resolveRepositoryPath(
        body,
      );

    try {
      const treeResult =
        this.treeService.generateTree(
          repositoryPath,
        );

      const dependencyResult =
        this.dependencyService.analyze(
          repositoryPath,
        );

      const complexityResult =
        analyzeComplexity(
          repositoryPath,
        );

      const deadFiles =
        findDeadFiles(
          dependencyResult.graph,
        );

      const totalFileCount =
        treeResult.stats.totalFiles;

      const averageComplexity =
        complexityResult.length > 0
          ? complexityResult.reduce(
              (s, f) =>
                s + f.complexity,
              0,
            ) / complexityResult.length
          : 0;

      const maxComplexity =
        complexityResult.length > 0
          ? complexityResult[0]
              .complexity
          : 0;

      const highComplexityFileCount =
        complexityResult.filter(
          (f) =>
            f.complexity > 10,
        ).length;

      return calculateHealthScore({
        cycleCount:
          dependencyResult.cycles.length,

        dependencyDensity:
          dependencyResult.stats
            .averageDependenciesPerFile,

        deadFileCount:
          deadFiles.length,

        totalFileCount,

        averageComplexity,

        maxComplexity,

        highComplexityFileCount,
      });
    } finally {
      this.cleanupRepository(
        body,
        repositoryPath,
      );
    }
  }

  async getSummary(
    body: ScanRepositoryDto,
  ) {
    const repositoryPath =
      await this.resolveRepositoryPath(
        body,
      );

    try {
      const dependencyResult =
        this.dependencyService.analyze(
          repositoryPath,
        );

      const complexity =
        analyzeComplexity(
          repositoryPath,
        );

      const deadFiles =
        findDeadFiles(
          dependencyResult.graph,
        );

      const treeResult =
        this.treeService.generateTree(
          repositoryPath,
        );

      const health =
        calculateHealthScore({
          cycleCount:
            dependencyResult.cycles
              .length,

          dependencyDensity:
            dependencyResult.stats
              .averageDependenciesPerFile,

          deadFileCount:
            deadFiles.length,

          totalFileCount:
            treeResult.stats
              .totalFiles,

          averageComplexity:
            complexity.length > 0
              ? complexity.reduce(
                  (s, f) =>
                    s +
                    f.complexity,
                  0,
                ) /
                complexity.length
              : 0,

          maxComplexity:
            complexity[0]
              ?.complexity ?? 0,

          highComplexityFileCount:
            complexity.filter(
              (f) =>
                f.complexity >
                10,
            ).length,
        });

      const prompt =
        generateSummaryPrompt({
          totalFiles:
            dependencyResult.graph
              .nodes.length,

          totalDependencies:
            dependencyResult.graph
              .edges.length,

          cycleCount:
            dependencyResult.cycles
              .length,

          deadFiles,

          hotspots: [],

          complexityFiles:
            complexity,

          healthScore:
            health.score,
        });

      return {
        summary:
          await this.aiService.generate(
            prompt,
          ),
      };
    } finally {
      this.cleanupRepository(
        body,
        repositoryPath,
      );
    }
  }
}