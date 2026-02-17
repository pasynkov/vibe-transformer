import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ValidateRequestDto {
  @ApiProperty({
    description: 'XML content to validate',
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
}
