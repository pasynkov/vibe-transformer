import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export enum Environment {
  DEV = 'DEV',
  QA = 'QA',
  PROD = 'PROD',
}

export class ImportRequestDto {
  @ApiProperty({
    description: 'XML content to import',
    example: '<Import><Transaction><RuleCode>ADMIN</RuleCode></Transaction></Import>',
  })
  @IsString()
  @IsNotEmpty()
  xml: string;

  @ApiProperty({
    description: 'Business Rule ID from Jira (e.g., BR-1235)',
    example: 'BR-1235',
  })
  @IsString()
  @IsNotEmpty()
  ruleId: string;

  @ApiProperty({
    description: 'Business Rule name',
    example: 'CO_DepartmentCodes',
  })
  @IsString()
  @IsNotEmpty()
  businessRuleName: string;

  @ApiProperty({
    description: 'Target environment for import',
    enum: Environment,
    example: 'DEV',
  })
  @IsEnum(Environment)
  environment: Environment;
}
