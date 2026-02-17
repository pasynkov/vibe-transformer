/**
 * Simple XML parser to extract RuleCode values
 * Not a full XML parser - just extracts what we need for validation
 */
export interface ParsedTransaction {
  ruleCode: string;
  description?: string;
  lineNumber?: number;
}

export class XmlParserValidator {
  /**
   * Extract all Transaction elements with RuleCode
   * Supports both simple <RuleCode> and nested <SimpleRule><RuleCode>
   */
  static parseTransactions(xml: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];

    // Find all RuleCode tags using global regex
    const ruleCodeRegex = /<RuleCode>(.*?)<\/RuleCode>/g;
    let match;
    let index = 0;

    while ((match = ruleCodeRegex.exec(xml)) !== null) {
      const ruleCode = match[1];
      const position = match.index;

      // Calculate approximate line number by counting newlines before this position
      const textBefore = xml.substring(0, position);
      const lineNumber = (textBefore.match(/\n/g) || []).length + 1;

      // Try to find Description near this RuleCode
      // Look in the surrounding 200 characters
      const surroundingText = xml.substring(
        Math.max(0, position - 100),
        Math.min(xml.length, position + 300),
      );
      const descMatch = surroundingText.match(/<Description>(.*?)<\/Description>/);
      const description = descMatch ? descMatch[1] : undefined;

      transactions.push({
        ruleCode,
        description,
        lineNumber,
      });

      index++;
    }

    return transactions;
  }

  /**
   * Get all RuleCodes from XML
   */
  static extractRuleCodes(xml: string): string[] {
    const transactions = this.parseTransactions(xml);
    return transactions.map((t) => t.ruleCode);
  }
}
