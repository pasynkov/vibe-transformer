import { ValidationErrorDto } from '../dto/validation-result.dto';
import { ParsedTransaction } from './xml-parser.validator';

const MAX_RULE_CODE_LENGTH = 6;
const MIN_RULE_CODE_LENGTH_WARNING = 4;

export class LengthValidator {
  /**
   * Check RuleCode length constraints
   */
  static validate(transactions: ParsedTransaction[]): ValidationErrorDto[] {
    const errors: ValidationErrorDto[] = [];

    for (const transaction of transactions) {
      const code = transaction.ruleCode;

      // Error: Too long
      if (code.length > MAX_RULE_CODE_LENGTH) {
        const shortened = code.substring(0, MAX_RULE_CODE_LENGTH);
        errors.push({
          code: 'RULE_CODE_TOO_LONG',
          message: `RuleCode '${code}' exceeds maximum length of ${MAX_RULE_CODE_LENGTH} characters`,
          severity: 'error',
          line: transaction.lineNumber,
          suggestion: `Shorten RuleCode to ${MAX_RULE_CODE_LENGTH} characters or less. Example: '${shortened}'`,
        });
      }

      // Warning: Too short
      if (code.length < MIN_RULE_CODE_LENGTH_WARNING && code.length > 0) {
        errors.push({
          code: 'SHORT_RULE_CODE',
          message: `RuleCode '${code}' is very short (${code.length} chars). Consider using more descriptive code.`,
          severity: 'warning',
          line: transaction.lineNumber,
          suggestion: `Use at least ${MIN_RULE_CODE_LENGTH_WARNING} characters for better readability. Example: '${code.toUpperCase().padEnd(MIN_RULE_CODE_LENGTH_WARNING, 'X')}'`,
        });
      }
    }

    return errors;
  }
}
