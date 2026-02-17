# VibeTransformer Demo Flow

Complete demonstration script showing the full workflow including error handling and fixes.

## 🎯 Demo Scenario

**Goal**: Create Business Rule for Department Codes (BR-1235) with realistic error iteration cycle.

**Why BR-1235?**: This task intentionally has data that will trigger validation errors, demonstrating:
- Iteration 1: Structural errors (duplicates, length)
- Iteration 2: Content errors (invalid characters)  
- Iteration 3: Success!

---

## 📋 Prerequisites

1. **Services Running**:
   ```bash
   cd mock-services
   docker compose up -d
   docker compose ps  # Both should be "healthy"
   ```

2. **Working Directory**:
   ```bash
   cd demo-workspace
   ```

3. **Have VS Code with GitHub Copilot** (or use helper scripts)

---

## 🚀 Demo Script

### Part 1: List Available Tasks

**Copilot Prompt**: "List all available tasks"

**Expected Output**:
```
✅ Available Tasks:

  BR-1234 - Create Business Rule: Employee Positions [0 ошибок]
  BR-1235 - Create Business Rule: Department Codes [3 ошибки]
  BR-1236 - Create Business Rule: Teacher Certifications [0 ошибок]

Total: 3 tasks

### Task Details:

📋 BR-1234: CO_EmployeePositions (USA)
📋 BR-1235: CO_DepartmentCodes (USA)
📋 BR-1236: CO_TeacherCertifications (USA)
```

**Or via script**:
```bash
./scripts/list-tasks.sh
```

---

### Part 2: Fetch Task with Errors

**Copilot Prompt**: "Fetch task BR-1235"

**What Happens**:
1. Copilot runs: `curl -s http://localhost:3001/api/v1/issues/BR-1235`
2. Parses task details with jq
3. Downloads CSV attachment
4. Shows preview

**Expected Output**:
```
✅ Task Fetched Successfully

📋 Task: BR-1235 - Create Business Rule: Department Codes
📁 Business Rule: CO_DepartmentCodes
🌍 Country: USA
📊 CSV Attachment: departments.csv (6 rows)

### CSV Preview:
RuleCode,Description
ADMIN,Administration
ADMIN,Administrative Services          ← DUPLICATE!
POSITION001,Position Code Manager      ← TOO LONG (11 chars)!
P1,Position Level 1
SPECIAL!,Department (Special!)         ← INVALID CHARS!
HR,Human Resources

⚠️ Potential Issues Detected:
- Duplicate RuleCode: ADMIN (appears 2 times)
- RuleCode too long: POSITION001 (11 characters, max 6)
- Invalid characters: SPECIAL! contains "!"

Next: Generate XML?
```

**Or via script**:
```bash
./scripts/fetch-task.sh BR-1235
# Creates: input-BR-1235.csv, metadata-BR-1235.json
```

---

### Part 3: Generate XML

**Copilot Prompt**: "Generate XML from this data"

**What Happens**:
1. Parses CSV rows
2. Applies business rule name from metadata
3. Creates Transaction for each row
4. Pre-validates structure (notes warnings)

**Expected Output**:
```
✅ XML Generated Successfully

📁 Saved to: output/output-BR-1235.xml
📊 Records: 6 transactions

### Preview:
<?xml version="1.0" encoding="UTF-8"?>
<Import>
  <Transaction>
    <Header>
      <TransactionType>SIMPLERULE</TransactionType>
      <BusinessRule>CO_DepartmentCodes</BusinessRule>
    </Header>
    <SimpleRule>
      <RuleCode>ADMIN</RuleCode>
      <Description>Administration</Description>
      <CountryCode>USA</CountryCode>
    </SimpleRule>
  </Transaction>
  ...
</Import>

⚠️ Pre-validation Warnings:
- Line 8: Duplicate RuleCode detected: ADMIN
- Line 26: RuleCode exceeds 6 characters: POSITION001
- Line 38: Invalid character detected: !

These will likely fail validation. Proceed?
```

**Or via script**:
```bash
./scripts/generate-xml.sh BR-1235
# Creates: output/output-BR-1235.xml
```

---

### Part 4: Validation Attempt 1 - Structural Errors

**Copilot Prompt**: "Validate the XML"

**What Happens**:
1. Reads XML file
2. Calls validation API with curl
3. Parses response
4. Displays errors in structured format

**Expected Output**:
```
🔍 Validating output/output-BR-1235.xml...

❌ Validation Failed

🎯 Attempt: 1
📋 Errors: 2

### Error Details:

| Line | Code | Message | Affected Value |
|------|------|---------|----------------|
| 8 | DUPLICATE_RULE_CODE | Duplicate RuleCode found | ADMIN |
| 26 | RULE_CODE_TOO_LONG | RuleCode exceeds 6 characters | POSITION001 |

### Suggested Fixes:

1. DUPLICATE_RULE_CODE (Line 8):
   - Problem: RuleCode "ADMIN" appears multiple times
   - Fix: Append sequential numbers
   - Example: ADMIN → ADMIN1, ADMIN2

2. RULE_CODE_TOO_LONG (Line 26):
   - Problem: "POSITION001" has 11 characters (max: 6)
   - Fix: Abbreviate to 6 characters or less
   - Example: POSITION001 → POS001

Would you like me to fix these automatically?
```

**Or via script**:
```bash
./scripts/validate-xml.sh BR-1235
# Creates: validation-result-BR-1235-attempt1.json
```

---

### Part 5: Apply Fixes - Iteration 1

**Copilot Prompt**: "Yes, fix them automatically"

**What Happens**:
1. Copilot reads XML file
2. Finds all ADMIN occurrences → changes to ADMIN1, ADMIN2
3. Finds POSITION001 → changes to POS001
4. Saves updated XML
5. Shows diff

**Expected Output**:
```
✅ Fixes Applied

### Changes Made:

1. Fixed Duplicates:
   - ADMIN → ADMIN1 (line 8)
   - ADMIN → ADMIN2 (line 18)

2. Abbreviated Long Codes:
   - POSITION001 → POS001 (line 26)

### Diff:
--- Before
+++ After
@@ -8 @@
-      <RuleCode>ADMIN</RuleCode>
+      <RuleCode>ADMIN1</RuleCode>
@@ -18 @@
-      <RuleCode>ADMIN</RuleCode>
+      <RuleCode>ADMIN2</RuleCode>
@@ -26 @@
-      <RuleCode>POSITION001</RuleCode>
+      <RuleCode>POS001</RuleCode>

📁 Updated: output/output-BR-1235.xml

Validating again...
```

**Manual fix alternative**:
```bash
# Edit XML file
nano output/output-BR-1235.xml

# Change:
#   ADMIN → ADMIN1 (first occurrence)
#   ADMIN → ADMIN2 (second occurrence)
#   POSITION001 → POS001

# Validate again
./scripts/validate-xml.sh BR-1235
```

---

### Part 6: Validation Attempt 2 - Content Errors

**What Happens Automatically**: Copilot re-validates after fixes

**Expected Output**:
```
❌ Validation Failed

🎯 Attempt: 2
📋 Errors: 1
⚠️  Warnings: 1

### Errors:

| Line | Code | Message | Affected Value |
|------|------|---------|----------------|
| 43 | INVALID_CHARACTERS | Description contains invalid characters | Department (Special!) |

### Warnings:

| Line | Code | Message | Affected Value |
|------|------|---------|----------------|
| 33 | RULE_CODE_TOO_SHORT | RuleCode is very short | P1 |

### Analysis:

✅ Fixed from Attempt 1:
- Duplicates resolved
- Long codes abbreviated

❌ New Issue:
- Invalid characters in Description: "Department (Special!)"
- Parentheses and exclamation mark not allowed

⚠️  Warning (non-blocking):
- "P1" is only 2 characters (recommendation: 4-6 chars)
- This won't block import but could be improved

Fix the error? (Warning can be ignored)
```

---

### Part 7: Apply Fixes - Iteration 2

**Copilot Prompt**: "Fix the invalid characters error"

**Expected Output**:
```
✅ Fix Applied

### Change:
- Department (Special!) → Department Special (line 43)

Removed invalid characters: ( ) !

📁 Updated: output/output-BR-1235.xml

Validating again...
```

**Manual fix alternative**:
```bash
# Edit XML
sed -i '' 's/Department (Special!)/Department Special/g' output/output-BR-1235.xml

# Validate
./scripts/validate-xml.sh BR-1235
```

---

### Part 8: Validation Attempt 3 - Success!

**What Happens Automatically**: Copilot re-validates

**Expected Output**:
```
✅ Validation Passed!

🎯 Attempt: 3
📋 Status: Ready to import

All validation checks passed!

### Summary:
✅ 6 records validated
✅ All RuleCodes unique and valid
✅ All Descriptions properly formatted
✅ Country code: USA

Your Business Rule "CO_DepartmentCodes" is ready to deploy!

Next: Import this Business Rule?
```

---

### Part 9: Import to Environment

**Copilot Prompt**: "Yes, import to DEV"

**What Happens**:
1. Confirms with user
2. Calls import API
3. Gets job ID
4. Polls status with progress updates
5. Shows completion

**Expected Output**:
```
🚀 Starting import...

📋 Job ID: job-abc-123
⏳ Status: queued

[11:30:01] Status: running | Progress: [██░░░░░░░░] 10%
[11:30:02] Status: running | Progress: [█████░░░░░] 50%
[11:30:03] Status: running | Progress: [████████░░] 80%
[11:30:04] Status: completed | Progress: [██████████] 100%

✅ Import Completed Successfully!

📊 Records Imported: 6
🕐 Completed At: 2026-02-17 11:30:04
🎯 Environment: DEV

🎉 Business Rule "CO_DepartmentCodes" has been successfully deployed!

### Imported Records:
1. ADMIN1 - Administration
2. ADMIN2 - Administrative Services
3. POS001 - Position Code Manager
4. P1 - Position Level 1
5. SPEC - Department Special
6. HR - Human Resources
```

**Or via script**:
```bash
./scripts/import-xml.sh BR-1235 DEV
# Creates: import-result-BR-1235.json
```

---

## 🎓 Demo Summary

### What We Demonstrated:

1. ✅ **Task Discovery** - Listed available tasks
2. ✅ **Data Fetch** - Retrieved Jira task and CSV
3. ✅ **XML Generation** - Created Business Rule XML
4. ✅ **Iteration Cycle** - Fixed errors through 3 validation attempts:
   - Attempt 1: Structural errors (duplicates, length)
   - Attempt 2: Content errors (invalid characters)
   - Attempt 3: Success!
5. ✅ **Error Analysis** - AI-powered suggestions
6. ✅ **Automated Fixes** - Copilot applied corrections
7. ✅ **Deployment** - Imported to environment with progress tracking

### Key Takeaways:

- **Iteration is normal**: 2-3 attempts expected (mock simulates real behavior)
- **AI assists**: Copilot understands errors and suggests fixes
- **Automation**: Helper scripts available for batch processing
- **Transparency**: All operations use curl (visible, debuggable)
- **Production-ready**: Real APIs would follow same pattern

---

## 🔄 Try Other Tasks

### BR-1234: Clean Data (Immediate Success)
```bash
./scripts/fetch-task.sh BR-1234
./scripts/generate-xml.sh BR-1234
./scripts/validate-xml.sh BR-1234
# ✅ Attempt 1: Success!
./scripts/import-xml.sh BR-1234 DEV
```

### BR-1236: Complex Data (10 records)
```bash
./scripts/fetch-task.sh BR-1236
./scripts/generate-xml.sh BR-1236
./scripts/validate-xml.sh BR-1236
# Similar iteration cycle
./scripts/import-xml.sh BR-1236 DEV
```

---

## 📊 Files Created During Demo

```
demo-workspace/
├── input-BR-1235.csv                           # Downloaded CSV
├── metadata-BR-1235.json                       # Task metadata
├── output/
│   └── output-BR-1235.xml                      # Generated & fixed XML
├── validation-result-BR-1235-attempt1.json     # Validation attempt 1
├── validation-result-BR-1235-attempt2.json     # Validation attempt 2
├── validation-result-BR-1235-attempt3.json     # Validation attempt 3 (success)
└── import-result-BR-1235.json                  # Import confirmation
```

---

**Demo Complete!** 🎉

For questions or issues, see [README.md](README.md) or [Copilot Instructions](.github/copilot-instructions.md).
