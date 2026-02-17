#!/bin/bash
# List all available Jira tasks
# Usage: ./list-tasks.sh

set -e

echo "📋 Fetching all available tasks..."
echo ""

# Get all issues
ISSUES=$(curl -s http://localhost:3001/api/v1/issues)

if [ -z "$ISSUES" ]; then
  echo "❌ Error: Failed to fetch issues"
  echo "Make sure Jira Mock API is running:"
  echo "  cd ../mock-services && docker compose ps"
  exit 1
fi

# Parse and display
echo "✅ Available Tasks:"
echo ""

# Show tasks
echo "$ISSUES" | jq -r '.[] | "  \(.key) - \(.summary)"'
echo ""

# Count
TOTAL=$(echo "$ISSUES" | jq '. | length')
echo "Total: $TOTAL tasks"
echo ""

# Save full list
echo "$ISSUES" | jq '.' > tasks-list.json
echo "📝 Full details saved: tasks-list.json"
echo ""

# Show detailed information
echo "### Task Details:"
echo ""
echo "$ISSUES" | jq -r '.[] | "📋 \(.key): \(.customFields.businessRuleName) (\(.customFields.countryCode))"'
echo ""

echo "Next: Use ./fetch-task.sh <task-id> to start working on a task"
