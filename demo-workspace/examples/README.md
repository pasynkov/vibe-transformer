# Demo Examples

This directory contains pre-prepared examples for demonstrating the AI-assisted Business Rule workflow.

---

## 📂 Available Examples

### Example 1: Simple Business Rule ✅

**Path**: `example-1-simple/`

**Scenario**: Clean data, no errors
- 5 employee position codes
- All valid (no duplicates, proper length, no special chars)
- Passes validation on first attempt

**Use for**:
- Quick success demo
- Showing happy path
- Testing basic workflow

**Duration**: ~3 minutes

---

### Example 2: Business Rule with Errors 🔄

**Path**: `example-2-with-errors/`

**Scenario**: Problematic data requiring 3 iterations
- 6 department codes with issues:
  - Duplicate codes (ADMIN appears twice)
  - Too-long code (POSITION001 > 6 chars)
  - Invalid characters (SPECIAL! has '!')
  - Short code (P1 - warning only)

**Iterations**:
1. **Attempt 1** → Duplicate + length errors
2. **Attempt 2** → Special character error
3. **Attempt 3** → Success! ✅

**Use for**:
- **Main demo** - shows full value of AI assistance
- Demonstrating error fixing cycle
- Showing Copilot's intelligent suggestions
- Proving 75% time savings despite iterations

**Duration**: ~5 minutes (vs 20+ manual)

---

### Example 3: Complex Business Rule 📊

**Path**: `example-3-complex/`

**Scenario**: Large dataset (15 records)
- 15 teacher certification codes
- Clean data (no errors)
- Demonstrates scalability

**Use for**:
- Showing scalability
- Performance with larger datasets
- Proving workflow doesn't slow down with more records

**Duration**: ~4 minutes (same as 5 records!)

---

## 🎬 Demo Recommendations

### For 10-Minute Demo

**Use Example 2** (with errors) - it tells the best story:
1. Show the problem (manual process)
2. Generate XML with Copilot
3. Hit errors → Copilot analyzes
4. Fix errors → Re-validate
5. Iterate 2-3 times → Success!
6. Highlight time savings: 5 min vs 20+ min

### For 5-Minute Demo

**Use Example 1** (simple) - quick success:
1. Show task and CSV
2. Generate XML with Copilot
3. Validate → Success ✅
4. Done in 3 minutes!

### For Technical Deep Dive

**Use all 3 in sequence**:
1. Example 1 - Basic workflow
2. Example 2 - Error handling
3. Example 3 - Scalability

Total: ~15 minutes

---

## 📋 File Structure (Each Example)

```
example-X/
├── README.md              # Scenario description
├── jira-task.json        # Simulated Jira API response
├── input.csv             # Input CSV data
└── output*.xml           # Expected/generated XML
    ├── output.xml             # (Example 1 & 3)
    ├── output-attempt1.xml    # (Example 2 only)
    ├── errors-attempt1.json   # (Example 2 only)
    ├── output-attempt2.xml    # (Example 2 only)
    ├── errors-attempt2.json   # (Example 2 only)
    └── output-final.xml       # (Example 2 only)
```

---

## 🎯 Usage in Demo

### Step 1: Show the Example

```bash
# Open example directory
cd demo-workspace/examples/example-2-with-errors

# Show jira-task.json (the task)
cat jira-task.json | jq

# Show input.csv (the data)
cat input.csv
```

### Step 2: Use with Copilot

In VS Code Copilot Chat:

```
I have a Jira task BR-1235 for creating a Business Rule.
The CSV data is in example-2-with-errors/input.csv.
Please generate the XML for this Business Rule.
```

### Step 3: Validate

```
Validate the generated XML against Transformator API.
```

### Step 4: Fix Errors (if any)

```
Fix the validation errors and regenerate the XML.
```

---

## 🧪 Testing Examples

### Verify Example Data

```bash
# Check all examples exist
ls -la example-*/

# Verify CSV files
for ex in example-*; do
  echo "=== $ex ==="
  wc -l $ex/input.csv
done

# Validate XML structure
for ex in example-*/output*.xml; do
  xmllint --noout $ex && echo "$ex: OK"
done
```

### Mock API Compatibility

All `jira-task.json` files match the format expected by Jira Mock API.

All `errors-*.json` files match the format returned by Transformator Mock API.

---

## 📝 Customizing Examples

### Adding a New Example

1. **Create directory**:
   ```bash
   mkdir example-4-custom
   cd example-4-custom
   ```

2. **Create files**:
   - `README.md` - Describe scenario
   - `jira-task.json` - Task details
   - `input.csv` - Your data
   - `output.xml` - Expected result

3. **Follow naming convention**:
   - `example-N-description/`
   - Use descriptive names (simple, complex, with-errors, etc.)

4. **Update this README**:
   - Add entry to Available Examples section

---

## 💡 Tips for Demo Presenters

### Before Demo

- ✅ Review all examples
- ✅ Practice the workflow 2-3 times
- ✅ Know which example to use for time available
- ✅ Have backup: pre-generate XMLs just in case

### During Demo

- 📖 **Narrate**: Explain what you're asking Copilot
- 🎯 **Show errors**: Don't skip - that's where AI shines!
- ⏱️ **Highlight speed**: "This would take 20 minutes manually"
- 🤖 **Point out AI**: "Notice Copilot suggested specific fixes"

### Common Questions

**Q: What if Copilot doesn't generate correctly?**
- Show the pre-generated output.xml files
- Explain "this is what it should generate"

**Q: Are these real production data?**
- No, these are sanitized demo examples
- Real production would use actual Jira and Transformator APIs

**Q: Can we add more examples?**
- Yes! Follow "Customizing Examples" section above

---

## 🔗 Related Files

- **Copilot Instructions**: `../.github/copilot-instructions.md`
- **XML Template**: `../templates/business-rule.xml.template`
- **Demo Workspace Guide**: `../README.md`
- **Mock Services**: `../../mock-services/README.md`

---

**Last Updated**: 2026-02-17
**Examples Count**: 3
**Total Demo Time**: 3-15 minutes (depending on selection)
