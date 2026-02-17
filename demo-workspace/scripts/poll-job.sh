#!/bin/bash
# Poll job status until completion
# Usage: ./poll-job.sh <job-id>

set -e

JOB_ID="$1"

if [ -z "$JOB_ID" ]; then
  echo "❌ Error: Job ID required"
  echo "Usage: $0 <job-id>"
  echo "Example: $0 job-abc-123"
  exit 1
fi

echo "📋 Polling job: $JOB_ID"
echo ""

while true; do
  JOB_STATUS=$(curl -s http://localhost:3002/api/v1/jobs/$JOB_ID/status)

  STATUS=$(echo "$JOB_STATUS" | jq -r '.status')
  PROGRESS=$(echo "$JOB_STATUS" | jq -r '.progress')

  # Show progress bar
  FILLED=$((PROGRESS / 10))
  EMPTY=$((10 - FILLED))
  BAR=$(printf '█%.0s' $(seq 1 $FILLED))$(printf '░%.0s' $(seq 1 $EMPTY))

  TIMESTAMP=$(date '+%H:%M:%S')
  echo -ne "\r[$TIMESTAMP] Status: $STATUS | Progress: [$BAR] $PROGRESS%"

  if [ "$STATUS" = "completed" ] || [ "$STATUS" = "failed" ]; then
    echo ""
    echo ""
    echo "Final Result:"
    echo "$JOB_STATUS" | jq '.'
    break
  fi

  sleep 1
done
