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
    private readonly repositoryService:
      RepositoryService
  ) {}

  @Post("tree")
  getTree(
    @Body()
    body: ScanRepositoryDto
  ) {

    return {
      tree:
        this.repositoryService.getTree(
          body.path
        ),
    };
  }

  @Post("dependencies")
  getDependencies(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService
      .getDependencies(body.path);
  }

  @Post("overview")
  getOverview(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService
      .getOverview(body.path);
  }

  @Post("cycles")
  getCycles(
    @Body()
    body: ScanRepositoryDto,
  ) {
    return this.repositoryService
      .getCycles(body.path);
  }
}