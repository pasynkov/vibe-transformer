import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsArray, IsOptional, IsNumber } from 'class-validator';

export class AssigneeDto {
  @ApiProperty({ example: 'john.doe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  displayName: string;

  @ApiProperty({ example: 'john.doe@schooldistrict.edu' })
  @IsString()
  email: string;
}

export class CustomFieldsDto {
  @ApiProperty({ example: 'CO_EmployeePositions' })
  @IsString()
  businessRuleName: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  countryCode: string;

  @ApiProperty({ example: 'SIMPLERULE' })
  @IsString()
  transactionType: string;

  @ApiProperty({ example: 'DEV' })
  @IsString()
  targetEnvironment: string;
}

export class AttachmentDto {
  @ApiProperty({ example: 'att-001' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'positions.csv' })
  @IsString()
  filename: string;

  @ApiProperty({ example: 'text/csv' })
  @IsString()
  mimeType: string;

  @ApiProperty({ example: 245 })
  @IsNumber()
  size: number;

  @ApiProperty({ example: '2026-02-15T10:05:00Z' })
  @IsString()
  created: string;

  @ApiProperty({ example: '/api/v1/attachments/att-001' })
  @IsString()
  downloadUrl: string;
}

export class IssueDto {
  @ApiProperty({ example: '10001' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'BR-1234' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'Create Business Rule: Employee Positions' })
  @IsString()
  summary: string;

  @ApiProperty({
    example:
      '# Business Rule Request\n\nCreate a new Business Rule for employee positions...',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 'In Progress' })
  @IsString()
  status: string;

  @ApiProperty({ type: AssigneeDto })
  @IsObject()
  assignee: AssigneeDto;

  @ApiProperty({ example: '2026-02-15T10:00:00Z' })
  @IsString()
  created: string;

  @ApiProperty({ example: '2026-02-16T14:30:00Z' })
  @IsString()
  updated: string;

  @ApiProperty({ type: CustomFieldsDto })
  @IsObject()
  customFields: CustomFieldsDto;

  @ApiProperty({ type: [AttachmentDto] })
  @IsArray()
  attachments: AttachmentDto[];
}
