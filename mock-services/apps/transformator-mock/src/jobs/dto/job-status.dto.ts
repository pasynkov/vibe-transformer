import { ApiProperty } from '@nestjs/swagger';

export enum JobStatus {
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class JobResultDto {
  @ApiProperty({
    description: 'Whether import was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Number of records imported',
    example: 6,
  })
  recordsImported: number;

  @ApiProperty({
    description: 'Error message if failed',
    example: null,
    required: false,
  })
  errorMessage?: string;
}

export class JobStatusDto {
  @ApiProperty({
    description: 'Job ID',
    example: 'job-uuid-123',
  })
  jobId: string;

  @ApiProperty({
    description: 'Current job status',
    enum: JobStatus,
    example: 'completed',
  })
  status: JobStatus;

  @ApiProperty({
    description: 'Job progress percentage (0-100)',
    example: 100,
  })
  progress: number;

  @ApiProperty({
    description: 'Job creation timestamp',
    example: '2026-02-17T10:30:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Job completion timestamp',
    example: '2026-02-17T10:30:05.000Z',
    required: false,
  })
  completedAt?: string;

  @ApiProperty({
    description: 'Business Rule ID',
    example: 'BR-1235',
  })
  ruleId: string;

  @ApiProperty({
    description: 'Business Rule name',
    example: 'CO_DepartmentCodes',
  })
  businessRuleName: string;

  @ApiProperty({
    description: 'Target environment',
    example: 'DEV',
  })
  environment: string;

  @ApiProperty({
    description: 'Job result (available when completed)',
    type: JobResultDto,
    required: false,
  })
  result?: JobResultDto;
}
