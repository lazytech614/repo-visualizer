import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
