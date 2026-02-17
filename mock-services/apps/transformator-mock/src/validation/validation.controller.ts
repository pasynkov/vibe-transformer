import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { ValidationService } from './validation.service';
import { ValidateRequestDto } from './dto/validate-request.dto';
import { ValidationResultDto } from './dto/validation-result.dto';

@ApiTags('validation')
@Controller('v1/business-rules')
export class ValidationController {
  constructor(private readonly validationService: ValidationService) {}

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate Business Rule XML',
    description:
      'Validates Business Rule XML content. Tracks attempt number per ruleId. Returns validation errors if any.',
  })
  @ApiResponse({
    status: 200,
    description: 'Validation completed (may contain errors)',
    type: ValidationResultDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body',
  })
  validate(@Body() dto: ValidateRequestDto): ValidationResultDto {
    return this.validationService.validate(dto);
  }
}
