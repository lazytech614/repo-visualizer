import { Module } from '@nestjs/common';
import { RepositoryController } from './repository.controller';
import { RepositoryService } from './repository.service';
import { GithubModule } from '../github/github.module';

@Module({
  imports: [ GithubModule],
  controllers: [RepositoryController],
  providers: [RepositoryService]
})
export class RepositoryModule {}
