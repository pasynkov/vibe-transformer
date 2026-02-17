import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ValidationModule } from './validation/validation.module';
import { ImportModule } from './import/import.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [HealthModule, ValidationModule, ImportModule, JobsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
