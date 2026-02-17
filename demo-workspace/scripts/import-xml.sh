#!/bin/bash
# Import Business Rule to Transformator
# Usage: ./import-xml.sh BR-1234 [environment]

set -e

TICKET_ID="$1"
ENVIRONMENT="${2:-DEV}"

if [ -z "$TICKET_ID" ]; then
  echo "❌ Error: Ticket ID required"
  echo "Usage: $0 <ticket-id> [environment]"
  echo "Example: $0 BR-1234 DEV"
  exit 1
fi

XML_FILE="output/output-$TICKET_ID.xml"
METADATA_FILE="metadata-$TICKET_ID.json"

if [ ! -f "$XML_FILE" ]; then
  echo "❌ Error: XML file not found: $XML_FILE"
  exit 1
fi

if [ ! -f "$METADATA_FILE" ]; then
  echo "❌ Error: Metadata file not found: $METADATA_FILE"
  exit 1
fi

echo "🚀 Starting import for $TICKET_ID to $ENVIRONMENT..."
echo ""

# Extract metadata
BUSINESS_RULE=$(jq -r '.businessRuleName' "$METADATA_FILE")

# Start import
IMPORT_RESULT=$(curl -s -X POST http://localhost:3002/api/v1/business-rules/import \
  -H "Content-Type: application/json" \
  -d @- << EOF
{
  "xml": $(jq -Rs '.' < "$XML_FILE"),
  "ruleId": "$TICKET_ID",
  "businessRuleName": "$BUSINESS_RULE",
  "environment": "$ENVIRONMENT"
}
EOF
)

JOB_ID=$(echo "$IMPORT_RESULT" | jq -r '.jobId')
echo "📋 Job ID: $JOB_ID"
echo "⏳ Status: Starting..."
echo ""

# Poll job status
while true; do
  JOB_STATUS=$(curl -s http://localhost:3002/api/v1/jobs/$JOB_ID/status)

  STATUS=$(echo "$JOB_STATUS" | jq -r '.status')
  PROGRESS=$(echo "$JOB_STATUS" | jq -r '.progress')

  # Show progress bar
  FILLED=$((PROGRESS / 10))
  EMPTY=$((10 - FILLED))
  BAR=$(printf '█%.0s' $(seq 1 $FILLED))$(printf '░%.0s' $(seq 1 $EMPTY))

  echo -ne "\r⏳ Status: $STATUS | Progress: [$BAR] $PROGRESS%"

  if [ "$STATUS" = "completed" ]; then
    echo ""
    echo ""
    echo "✅ Import Completed Successfully!"
    echo ""

    RECORDS=$(echo "$JOB_STATUS" | jq -r '.result.recordsImported')
    COMPLETED_AT=$(echo "$JOB_STATUS" | jq -r '.completedAt')

    echo "📊 Records Imported: $RECORDS"
    echo "🕐 Completed At: $COMPLETED_AT"
    echo "🎯 Environment: $ENVIRONMENT"
    echo ""
    echo "🎉 Business Rule \"$BUSINESS_RULE\" has been successfully deployed!"

    # Save result
    echo "$JOB_STATUS" | jq '.' > "import-result-$TICKET_ID.json"
    echo ""
    echo "📝 Full result saved: import-result-$TICKET_ID.json"
    break
  fi

  if [ "$STATUS" = "failed" ]; then
    echo ""
    echo ""
    echo "❌ Import Failed"
    echo ""
    echo "$JOB_STATUS" | jq '.result'
    exit 1
  fi

  sleep 1
done
