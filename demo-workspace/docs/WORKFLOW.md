# VibeTransformer Workflow Automation Guide

Complete guide to the Business Rule creation workflow using GitHub Copilot and bash scripts.

## 🎯 Overview

The workflow has 6 steps:
1. **Fetch** - Get Jira task and CSV data
2. **Generate** - Create XML from CSV
3. **Validate** - Test against schema
4. **Analyze** - Review errors
5. **Fix** - Correct issues
6. **Import** - Deploy to Transformator

## 🤖 Using GitHub Copilot

### Interactive Mode (Recommended)

Open VS Code in `demo-workspace` and use Copilot Chat:

```
User: "Fetch task BR-1234"
Copilot: [Runs curl commands, downloads CSV, shows preview]

User: "Generate XML from this data"
Copilot: [Creates XML file, shows preview, notes any potential issues]

User: "Validate the XML"
Copilot: [Calls validation API, analyzes errors, suggests fixes]

User: "Fix the errors automatically"
Copilot: [Applies fixes, regenerates XML, validates again]

User: "Import to DEV"
Copilot: [Starts import, polls status, shows completion]
```

### Key Phrases

- **Fetch**: "Fetch task BR-1234", "Get issue BR-1235"
- **Generate**: "Generate XML", "Create Business Rule XML"
- **Validate**: "Validate the XML", "Check for errors"
- **Fix**: "Fix errors automatically", "Apply suggested fixes"
- **Import**: "Import to DEV", "Deploy this Business Rule"

---

For complete instructions and examples, see the [main README](../README.md) and [Copilot Instructions](../.github/copilot-instructions.md).
