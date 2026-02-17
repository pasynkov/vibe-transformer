# Phase 2: Copilot Integration

**Duration**: 2 days (3 iterations)
**Status**: ⏳ Not Started (0/3 done)
**Goal**: Create GitHub Copilot integration with instructions and templates

---

## Iterations

### Iteration 2.1: Copilot Instructions ⏳

**Status**: `pending`
**Duration**: 1 day
**Goal**: Create comprehensive `.github/copilot-instructions.md` with all patterns

**Deliverables**:
- [ ] `demo-workspace/.github/copilot-instructions.md` - Main instructions
- [ ] Complete workflow documentation (6 steps)
- [ ] Validation rules (RuleCode, Description, etc.)
- [ ] Common errors with fix patterns
- [ ] API endpoint documentation
- [ ] Examples references

**Success Criteria**:
```bash
# Open VS Code
cd demo-workspace
code .

# In Copilot Chat, test understanding:
1. "What is a Business Rule?"
2. "How do I validate a Business Rule?"
3. "What are the RuleCode requirements?"
4. "How do I fix DUPLICATE_RULE_CODE error?"

# Expected: Copilot uses context from instructions
```

**Testing Checklist**:
- [ ] Copilot understands Business Rule concept
- [ ] Copilot knows validation rules
- [ ] Copilot provides fix suggestions for errors
- [ ] Copilot references examples correctly
- [ ] Instructions are well-structured and clear

**Blocked By**: Iteration 1.8

---

### Iteration 2.2: XML Templates ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Create XML generation template with placeholders

**Deliverables**:
- [ ] `demo-workspace/templates/business-rule.xml.template` - Template file
- [ ] Template documentation in comments
- [ ] Placeholder format defined

**Success Criteria**:
```bash
# Verify template exists and is valid XML structure
xmllint --noout demo-workspace/templates/business-rule.xml.template

# In Copilot Chat:
"Generate XML for BR-1234 using the template"

# Expected: Copilot uses template to generate XML
```

**Testing Checklist**:
- [ ] Template has valid XML structure
- [ ] Placeholders clearly marked
- [ ] Comments explain each section
- [ ] Copilot successfully uses template

**Blocked By**: Iteration 2.1

---

### Iteration 2.3: Integration Test - Full Workflow ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Test complete workflow from fetch to validation success

**Deliverables**:
- [ ] Test script: `demo-workspace/test-workflow.sh`
- [ ] Documentation: Test results

**Success Criteria**:
```bash
# Manual test of full workflow
cd demo-workspace
code .

# In Copilot Chat:
1. "Read example-2-with-errors/jira-task.json and input.csv"
2. "Generate XML for this Business Rule"
3. "Validate against http://localhost:3002/api/v1/business-rules/validate"
4. "Analyze errors and suggest fixes"
5. "Fix errors and regenerate XML"
6. "Validate again"
7. "Repeat until success"

# Expected: Complete 3-iteration cycle successfully
```

**Testing Checklist**:
- [ ] Copilot reads Jira task correctly
- [ ] XML generation works
- [ ] Validation API call succeeds
- [ ] Error analysis provides useful suggestions
- [ ] Fixes are applied correctly
- [ ] Iteration cycle completes (3 attempts)
- [ ] Final XML validates successfully

**Blocked By**: Iteration 2.2

---

## Phase 2 Progress

```
Iteration 2.1: ⬜ Copilot Instructions
Iteration 2.2: ⬜ XML Templates
Iteration 2.3: ⬜ Integration Test - Full Workflow

Progress: 0/3 (0%)
```

---

**Prerequisites**: Phase 1 must be complete
**Next**: After Phase 2, decide whether to continue with Phase 3 (VS Code Extension) or skip to Phase 4
