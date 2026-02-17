# Example 2: Business Rule with Errors (Iteration Demo)

**Complexity**: Medium
**Expected Result**: Success after 3 iterations
**Use Case**: Demonstrate AI-assisted error fixing

---

## Scenario

Create Business Rule for department codes with problematic data:
- **Duplicate codes** (ADMIN appears twice)
- **Code too long** (POSITION001 > 6 chars)
- **Special characters** (SPECIAL! has invalid char)
- **Short code** (P1 is too short - warning only)

This example demonstrates the full iteration cycle with Copilot assistance.

---

## Files

- **jira-task.json** - Jira API response for task BR-1235
- **input.csv** - CSV with errors (duplicates, invalid chars, etc.)
- **output-attempt1.xml** - First attempt (naive generation)
- **errors-attempt1.json** - Validation errors from attempt 1
- **output-attempt2.xml** - After fixing duplicates and length
- **errors-attempt2.json** - Validation errors from attempt 2
- **output-final.xml** - Final success after fixing all issues

---

## Demo Flow

### Iteration 1: Structural Errors

1. Use Copilot to generate XML from CSV
2. Submit to Transformator → **Validation fails**
3. Errors returned:
   - `DUPLICATE_RULE_CODE`: ADMIN appears twice
   - `RULE_CODE_TOO_LONG`: POSITION001 exceeds 6 characters

**Time**: ~2 minutes

### Iteration 2: Content Errors

1. Ask Copilot: "Fix these validation errors"
2. Copilot suggests:
   - ADMIN → ADMIN1, ADMIN2
   - POSITION001 → POS001
3. Apply fixes, regenerate XML
4. Submit to Transformator → **Validation fails again**
5. Errors returned:
   - `INVALID_CHARACTERS`: SPECIAL! contains '!'

**Time**: ~2 minutes

### Iteration 3: Success

1. Ask Copilot: "Fix the special character error"
2. Copilot suggests:
   - SPECIAL! → SPECIAL
3. Apply fix, regenerate XML
4. Submit to Transformator → **Success!** ✅
5. Warnings (non-blocking):
   - `SHORT_RULE_CODE`: P1 is only 2 characters (warning)

**Time**: ~1 minute

**Total Time**: ~5 minutes (vs 20+ minutes manual)

---

## Key Learnings Demonstrated

1. **Iteration is normal** - Even with AI, multiple attempts expected
2. **AI provides context** - Copilot suggests specific fixes, not generic advice
3. **Progressive refinement** - Each iteration catches different error types
4. **Warnings vs Errors** - System distinguishes blocking errors from warnings

---

## Expected Outcome

✅ Validation passes on 3rd attempt
✅ 6 records imported (ADMIN split to ADMIN1/ADMIN2)
✅ Demonstrates full value of AI assistance
✅ Shows 75% time savings despite iterations
