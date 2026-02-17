#!/bin/bash
# Generate XML from CSV and metadata
# Usage: ./generate-xml.sh BR-1234

set -e

TICKET_ID="$1"

if [ -z "$TICKET_ID" ]; then
  echo "❌ Error: Ticket ID required"
  echo "Usage: $0 <ticket-id>"
  echo "Example: $0 BR-1234"
  exit 1
fi

CSV_FILE="input-$TICKET_ID.csv"
METADATA_FILE="metadata-$TICKET_ID.json"
OUTPUT_FILE="output/output-$TICKET_ID.xml"

if [ ! -f "$CSV_FILE" ]; then
  echo "❌ Error: CSV file not found: $CSV_FILE"
  echo "Run ./fetch-task.sh $TICKET_ID first"
  exit 1
fi

if [ ! -f "$METADATA_FILE" ]; then
  echo "❌ Error: Metadata file not found: $METADATA_FILE"
  echo "Run ./fetch-task.sh $TICKET_ID first"
  exit 1
fi

echo "📝 Generating XML for $TICKET_ID..."

# Extract metadata
BUSINESS_RULE=$(jq -r '.businessRuleName' "$METADATA_FILE")
COUNTRY=$(jq -r '.countryCode' "$METADATA_FILE")

# Start XML
mkdir -p output
cat > "$OUTPUT_FILE" << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<Import>
EOF

# Process CSV rows (skip header)
tail -n +2 "$CSV_FILE" | while IFS=, read -r RULE_CODE DESCRIPTION; do
  # Trim whitespace
  RULE_CODE=$(echo "$RULE_CODE" | xargs)
  DESCRIPTION=$(echo "$DESCRIPTION" | xargs)

  cat >> "$OUTPUT_FILE" << XMLEOF
  <!-- Transaction for: $RULE_CODE -->
  <Transaction>
    <Header>
      <TransactionType>SIMPLERULE</TransactionType>
      <BusinessRule>$BUSINESS_RULE</BusinessRule>
    </Header>
    <SimpleRule>
      <RuleCode>$RULE_CODE</RuleCode>
      <Description>$DESCRIPTION</Description>
      <CountryCode>$COUNTRY</CountryCode>
    </SimpleRule>
  </Transaction>
XMLEOF
done

# Close XML
echo "</Import>" >> "$OUTPUT_FILE"

echo ""
echo "✅ XML Generated Successfully"
echo ""
echo "📁 Saved to: $OUTPUT_FILE"
echo "📊 Records: $(grep -c '<Transaction>' "$OUTPUT_FILE")"
echo ""
echo "### Preview:"
head -20 "$OUTPUT_FILE"
echo "..."
echo ""
echo "Next: Validate XML using ./validate-xml.sh $TICKET_ID"
