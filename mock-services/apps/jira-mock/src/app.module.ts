import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { IssuesModule } from './issues/issues.module';
import { AttachmentsModule } from './attachments/attachments.module';

@Module({
  imports: [HealthModule, IssuesModule, AttachmentsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
