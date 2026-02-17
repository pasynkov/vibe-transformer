import { Injectable } from '@nestjs/common';
import { ImportRequestDto } from './dto/import-request.dto';
import { JobsService } from '../jobs/jobs.service';
import { XmlParserValidator } from '../validation/validators/xml-parser.validator';

@Injectable()
export class ImportService {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * Create import job
   */
  createImportJob(dto: ImportRequestDto): { jobId: string; status: string; createdAt: string } {
    // Count records in XML
    const transactions = XmlParserValidator.parseTransactions(dto.xml);
    const recordCount = transactions.length;

    // Create job
    const jobId = this.jobsService.createJob(
      dto.ruleId,
      dto.businessRuleName,
      dto.environment,
      recordCount,
    );

    return {
      jobId,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };
  }
}
