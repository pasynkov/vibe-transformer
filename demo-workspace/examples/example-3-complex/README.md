# Example 3: Complex Business Rule (Large Dataset)

**Complexity**: High
**Expected Result**: Success after validation
**Use Case**: Demonstrate scalability and performance

---

## Scenario

Create Business Rule with 15 teacher certification codes.

- Larger dataset (15 records vs 5-6 in other examples)
- Clean data (no errors expected)
- Tests performance and scalability
- Shows that AI can handle bulk operations

---

## Files

- **jira-task.json** - Jira API response for task BR-1236
- **input.csv** - 15 teacher certification codes
- **output.xml** - Expected generated XML (15 transactions)

---

## Demo Flow

1. Show larger dataset in `input.csv`
2. Use Copilot to generate XML
3. Validate → Success ✅
4. Highlight: **Same workflow, different scale**
5. Total time: ~4 minutes (even with 15 records!)

---

## Key Points

- ✅ Workflow scales linearly (not exponentially)
- ✅ Same 5-minute process for 5 or 50 records
- ✅ Manual process would take 40+ minutes for 15 records
- ✅ AI advantage increases with dataset size

---

## Expected Outcome

✅ Validation passes on first attempt
✅ All 15 records imported successfully
✅ Demonstrates scalability of AI-assisted workflow
