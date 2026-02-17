import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JobStatusDto } from './dto/job-status.dto';

@ApiTags('jobs')
@Controller('v1/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get(':jobId/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get job status',
    description: 'Retrieve the current status of an import job',
  })
  @ApiParam({
    name: 'jobId',
    description: 'Job ID returned from import endpoint',
    example: 'job-1708167000000-abc123',
  })
  @ApiResponse({
    status: 200,
    description: 'Job status retrieved successfully',
    type: JobStatusDto,
  })
  @ApiNotFoundResponse({
    description: 'Job not found',
  })
  getJobStatus(@Param('jobId') jobId: string): JobStatusDto {
    return this.jobsService.getJobStatus(jobId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all jobs',
    description: 'Retrieve all jobs (for debugging)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all jobs',
    type: [JobStatusDto],
  })
  getAllJobs(): JobStatusDto[] {
    return this.jobsService.getAllJobs();
  }
}
