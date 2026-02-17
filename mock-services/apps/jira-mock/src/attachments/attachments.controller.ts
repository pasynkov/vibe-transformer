import { Controller, Get, Param, HttpCode, HttpStatus, Res, Header } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AttachmentsService } from './attachments.service';
import { IssuesService } from '../issues/issues.service';
import { AttachmentListDto } from './dto/attachment-list.dto';

@ApiTags('attachments')
@Controller('v1')
export class AttachmentsController {
  constructor(
    private readonly attachmentsService: AttachmentsService,
    private readonly issuesService: IssuesService,
  ) {}

  @Get('issues/:ticketId/attachments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get attachments list for issue',
    description: 'Retrieve list of attachments for a specific Jira issue',
  })
  @ApiParam({
    name: 'ticketId',
    description: 'Jira ticket key (e.g., BR-1234)',
    example: 'BR-1235',
  })
  @ApiResponse({
    status: 200,
    description: 'Attachments list returned',
    type: AttachmentListDto,
  })
  @ApiNotFoundResponse({
    description: 'Issue not found',
  })
  getIssueAttachments(@Param('ticketId') ticketId: string): AttachmentListDto {
    const issue = this.issuesService.findByKey(ticketId);
    return {
      attachments: issue.attachments,
    };
  }

  @Get('attachments/:attachmentId')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'text/csv')
  @ApiOperation({
    summary: 'Download attachment file',
    description: 'Download CSV file content for a specific attachment',
  })
  @ApiParam({
    name: 'attachmentId',
    description: 'Attachment ID (e.g., att-001, att-002, att-003)',
    example: 'att-002',
  })
  @ApiResponse({
    status: 200,
    description: 'CSV file content',
    content: {
      'text/csv': {
        schema: {
          type: 'string',
          example: 'RuleCode,Description\nADMIN,Administration\nHR,Human Resources',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Attachment not found',
  })
  downloadAttachment(@Param('attachmentId') attachmentId: string, @Res() res: Response) {
    const { content, filename } = this.attachmentsService.getAttachmentFile(attachmentId);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  }
}
