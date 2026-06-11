import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModule } from './repository/repository.module';
import { ConfigModule } from "@nestjs/config";
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    RepositoryModule, 
    GithubModule,
    ConfigModule.forRoot({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
