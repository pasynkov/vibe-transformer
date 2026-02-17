import { Injectable, BadRequestException } from '@nestjs/common';
import { ValidateRequestDto } from './dto/validate-request.dto';
import { ValidationResultDto, ValidationErrorDto } from './dto/validation-result.dto';
import { ValidationStateService } from '../state/validation-state.service';

@Injectable()
export class ValidationService {
  constructor(private readonly stateService: ValidationStateService) {}

  /**
   * Validate Business Rule XML
   */
  validate(dto: ValidateRequestDto): ValidationResultDto {
    // Get and increment attempt number
    const attemptNumber = this.stateService.getAndIncrementAttempt(dto.ruleId);

    // Basic XML validation
    const errors = this.validateXml(dto.xml);

    const result: ValidationResultDto = {
      valid: errors.length === 0,
      attemptNumber,
      errors,
      warnings: [],
      validatedAt: new Date().toISOString(),
      ruleId: dto.ruleId,
      businessRuleName: dto.businessRuleName,
    };

    return result;
  }

  /**
   * Basic XML validation
   * For now, just checks if XML is well-formed
   * More sophisticated validation will be added in iteration 1.6
   */
  private validateXml(xml: string): ValidationErrorDto[] {
    const errors: ValidationErrorDto[] = [];

    // Check if XML is empty
    if (!xml || xml.trim().length === 0) {
      errors.push({
        code: 'EMPTY_XML',
        message: 'XML content cannot be empty',
        severity: 'error',
        suggestion: 'Provide valid XML content',
      });
      return errors;
    }

    // Check for basic XML structure
    if (!xml.includes('<Import>') || !xml.includes('</Import>')) {
      errors.push({
        code: 'INVALID_XML_STRUCTURE',
        message: 'XML must be wrapped in <Import></Import> tags',
        severity: 'error',
        suggestion: 'Ensure XML starts with <Import> and ends with </Import>',
      });
    }

    // Check for Transaction tags
    if (!xml.includes('<Transaction>')) {
      errors.push({
        code: 'MISSING_TRANSACTION',
        message: 'XML must contain at least one <Transaction> element',
        severity: 'error',
        suggestion: 'Add <Transaction> elements inside <Import>',
      });
    }

    // Basic well-formedness check (matching tags)
    try {
      this.checkMatchingTags(xml);
    } catch (error) {
      errors.push({
        code: 'MALFORMED_XML',
        message: error.message,
        severity: 'error',
        suggestion: 'Check that all opening tags have matching closing tags',
      });
    }

    return errors;
  }

  /**
   * Check if XML has matching opening and closing tags
   * Simple validation - not a full XML parser
   */
  private checkMatchingTags(xml: string): void {
    const openTags: string[] = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(xml)) !== null) {
      const fullTag = match[0];
      const tagName = match[1];

      if (fullTag.startsWith('</')) {
        // Closing tag
        const lastOpen = openTags.pop();
        if (lastOpen !== tagName) {
          throw new Error(
            `Mismatched closing tag: expected </${lastOpen}> but found </${tagName}>`,
          );
        }
      } else if (!fullTag.endsWith('/>')) {
        // Opening tag (not self-closing)
        openTags.push(tagName);
      }
    }

    if (openTags.length > 0) {
      throw new Error(`Unclosed tags: ${openTags.join(', ')}`);
    }
  }
}
