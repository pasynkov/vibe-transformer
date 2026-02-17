import { Injectable, NotFoundException } from '@nestjs/common';
import { JobStatus, JobStatusDto, JobResultDto } from './dto/job-status.dto';

interface Job {
  jobId: string;
  status: JobStatus;
  progress: number;
  createdAt: string;
  completedAt?: string;
  ruleId: string;
  businessRuleName: string;
  environment: string;
  result?: JobResultDto;
  recordCount: number;
}

@Injectable()
export class JobsService {
  private jobs: Map<string, Job> = new Map();

  /**
   * Create a new job
   */
  createJob(
    ruleId: string,
    businessRuleName: string,
    environment: string,
    recordCount: number,
  ): string {
    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const job: Job = {
      jobId,
      status: JobStatus.QUEUED,
      progress: 0,
      createdAt: new Date().toISOString(),
      ruleId,
      businessRuleName,
      environment,
      recordCount,
    };

    this.jobs.set(jobId, job);

    // Start job progression simulation
    this.simulateJobProgression(jobId);

    return jobId;
  }

  /**
   * Get job status
   */
  getJobStatus(jobId: string): JobStatusDto {
    const job = this.jobs.get(jobId);

    if (!job) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }

    return {
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      ruleId: job.ruleId,
      businessRuleName: job.businessRuleName,
      environment: job.environment,
      result: job.result,
    };
  }

  /**
   * Simulate job progression: queued → running → completed
   * In a real system, this would be handled by a background worker
   */
  private simulateJobProgression(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (!job) return;

    // After 1 second: queued → running
    setTimeout(() => {
      const job = this.jobs.get(jobId);
      if (job && job.status === JobStatus.QUEUED) {
        job.status = JobStatus.RUNNING;
        job.progress = 10;
      }
    }, 1000);

    // After 2 seconds: progress 50%
    setTimeout(() => {
      const job = this.jobs.get(jobId);
      if (job && job.status === JobStatus.RUNNING) {
        job.progress = 50;
      }
    }, 2000);

    // After 3 seconds: progress 80%
    setTimeout(() => {
      const job = this.jobs.get(jobId);
      if (job && job.status === JobStatus.RUNNING) {
        job.progress = 80;
      }
    }, 3000);

    // After 4 seconds: completed
    setTimeout(() => {
      const job = this.jobs.get(jobId);
      if (job && job.status === JobStatus.RUNNING) {
        job.status = JobStatus.COMPLETED;
        job.progress = 100;
        job.completedAt = new Date().toISOString();
        job.result = {
          success: true,
          recordsImported: job.recordCount,
        };
      }
    }, 4000);
  }

  /**
   * Get all jobs (for debugging)
   */
  getAllJobs(): JobStatusDto[] {
    return Array.from(this.jobs.values()).map((job) => ({
      jobId: job.jobId,
      status: job.status,
      progress: job.progress,
      createdAt: job.createdAt,
      completedAt: job.completedAt,
      ruleId: job.ruleId,
      businessRuleName: job.businessRuleName,
      environment: job.environment,
      result: job.result,
    }));
  }
}
