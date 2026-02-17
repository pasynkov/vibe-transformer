import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({
    description: 'Error code',
    example: 'DUPLICATE_RULE_CODE',
  })
  code: string;

  @ApiProperty({
    description: 'Error message',
    example: 'Duplicate RuleCode found: ADMIN appears 2 times',
  })
  message: string;

  @ApiProperty({
    description: 'Severity level',
    enum: ['error', 'warning'],
    example: 'error',
  })
  severity: 'error' | 'warning';

  @ApiProperty({
    description: 'Line number in XML where error occurred',
    example: 5,
    required: false,
  })
  line?: number;

  @ApiProperty({
    description: 'Suggestion for fixing the error',
    example: 'Remove duplicate entry or rename one of the codes',
    required: false,
  })
  suggestion?: string;
}

export class ValidationResultDto {
  @ApiProperty({
    description: 'Whether validation passed',
    example: false,
  })
  valid: boolean;

  @ApiProperty({
    description: 'Attempt number for this ruleId',
    example: 1,
  })
  attemptNumber: number;

  @ApiProperty({
    description: 'List of validation errors',
    type: [ValidationErrorDto],
  })
  errors: ValidationErrorDto[];

  @ApiProperty({
    description: 'List of validation warnings',
    type: [ValidationErrorDto],
    required: false,
  })
  warnings?: ValidationErrorDto[];

  @ApiProperty({
    description: 'Timestamp of validation',
    example: '2026-02-17T10:30:00.000Z',
  })
  validatedAt: string;

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
}
