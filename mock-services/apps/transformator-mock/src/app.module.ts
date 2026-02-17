import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ValidationModule } from './validation/validation.module';

@Module({
  imports: [HealthModule, ValidationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
