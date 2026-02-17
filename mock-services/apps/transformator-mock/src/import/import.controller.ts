import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ImportService } from './import.service';
import { ImportRequestDto } from './dto/import-request.dto';

@ApiTags('import')
@Controller('v1/business-rules')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Import Business Rule XML',
    description:
      'Creates an import job for validated Business Rule XML. Returns job ID for status tracking.',
  })
  @ApiResponse({
    status: 200,
    description: 'Import job created successfully',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-1708167000000-abc123' },
        status: { type: 'string', example: 'queued' },
        createdAt: { type: 'string', example: '2026-02-17T10:30:00.000Z' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body',
  })
  import(@Body() dto: ImportRequestDto) {
    return this.importService.createImportJob(dto);
  }
}
