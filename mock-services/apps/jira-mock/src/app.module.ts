import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { IssuesModule } from './issues/issues.module';

@Module({
  imports: [HealthModule, IssuesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
