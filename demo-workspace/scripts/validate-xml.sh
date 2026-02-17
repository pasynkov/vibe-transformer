#!/bin/bash
# Validate Business Rule XML
# Usage: ./validate-xml.sh BR-1234

set -e

TICKET_ID="$1"

if [ -z "$TICKET_ID" ]; then
  echo "❌ Error: Ticket ID required"
  echo "Usage: $0 <ticket-id>"
  echo "Example: $0 BR-1234"
  exit 1
fi

XML_FILE="output/output-$TICKET_ID.xml"
METADATA_FILE="metadata-$TICKET_ID.json"

if [ ! -f "$XML_FILE" ]; then
  echo "❌ Error: XML file not found: $XML_FILE"
  echo "Run ./generate-xml.sh $TICKET_ID first"
  exit 1
fi

if [ ! -f "$METADATA_FILE" ]; then
  echo "❌ Error: Metadata file not found: $METADATA_FILE"
  exit 1
fi

echo "🔍 Validating $XML_FILE..."
echo ""

# Extract metadata
BUSINESS_RULE=$(jq -r '.businessRuleName' "$METADATA_FILE")

# Call validation API
RESULT=$(curl -s -X POST http://localhost:3002/api/v1/business-rules/validate \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "xml": $(jq -Rs '.' < "$XML_FILE"),
  "ruleId": "$TICKET_ID",
  "businessRuleName": "$BUSINESS_RULE"
}
EOF
)

# Parse result
VALID=$(echo "$RESULT" | jq -r '.valid')
ATTEMPT=$(echo "$RESULT" | jq -r '.attemptNumber')
ERROR_COUNT=$(echo "$RESULT" | jq '.errors | length')
WARNING_COUNT=$(echo "$RESULT" | jq '.warnings | length')

if [ "$VALID" = "true" ]; then
  echo "✅ Validation Passed!"
  echo ""
  echo "🎯 Attempt: $ATTEMPT"
  echo "📋 Status: Ready to import"
  echo ""
  echo "All validation checks passed. Your Business Rule is ready!"
  echo ""
  echo "Next: Import using ./import-xml.sh $TICKET_ID"
else
  echo "❌ Validation Failed"
  echo ""
  echo "🎯 Attempt: $ATTEMPT"
  echo "📋 Errors: $ERROR_COUNT"
  echo "⚠️  Warnings: $WARNING_COUNT"
  echo ""

  if [ "$ERROR_COUNT" -gt 0 ]; then
    echo "### Errors:"
    echo "$RESULT" | jq -r '.errors[] | "  [\(.line)] \(.code): \(.message)"'
    echo ""
    echo "### Suggested Fixes:"
    echo "$RESULT" | jq -r '.errors[] | "  - \(.suggestion)"'
    echo ""
  fi

  if [ "$WARNING_COUNT" -gt 0 ]; then
    echo "### Warnings:"
    echo "$RESULT" | jq -r '.warnings[] | "  [\(.line)] \(.code): \(.message)"'
    echo ""
  fi

  echo "Fix errors and run validation again."
fi

# Save validation result
echo "$RESULT" | jq '.' > "validation-result-$TICKET_ID-attempt$ATTEMPT.json"
echo ""
echo "📝 Full result saved: validation-result-$TICKET_ID-attempt$ATTEMPT.json"
