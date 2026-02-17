import { ValidationErrorDto } from '../dto/validation-result.dto';
import { ParsedTransaction } from './xml-parser.validator';

export class DuplicateCheckerValidator {
  /**
   * Check for duplicate RuleCodes
   */
  static validate(transactions: ParsedTransaction[]): ValidationErrorDto[] {
    const errors: ValidationErrorDto[] = [];
    const codeCount = new Map<string, number>();
    const codeLines = new Map<string, number>();

    // Count occurrences and track line numbers
    for (const transaction of transactions) {
      const count = codeCount.get(transaction.ruleCode) || 0;
      codeCount.set(transaction.ruleCode, count + 1);

      if (!codeLines.has(transaction.ruleCode)) {
        codeLines.set(transaction.ruleCode, transaction.lineNumber);
      }
    }

    // Generate errors for duplicates
    for (const [code, count] of codeCount.entries()) {
      if (count > 1) {
        errors.push({
          code: 'DUPLICATE_RULE_CODE',
          message: `RuleCode '${code}' appears multiple times in the import`,
          severity: 'error',
          line: codeLines.get(code),
          suggestion: `Ensure all RuleCode values are unique. Consider using '${code}1', '${code}2' for variations.`,
        });
      }
    }

    return errors;
  }
}
