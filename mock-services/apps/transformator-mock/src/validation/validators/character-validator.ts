import { ValidationErrorDto } from '../dto/validation-result.dto';
import { ParsedTransaction } from './xml-parser.validator';

// Allowed characters: letters, numbers, hyphens, underscores
const VALID_RULE_CODE_PATTERN = /^[A-Za-z0-9_-]+$/;

export class CharacterValidator {
  /**
   * Check for invalid characters in RuleCode
   */
  static validate(transactions: ParsedTransaction[]): ValidationErrorDto[] {
    const errors: ValidationErrorDto[] = [];

    for (const transaction of transactions) {
      const code = transaction.ruleCode;

      if (!VALID_RULE_CODE_PATTERN.test(code)) {
        // Find the first invalid character
        const invalidChar = code.split('').find((char) => !/[A-Za-z0-9_-]/.test(char));
        const cleanCode = code.replace(/[^A-Za-z0-9_-]/g, '');

        errors.push({
          code: 'INVALID_CHARACTERS',
          message: `RuleCode '${code}' contains invalid character '${invalidChar}'`,
          severity: 'error',
          line: transaction.lineNumber,
          suggestion: `Remove special characters from RuleCode. Allowed: letters, numbers, hyphens, underscores. Example: '${cleanCode}'`,
        });
      }
    }

    return errors;
  }
}
