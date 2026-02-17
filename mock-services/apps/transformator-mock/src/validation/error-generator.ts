import { ValidationErrorDto } from './dto/validation-result.dto';
import { XmlParserValidator } from './validators/xml-parser.validator';
import { DuplicateCheckerValidator } from './validators/duplicate-checker.validator';
import { LengthValidator } from './validators/length-validator';
import { CharacterValidator } from './validators/character-validator';

/**
 * Error Generator
 * Generates different errors based on attempt number to simulate iterative validation
 *
 * Attempt 1: Structural errors (duplicates, length)
 * Attempt 2: Content errors (invalid characters)
 * Attempt 3+: Success (no errors)
 */
export class ErrorGenerator {
  /**
   * Generate errors based on attempt number
   */
  static generateErrors(
    xml: string,
    attemptNumber: number,
  ): { errors: ValidationErrorDto[]; warnings: ValidationErrorDto[] } {
    // Parse XML to extract transactions
    const transactions = XmlParserValidator.parseTransactions(xml);

    if (transactions.length === 0) {
      return { errors: [], warnings: [] };
    }

    // Attempt 3+: Always success
    if (attemptNumber >= 3) {
      return { errors: [], warnings: [] };
    }

    const allErrors: ValidationErrorDto[] = [];
    const allWarnings: ValidationErrorDto[] = [];

    // Attempt 1: Structural errors (duplicates, length)
    if (attemptNumber === 1) {
      // Check for duplicates
      const duplicateErrors = DuplicateCheckerValidator.validate(transactions);
      allErrors.push(...duplicateErrors);

      // Check for length issues
      const lengthErrors = LengthValidator.validate(transactions);
      // Only add errors (not warnings) on attempt 1
      allErrors.push(...lengthErrors.filter((e) => e.severity === 'error'));
    }

    // Attempt 2: Content errors (invalid characters) + warnings
    if (attemptNumber === 2) {
      // Check for invalid characters
      const characterErrors = CharacterValidator.validate(transactions);
      allErrors.push(...characterErrors);

      // Add warnings from length validator
      const lengthErrors = LengthValidator.validate(transactions);
      allWarnings.push(...lengthErrors.filter((e) => e.severity === 'warning'));
    }

    return {
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  /**
   * Check if XML is valid on attempt 3+
   */
  static isValidOnAttempt3Plus(attemptNumber: number): boolean {
    return attemptNumber >= 3;
  }
}
