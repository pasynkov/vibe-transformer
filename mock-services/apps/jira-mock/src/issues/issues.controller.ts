import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { IssuesService } from './issues.service';
import { IssueDto } from './dto/issue.dto';

@ApiTags('issues')
@Controller('v1/issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get(':ticketId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get issue by ticket ID',
    description: 'Retrieve a Jira issue by its ticket key (e.g., BR-1234)',
  })
  @ApiParam({
    name: 'ticketId',
    description: 'Jira ticket key (e.g., BR-1234, BR-1235, BR-1236)',
    example: 'BR-1235',
  })
  @ApiResponse({
    status: 200,
    description: 'Issue found and returned',
    type: IssueDto,
  })
  @ApiNotFoundResponse({
    description: 'Issue not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Issue with key BR-9999 not found' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  getIssue(@Param('ticketId') ticketId: string): IssueDto {
    return this.issuesService.findByKey(ticketId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all issues',
    description: 'Retrieve all available issues (for testing/debugging)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all issues',
    type: [IssueDto],
  })
  getAllIssues(): IssueDto[] {
    return this.issuesService.findAll();
  }
}
