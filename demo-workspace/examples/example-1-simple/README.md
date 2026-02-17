# Example 1: Simple Business Rule

**Complexity**: Simple
**Expected Result**: Success on first validation
**Use Case**: Basic demo workflow

---

## Scenario

Create Business Rule for employee positions with 5 clean records.

- No duplicates
- All codes valid length (≤6 chars)
- No special characters
- Should pass validation on first attempt

---

## Files

- **jira-task.json** - Jira API response for task BR-1234
- **input.csv** - 5 employee position codes
- **output.xml** - Expected generated XML

---

## Demo Flow

1. Show `jira-task.json` - the task details
2. Show `input.csv` - clean data
3. Use Copilot to generate XML
4. Validate → Success ✅
5. Total time: ~3 minutes

---

## Expected Outcome

✅ Validation passes on first attempt
✅ All 5 records imported successfully
✅ Demonstrates fast path when data is clean
