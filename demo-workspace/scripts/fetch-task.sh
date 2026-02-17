#!/bin/bash
# Fetch Jira task and download CSV attachment
# Usage: ./fetch-task.sh BR-1234

set -e

TICKET_ID="$1"

if [ -z "$TICKET_ID" ]; then
  echo "❌ Error: Ticket ID required"
  echo "Usage: $0 <ticket-id>"
  echo "Example: $0 BR-1234"
  exit 1
fi

echo "📋 Fetching task $TICKET_ID..."

# Fetch issue details
ISSUE=$(curl -s http://localhost:3001/api/v1/issues/$TICKET_ID)

if [ -z "$ISSUE" ]; then
  echo "❌ Error: Failed to fetch issue"
  exit 1
fi

# Extract fields
KEY=$(echo "$ISSUE" | jq -r '.key')
SUMMARY=$(echo "$ISSUE" | jq -r '.summary')
BUSINESS_RULE=$(echo "$ISSUE" | jq -r '.customFields.businessRuleName')
COUNTRY=$(echo "$ISSUE" | jq -r '.customFields.countryCode')
ATTACH_ID=$(echo "$ISSUE" | jq -r '.attachments[0].id')
FILENAME=$(echo "$ISSUE" | jq -r '.attachments[0].filename')

echo ""
echo "✅ Task Fetched Successfully"
echo ""
echo "📋 Task: $KEY - $SUMMARY"
echo "📁 Business Rule: $BUSINESS_RULE"
echo "🌍 Country: $COUNTRY"
echo "📊 Attachment: $FILENAME"
echo ""

# Download CSV
echo "⬇️  Downloading CSV..."
curl -s http://localhost:3001/api/v1/attachments/$ATTACH_ID > "input-$TICKET_ID.csv"

echo "✅ Downloaded: input-$TICKET_ID.csv"
echo ""

# Show preview
echo "### CSV Preview:"
head -5 "input-$TICKET_ID.csv"
echo "..."
echo ""
echo "Total rows: $(wc -l < "input-$TICKET_ID.csv")"
echo ""

# Save metadata
cat > "metadata-$TICKET_ID.json" << EOF
{
  "ticketId": "$KEY",
  "summary": "$SUMMARY",
  "businessRuleName": "$BUSINESS_RULE",
  "countryCode": "$COUNTRY",
  "csvFile": "input-$TICKET_ID.csv"
}
EOF

echo "📝 Metadata saved: metadata-$TICKET_ID.json"
echo ""
echo "Next: Generate XML using ./generate-xml.sh $TICKET_ID"
