# GitHub Copilot Integration Specification

## Overview

Integration strategy for GitHub Copilot to provide AI-assisted workflow for Business Rule creation.

**Approach**: Hybrid (Copilot Instructions + VS Code Extension)
**Priority**: P0 (Copilot Instructions), P1 (VS Code Extension)

---

## Architecture Decision

### Chosen Approach: Two-Tier Integration

```
Tier 1: GitHub Copilot Instructions (Must Have)
  ├─ .github/copilot-instructions.md
  ├─ templates/business-rule.xml.template
  └─ examples/ (few-shot learning)

Tier 2: VS Code Extension (Nice to Have)
  ├─ Chat Participant: @vibe-transformer
  ├─ API Integration (Jira + Transformator)
  └─ UI Components (error panels, status bar)
```

### Why This Approach?

**Tier 1 Benefits**:
- ✅ Zero setup (automatic for GitHub Copilot users)
- ✅ Works immediately in VS Code, CLI, GitHub.com
- ✅ Version controlled (git tracked)
- ✅ Easy to iterate and improve

**Tier 2 Benefits**:
- ✅ Direct API access (no copy-paste)
- ✅ Custom UI for errors and status
- ✅ Workflow automation
- ✅ Better demo experience

---

## Tier 1: GitHub Copilot Instructions

### File Structure

```
project-root/
├── .github/
│   └── copilot-instructions.md        # Main instructions
├── templates/
│   └── business-rule.xml.template     # XML template with placeholders
├── examples/
│   ├── example-1-simple/
│   │   ├── input.csv
│   │   ├── output.xml
│   │   └── metadata.json
│   ├── example-2-with-errors/
│   │   ├── input.csv
│   │   ├── output-attempt1.xml
│   │   ├── errors-attempt1.json
│   │   ├── output-attempt2.xml
│   │   └── output-final.xml
│   └── example-3-complex/
│       ├── input.csv
│       └── output.xml
└── docs/
    └── workflow-guide.md              # Human-readable workflow
```

### `.github/copilot-instructions.md` Content

```markdown
# VibeTransformer AI Assistant Instructions

You are an AI assistant helping L2 specialists create UKG Pro Business Rules from Jira tasks.

## Your Role

Guide the specialist through this workflow:
1. Fetch Jira task details and CSV attachment
2. Generate XML from CSV using the Business Rule template
3. Validate XML against UKG Pro schema
4. Submit to Transformator for testing
5. Analyze errors and suggest fixes
6. Iterate until validation passes

## Critical Context

### Business Rule XML Structure

Use the template from `templates/business-rule.xml.template`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Import>
  {{#each csvRows}}
  <Transaction>
    <Header>
      <TransactionType>SIMPLERULE</TransactionType>
      <BusinessRule>{{businessRuleName}}</BusinessRule>
    </Header>
    <SimpleRule>
      <RuleCode>{{ruleCode}}</RuleCode>
      <Description>{{description}}</Description>
      <CountryCode>{{countryCode}}</CountryCode>
    </SimpleRule>
  </Transaction>
  {{/each}}
</Import>
```

### Validation Rules

1. **RuleCode**:
   - Max 6 characters
   - Only alphanumeric, underscore, hyphen
   - Must be unique within import
   - Pattern: `^[A-Z0-9_-]{1,6}$`

2. **Description**:
   - Max 255 characters
   - Only alphanumeric, spaces, underscore, hyphen
   - No special characters (!@#$%^&*)
   - Pattern: `^[A-Za-z0-9 _-]{1,255}$`

3. **CountryCode**:
   - ISO 3166-1 alpha-3 (USA, CAN, GBR, etc.)
   - Defaults to USA if not specified

4. **BusinessRule**:
   - Must start with "CO_"
   - No spaces
   - Pattern: `^CO_[A-Za-z0-9_]+$`

### Common Errors and Fixes

#### Error: DUPLICATE_RULE_CODE

**Problem**: Multiple transactions have same RuleCode

**Fix**:
```
Before: ADMIN, ADMIN
After:  ADMIN1, ADMIN2
```

**Suggestion**: Append sequential numbers to duplicates

#### Error: RULE_CODE_TOO_LONG

**Problem**: RuleCode exceeds 6 characters

**Fix**:
```
Before: POSITION001
After:  POS001
```

**Suggestion**: Use abbreviations or truncate intelligently

#### Error: INVALID_CHARACTERS

**Problem**: Special characters in Description

**Fix**:
```
Before: Department (HR)
After:  Department HR
```

**Suggestion**: Remove or replace special characters

#### Error: RULE_CODE_TOO_SHORT

**Problem**: RuleCode is empty or too short

**Suggestion**: Use at least 2 characters, preferably 4-6

### Step-by-Step Workflow

#### Step 1: Fetch Jira Task

When user says "fetch task BR-1234" or similar:

1. Call Jira Mock API: `GET http://localhost:3001/api/v1/issues/BR-1234`
2. Parse response and extract:
   - Business Rule Name
   - Country Code
   - CSV attachment URL
3. Download CSV: `GET http://localhost:3001/api/v1/attachments/{id}`
4. Display summary to user:
   ```
   📋 Task: BR-1234 - Create Business Rule: Employee Positions
   📁 Business Rule: CO_EmployeePositions
   🌍 Country: USA
   📊 CSV: positions.csv (5 rows)
   ```

#### Step 2: Generate XML

When user says "generate XML" or "create XML from CSV":

1. Parse CSV rows
2. Load template from `templates/business-rule.xml.template`
3. For each CSV row, create a Transaction
4. Replace placeholders:
   - `{{businessRuleName}}` → from Jira customFields
   - `{{ruleCode}}` → from CSV RuleCode column
   - `{{description}}` → from CSV Description column
   - `{{countryCode}}` → from Jira customFields (default: USA)
5. Validate against rules before generating:
   - Check for duplicates
   - Check RuleCode length
   - Check for invalid characters
6. Save to `output/{ruleId}.xml`
7. Show preview and ask for confirmation

#### Step 3: Validate XML

When user says "validate" or "test this XML":

1. Read XML file from `output/{ruleId}.xml`
2. Call Transformator API: `POST http://localhost:3002/api/v1/business-rules/validate`
   ```json
   {
     "xml": "<Import>...</Import>",
     "ruleId": "BR-1234",
     "businessRuleName": "CO_EmployeePositions"
   }
   ```
3. Parse response:
   - If `valid: true` → Show success message ✅
   - If `valid: false` → Display errors in structured format

#### Step 4: Analyze Errors

When validation returns errors:

1. Group errors by type (duplicates, length, characters, etc.)
2. For each error:
   - Highlight the XML line
   - Show the error message
   - **Provide specific fix suggestion** from error.suggestion
3. Ask user: "Would you like me to fix these automatically?"

#### Step 5: Fix Errors

If user agrees to auto-fix:

1. Apply fixes based on error codes:
   - `DUPLICATE_RULE_CODE` → Append numbers (ADMIN → ADMIN1, ADMIN2)
   - `RULE_CODE_TOO_LONG` → Truncate or abbreviate
   - `INVALID_CHARACTERS` → Remove or replace
   - `DESCRIPTION_TOO_LONG` → Truncate to 255 chars
2. Update XML file
3. Show diff of changes
4. Go back to Step 3 (validate again)

#### Step 6: Import (Success)

When validation passes:

1. Congratulate user: "✅ Validation passed! Ready to import."
2. Ask: "Would you like to import this Business Rule?"
3. If yes:
   - Call: `POST http://localhost:3002/api/v1/business-rules/import`
   - Get jobId
   - Poll: `GET http://localhost:3002/api/v1/jobs/{jobId}/status`
   - Show progress
4. On completion: "🎉 Business Rule imported successfully!"

### Examples to Learn From

Refer to `examples/` directory for complete examples:
- `example-1-simple`: Basic 5-row CSV, no errors
- `example-2-with-errors`: Shows iteration cycle with fixes
- `example-3-complex`: Larger dataset with multiple error types

### Tone and Style

- Be concise and action-oriented
- Use emojis for visual feedback (✅ ❌ ⚠️ 📋 📁)
- Show structured output (tables, lists, code blocks)
- Always explain what you're doing before calling APIs
- Confirm destructive actions (overwriting files)

### API Endpoints Reference

**Jira Mock API** (http://localhost:3001):
- `GET /api/v1/issues/:ticketId` - Get issue details
- `GET /api/v1/issues/:ticketId/attachments` - List attachments
- `GET /api/v1/attachments/:attachmentId` - Download attachment

**Transformator Mock API** (http://localhost:3002):
- `POST /api/v1/business-rules/validate` - Validate XML
- `POST /api/v1/business-rules/import` - Import Business Rule
- `GET /api/v1/jobs/:jobId/status` - Get import job status

### Error Handling

If API calls fail:
1. Show clear error message
2. Suggest troubleshooting:
   - Check if microservices are running: `docker-compose ps`
   - Verify URLs are correct
   - Check network connectivity
3. Provide fallback options (manual steps)

### Learning Mode

Pay attention to:
- Error patterns that occur frequently
- User preferences for fixing errors
- Successful XML patterns
- Use this to improve suggestions over time

---

Remember: Your goal is to make the specialist's job **faster, easier, and more reliable**. Guide them step-by-step and provide intelligent automation where possible.
```

---

## Tier 2: VS Code Extension

### Extension Architecture

```
vibe-transformer-extension/
├── package.json
├── src/
│   ├── extension.ts                    # Entry point
│   ├── chat-participant.ts             # Copilot Chat integration
│   ├── commands/
│   │   ├── fetch-task.ts
│   │   ├── generate-xml.ts
│   │   ├── validate-xml.ts
│   │   └── fix-errors.ts
│   ├── api/
│   │   ├── jira-client.ts
│   │   └── transformator-client.ts
│   ├── ui/
│   │   ├── error-panel.ts
│   │   ├── status-bar.ts
│   │   └── progress-indicator.ts
│   ├── validation/
│   │   ├── xml-validator.ts
│   │   └── error-analyzer.ts
│   └── templates/
│       └── xml-generator.ts
└── resources/
    └── icons/
```

### Extension Manifest (`package.json`)

```json
{
  "name": "vibe-transformer",
  "displayName": "VibeTransformer - Business Rule Assistant",
  "description": "AI-powered assistant for UKG Pro Business Rule creation",
  "version": "0.1.0",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": ["AI", "Other"],
  "activationEvents": [
    "onStartupFinished"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "chatParticipants": [
      {
        "id": "vibe-transformer",
        "name": "VibeTransformer",
        "description": "Business Rule creation assistant",
        "isSticky": true,
        "commands": [
          {
            "name": "fetch",
            "description": "Fetch Jira task and CSV"
          },
          {
            "name": "generate",
            "description": "Generate XML from CSV"
          },
          {
            "name": "validate",
            "description": "Validate XML with Transformator"
          },
          {
            "name": "fix",
            "description": "Fix validation errors"
          },
          {
            "name": "import",
            "description": "Import Business Rule"
          }
        ]
      }
    ],
    "commands": [
      {
        "command": "vibe.fetchTask",
        "title": "Fetch Jira Task",
        "category": "VibeTransformer"
      },
      {
        "command": "vibe.generateXml",
        "title": "Generate XML from CSV",
        "category": "VibeTransformer"
      },
      {
        "command": "vibe.validateXml",
        "title": "Validate XML",
        "category": "VibeTransformer"
      }
    ],
    "configuration": {
      "title": "VibeTransformer",
      "properties": {
        "vibeTransformer.jiraApi.url": {
          "type": "string",
          "default": "http://localhost:3001",
          "description": "Jira Mock API URL"
        },
        "vibeTransformer.transformatorApi.url": {
          "type": "string",
          "default": "http://localhost:3002",
          "description": "Transformator Mock API URL"
        },
        "vibeTransformer.autoFix": {
          "type": "boolean",
          "default": true,
          "description": "Automatically fix errors when possible"
        }
      }
    }
  },
  "dependencies": {
    "@vscode/chat-extension-utils": "^0.1.0",
    "axios": "^1.6.0",
    "xml2js": "^0.6.0"
  }
}
```

### Chat Participant Implementation

```typescript
// src/chat-participant.ts
import * as vscode from 'vscode';

export function registerChatParticipant(context: vscode.ExtensionContext) {
  const handler: vscode.ChatRequestHandler = async (
    request: vscode.ChatRequest,
    chatContext: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
  ) => {
    // Parse command
    const command = request.command || 'help';

    switch (command) {
      case 'fetch':
        return await handleFetch(request, stream, token);
      case 'generate':
        return await handleGenerate(request, stream, token);
      case 'validate':
        return await handleValidate(request, stream, token);
      case 'fix':
        return await handleFix(request, stream, token);
      case 'import':
        return await handleImport(request, stream, token);
      default:
        return await handleHelp(stream);
    }
  };

  const participant = vscode.chat.createChatParticipant(
    'vibe-transformer',
    handler
  );

  participant.iconPath = vscode.Uri.joinPath(
    context.extensionUri,
    'resources',
    'icon.png'
  );

  context.subscriptions.push(participant);
}

async function handleFetch(
  request: vscode.ChatRequest,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<void> {
  // Extract ticket ID from request
  const ticketId = extractTicketId(request.prompt);

  if (!ticketId) {
    stream.markdown('❌ Please provide a ticket ID. Example: `@vibe-transformer fetch BR-1234`');
    return;
  }

  stream.progress('Fetching Jira task...');

  try {
    // Call Jira API
    const issue = await jiraClient.getIssue(ticketId);

    // Download CSV
    const csv = await jiraClient.downloadAttachment(issue.attachments[0].id);

    // Store in workspace state
    await storeTaskData(ticketId, issue, csv);

    // Stream response
    stream.markdown(`## ✅ Task Fetched: ${issue.key}\n\n`);
    stream.markdown(`**Summary**: ${issue.summary}\n`);
    stream.markdown(`**Business Rule**: ${issue.customFields.businessRuleName}\n`);
    stream.markdown(`**Country**: ${issue.customFields.countryCode}\n\n`);

    // Show CSV preview
    stream.markdown('### 📊 CSV Data Preview\n\n');
    stream.markdown('```csv\n' + csv.substring(0, 200) + '\n...\n```\n\n');

    stream.button({
      command: 'vibe.generateXml',
      title: 'Generate XML',
      arguments: [ticketId]
    });
  } catch (error) {
    stream.markdown(`❌ Error fetching task: ${error.message}`);
  }
}

async function handleGenerate(
  request: vscode.ChatRequest,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<void> {
  stream.progress('Generating XML...');

  try {
    // Get stored task data
    const taskData = await getStoredTaskData();

    // Generate XML
    const xml = await generateXml(taskData.csv, taskData.issue);

    // Save to file
    const xmlPath = await saveXmlFile(taskData.issue.key, xml);

    stream.markdown(`## ✅ XML Generated\n\n`);
    stream.markdown(`Saved to: \`${xmlPath}\`\n\n`);

    // Show preview
    stream.markdown('### Preview\n\n');
    stream.markdown('```xml\n' + xml.substring(0, 500) + '\n...\n```\n\n');

    stream.button({
      command: 'vibe.validateXml',
      title: 'Validate XML',
      arguments: [xmlPath]
    });
  } catch (error) {
    stream.markdown(`❌ Error generating XML: ${error.message}`);
  }
}

async function handleValidate(
  request: vscode.ChatRequest,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken
): Promise<void> {
  stream.progress('Validating XML...');

  try {
    const xmlPath = await getActiveXmlFile();
    const xml = await readXmlFile(xmlPath);
    const taskData = await getStoredTaskData();

    // Call Transformator API
    const result = await transformatorClient.validate({
      xml,
      ruleId: taskData.issue.key,
      businessRuleName: taskData.issue.customFields.businessRuleName
    });

    if (result.valid) {
      stream.markdown(`## ✅ Validation Passed!\n\n`);
      stream.markdown(`Attempt: ${result.attemptNumber}\n\n`);
      stream.button({
        command: 'vibe.importBusinessRule',
        title: 'Import Business Rule'
      });
    } else {
      stream.markdown(`## ❌ Validation Failed\n\n`);
      stream.markdown(`Attempt: ${result.attemptNumber}\n\n`);

      // Show errors in table
      stream.markdown('### Errors\n\n');
      stream.markdown('| Line | Code | Message |\n');
      stream.markdown('|------|------|--------|\n');

      result.errors.forEach(error => {
        stream.markdown(
          `| ${error.line} | ${error.code} | ${error.message} |\n`
        );
      });

      stream.markdown('\n\n');
      stream.button({
        command: 'vibe.fixErrors',
        title: 'Fix Errors Automatically'
      });

      // Show in Problems panel
      showErrorsInProblems(xmlPath, result.errors);
    }
  } catch (error) {
    stream.markdown(`❌ Error validating: ${error.message}`);
  }
}
```

### API Clients

```typescript
// src/api/jira-client.ts
export class JiraClient {
  constructor(private baseUrl: string) {}

  async getIssue(ticketId: string): Promise<JiraIssue> {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/issues/${ticketId}`
    );
    return response.data;
  }

  async downloadAttachment(attachmentId: string): Promise<string> {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/attachments/${attachmentId}`,
      { responseType: 'text' }
    );
    return response.data;
  }
}

// src/api/transformator-client.ts
export class TransformatorClient {
  constructor(private baseUrl: string) {}

  async validate(request: ValidateRequest): Promise<ValidationResult> {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/business-rules/validate`,
      request
    );
    return response.data;
  }

  async import(request: ImportRequest): Promise<ImportResponse> {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/business-rules/import`,
      request
    );
    return response.data;
  }

  async getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/jobs/${jobId}/status`
    );
    return response.data;
  }
}
```

---

## Testing Strategy

### Test Copilot Instructions

1. Open project in VS Code with GitHub Copilot
2. Test each workflow step:
   - "Fetch task BR-1234"
   - "Generate XML from this CSV"
   - "Validate this XML"
   - "Fix the validation errors"
3. Verify Copilot uses context from instructions
4. Check quality of generated code/suggestions

### Test VS Code Extension

1. Install extension in debug mode (`F5`)
2. Test chat commands:
   - `@vibe-transformer fetch BR-1234`
   - `@vibe-transformer generate`
   - `@vibe-transformer validate`
3. Verify API calls work
4. Check UI components render correctly

---

## Deliverables

### Phase 1: Copilot Instructions (P0)
- [ ] `.github/copilot-instructions.md` (comprehensive)
- [ ] `templates/business-rule.xml.template`
- [ ] `examples/` directory with 3 examples
- [ ] `docs/workflow-guide.md` for humans

### Phase 2: VS Code Extension (P1)
- [ ] Extension scaffold with chat participant
- [ ] Commands: fetch, generate, validate, fix
- [ ] API clients (Jira + Transformator)
- [ ] Error panel UI
- [ ] Configuration settings

---

**Status**: Ready for Implementation
**Estimated Effort**:
- Tier 1: 1-2 days
- Tier 2: 3-4 days
**Priority**: P0 (Tier 1), P1 (Tier 2)
