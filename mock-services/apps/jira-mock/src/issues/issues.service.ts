import { Injectable, NotFoundException } from '@nestjs/common';
import { IssueDto } from './dto/issue.dto';
import { ISSUES_MAP } from './data/seed-data';

@Injectable()
export class IssuesService {
  /**
   * Get issue by ticket ID (e.g., BR-1234)
   */
  findByKey(ticketId: string): IssueDto {
    const issue = ISSUES_MAP.get(ticketId);

    if (!issue) {
      throw new NotFoundException(`Issue with key ${ticketId} not found`);
    }

    return issue;
  }

  /**
   * Get all available issues (for testing/debugging)
   */
  findAll(): IssueDto[] {
    return Array.from(ISSUES_MAP.values());
  }
}
