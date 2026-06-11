import {
  Body,
  Controller,
  Post,
} from "@nestjs/common";

import { RepositoryService } from "./repository.service";
import { ScanRepositoryDto } from "./dto/scan-repository.dto";

@Controller("repository")
export class RepositoryController {
  constructor(
    private readonly repositoryService: RepositoryService,
  ) {}

  @Post("tree")
  async getTree(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return {
      tree: await this.repositoryService.getTree(
        body,
      ),
    };
  }

  @Post("dependencies")
  async getDependencies(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService.getDependencies(
      body,
    );
  }

  @Post("overview")
  async getOverview(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService.getOverview(
      body,
    );
  }

  @Post("cycles")
  async getCycles(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService.getCycles(
      body,
    );
  }

  @Post("dead-files")
  async getDeadFiles(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService.getDeadFiles(
      body,
    );
  }

  @Post("complexity")
  async getComplexity(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService.getComplexity(
      body,
    );
  }

  @Post("health")
  async getHealthScore(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService.getHealthScore(
      body,
    );
  }

  @Post("summary")
  async getSummary(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService.getSummary(
      body,
    );
  }
}