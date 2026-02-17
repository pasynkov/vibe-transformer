# Demo Workspace

This is the workspace you open in VS Code to demonstrate the AI-assisted Business Rule workflow.

## 🎯 Purpose

This directory contains everything needed for the L2 specialist (demo presenter) to work with GitHub Copilot to create Business Rules.

---

## 📁 Structure

```
demo-workspace/
├── .github/
│   └── copilot-instructions.md    # Copilot reads this automatically
├── .vscode/
│   ├── settings.json              # API endpoints, workspace config
│   └── extensions.json            # Recommended extensions
├── templates/
│   └── business-rule.xml.template # XML template
├── examples/                      # Few-shot learning examples
│   ├── example-1-simple/
│   ├── example-2-with-errors/
│   └── example-3-complex/
├── output/                        # Generated XML files (gitignored)
└── docs/
    └── workflow-guide.md          # Human-readable workflow
```

---

## 🚀 Quick Start

### Prerequisites

1. **VS Code** installed
2. **GitHub Copilot** subscription active
3. **Mock services running** (see `../mock-services/README.md`)

### Setup

```bash
# 1. Ensure mock services are running
cd ../mock-services
docker-compose up -d

# 2. Open this workspace in VS Code
cd ../demo-workspace
code .
```

### Verify Setup

1. Open VS Code
2. Check bottom-right: "Copilot" should show as active
3. Open Copilot Chat (Ctrl+Shift+I or Cmd+Shift+I)
4. Try: "Hello, are you ready to help with Business Rules?"

---

## 🎬 Demo Workflow

### Step 1: Fetch Jira Task

In Copilot Chat:
```
Fetch Jira task BR-1234
```

Copilot will:
- Call Jira Mock API (http://localhost:3001)
- Retrieve task details and CSV attachment
- Display summary

### Step 2: Generate XML

```
Generate XML from this CSV
```

Copilot will:
- Parse CSV data
- Use template from `templates/business-rule.xml.template`
- Generate complete XML
- Save to `output/BR-1234.xml`

### Step 3: Validate XML

```
Validate this XML with Transformator
```

Copilot will:
- Call Transformator API (http://localhost:3002)
- Submit XML for validation
- Display errors (first attempt will have errors)

### Step 4: Fix Errors

```
Fix these validation errors
```

Copilot will:
- Analyze error messages
- Suggest fixes based on error codes
- Apply fixes automatically (if confirmed)
- Update XML file

### Step 5: Re-validate

```
Validate again
```

Repeat until validation passes (typically 2-3 iterations).

### Step 6: Success!

When validation passes:
```
✅ Validation successful!
Business Rule BR-1234 is ready to import.
```

---

## 📋 Available Examples

### example-1-simple/

**Scenario**: Basic 5-row CSV, no errors expected

**Files**:
- `input.csv` - Simple position codes
- `output.xml` - Expected clean output
- `README.md` - Example description

**Use for**: Testing basic workflow

### example-2-with-errors/

**Scenario**: CSV with duplicate codes and invalid characters

**Files**:
- `input.csv` - Contains duplicates and special chars
- `output-attempt1.xml` - First attempt (has errors)
- `errors-attempt1.json` - Validation errors
- `output-attempt2.xml` - After fixing duplicates
- `errors-attempt2.json` - Remaining errors
- `output-final.xml` - Final success

**Use for**: Demonstrating error fixing iteration

### example-3-complex/

**Scenario**: Larger dataset (15+ rows)

**Use for**: Testing performance and scalability

---

## ⚙️ Configuration

### API Endpoints

Configured in `.vscode/settings.json`:
- Jira Mock API: `http://localhost:3001`
- Transformator Mock API: `http://localhost:3002`

To change:
1. Open `.vscode/settings.json`
2. Update `vibeTransformer.jiraApi.url` and `vibeTransformer.transformatorApi.url`

### Copilot Instructions

Edit `.github/copilot-instructions.md` to:
- Add new patterns
- Update validation rules
- Improve error suggestions
- Add new examples

---

## 🧪 Testing Copilot Instructions

### Test Basic Understanding

```
Q: What is a Business Rule?
Expected: Copilot explains UKG Pro Business Rules

Q: What format should RuleCode be?
Expected: Max 6 chars, alphanumeric + underscore/hyphen
```

### Test Workflow Knowledge

```
Q: How do I fetch a Jira task?
Expected: Copilot provides step-by-step instructions

Q: What should I do if validation fails?
Expected: Copilot explains iteration process
```

### Test Pattern Recognition

```
Q: I have duplicate RuleCodes, what should I do?
Expected: Copilot suggests appending numbers (ADMIN1, ADMIN2)

Q: My RuleCode is too long, how to fix?
Expected: Copilot suggests abbreviation or truncation
```

---

## 📝 Copilot Instructions Overview

Located in `.github/copilot-instructions.md`

**Sections**:
1. **Role** - Defines Copilot's role as Business Rule assistant
2. **Workflow Steps** - 6-step process from fetch to success
3. **Validation Rules** - RuleCode, Description, CountryCode rules
4. **Common Errors** - Error codes with fixes
5. **Step-by-Step Workflow** - Detailed instructions for each step
6. **Examples** - References to example files
7. **Tone and Style** - Communication guidelines

**Key Principles**:
- Pattern-first (show examples before explaining)
- Actionable (provide specific fixes, not generic advice)
- Iterative (expect multiple validation attempts)
- Context-aware (use error.suggestion field)

---

## 🔧 Troubleshooting

### Copilot Not Responding

1. Check Copilot status (bottom-right in VS Code)
2. Reload window: Cmd+Shift+P → "Reload Window"
3. Check Copilot subscription is active

### API Calls Failing

1. Verify mock services are running:
   ```bash
   curl http://localhost:3001/api/health
   curl http://localhost:3002/api/health
   ```

2. Check Docker:
   ```bash
   cd ../mock-services
   docker-compose ps
   ```

3. View logs:
   ```bash
   docker-compose logs -f
   ```

### Copilot Not Using Instructions

1. Check `.github/copilot-instructions.md` exists
2. Reload VS Code window
3. Clear Copilot cache:
   - Cmd+Shift+P → "GitHub Copilot: Sign Out"
   - Sign in again

### XML Generation Issues

1. Check template exists: `templates/business-rule.xml.template`
2. Verify template format is correct
3. Check examples for reference

---

## 📊 Output Files

All generated XML files are saved to `output/` directory.

**Naming convention**: `{Jira-Ticket-ID}.xml`

Example:
- `output/BR-1234.xml`
- `output/BR-1235.xml`

**Note**: `output/` is gitignored. Generated files are temporary and should not be committed.

---

## 🎓 Tips for Demo Presenters

### Preparation

1. **Practice workflow 2-3 times** before demo
2. **Prepare backup**: Pre-generate XMLs in case of issues
3. **Test APIs**: Verify mock services respond quickly
4. **Have examples ready**: Know which example to use for what

### During Demo

1. **Explain context first**: Show the problem (manual process)
2. **Narrate actions**: Explain what you're asking Copilot to do
3. **Show errors**: Don't skip error iterations - that's the value!
4. **Highlight AI help**: Point out when Copilot provides intelligent suggestions
5. **Show time savings**: Compare 20 min manual vs 5 min with AI

### Common Questions

**Q: Can this work with real Jira?**
A: Yes, just change API URLs to real Jira endpoints

**Q: What if Copilot makes mistakes?**
A: The validation loop catches errors - that's why we iterate

**Q: Can this work without Copilot?**
A: Yes, but loses AI assistance - would need manual XML editing

---

## 🔗 Related Documentation

- **Copilot Integration Spec**: `../docs/specs/copilot-integration.md`
- **Project Overview**: `../docs/specs/project-overview.md`
- **Workflow Guide**: `docs/workflow-guide.md`
- **Mock Services**: `../mock-services/README.md`

---

## 📦 VS Code Extension (Phase 2)

If VS Code Extension is installed:

### Commands Available

- `@vibe-transformer fetch <ticket-id>` - Fetch Jira task
- `@vibe-transformer generate` - Generate XML
- `@vibe-transformer validate` - Validate XML
- `@vibe-transformer fix` - Auto-fix errors
- `@vibe-transformer import` - Import Business Rule

### UI Components

- **Error Panel**: Shows validation errors with line numbers
- **Status Bar**: Current task and validation status
- **Quick Fixes**: Code actions for common errors

---

**Status**: Ready for Demo
**Last Updated**: 2026-02-17
