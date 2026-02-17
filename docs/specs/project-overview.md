# VibeTransformer 2.0 - AI-Powered L2 Specialist Workspace

## Overview

**VibeTransformer 2.0** is a demonstration AI adoption solution that automates the workflow of L2 specialists who create and test Business Rules for UKG Pro systems. The solution uses GitHub Copilot integration to guide specialists through the process of converting Jira tasks (with CSV data) into XML files, testing them through Transformator API, and iterating based on error feedback.

**Target Audience**: L2 Support Specialists working with UKG Pro Business Rules
**Technology Stack**: NestJS microservices + VS Code + GitHub Copilot
**Demo Purpose**: Showcase AI adoption for routine data transformation tasks

## Business Problem

### Current Manual Process

1. Specialist receives Jira ticket with:
   - Business Rule description
   - CSV file with RuleCode and Description columns

2. Specialist must:
   - Understand Business Rule requirements
   - Convert CSV data to UKG Pro XML format
   - Manually construct XML with proper structure
   - Upload to Transformator system
   - Wait for test results
   - Fix errors and repeat (multiple iterations possible)

3. **Pain Points**:
   - Manual XML construction is error-prone
   - XML structure is complex and hard to remember
   - Iteration cycles are time-consuming
   - No guidance during error resolution

### Proposed AI-Assisted Solution

Use GitHub Copilot + custom tooling to:
- Automatically fetch task details from Jira
- Generate XML from CSV using AI-guided templates
- Validate XML structure before submission
- Submit to Transformator API
- Parse error responses and suggest fixes
- Guide through iteration cycles

## Solution Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────┐
│                     VS Code IDE                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │  GitHub Copilot + Custom Instructions             │ │
│  │  - Context: .github/copilot-instructions.md       │ │
│  │  - Templates: XML generation patterns             │ │
│  │  - Workflow: Step-by-step guidance                │ │
│  └───────────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────────┐ │
│  │  VS Code Extension (Optional)                     │ │
│  │  - Chat Participant: @vibe-transformer            │ │
│  │  - Commands: Fetch, Generate, Test, Fix          │ │
│  │  - UI: Status panel, error highlighting          │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
        ┌───────▼───────┐     ┌──────▼──────┐
        │ Jira Mock API │     │ Transformator│
        │  (NestJS)     │     │  Mock API    │
        │               │     │  (NestJS)    │
        └───────────────┘     └──────────────┘
```

### Component Details

#### 1. GitHub Copilot Integration

**Type**: Custom Instructions + Context Files

**Files**:
- `.github/copilot-instructions.md` - Main instructions for Copilot
- `templates/business-rule.xml.template` - XML template with placeholders
- `examples/` - Example CSV and XML pairs for few-shot learning

**Capabilities**:
- Guide specialist through workflow steps
- Generate XML from CSV data
- Suggest fixes based on Transformator errors
- Validate XML structure

#### 2. VS Code Extension (Optional Enhancement)

**Type**: VS Code Extension with Copilot Chat Participant

**Features**:
- `@vibe-transformer fetch <ticket-id>` - Fetch Jira task
- `@vibe-transformer generate` - Generate XML from CSV
- `@vibe-transformer test` - Submit to Transformator
- `@vibe-transformer fix` - Analyze errors and suggest fixes

**Implementation**: TypeScript VS Code Extension API

#### 3. Jira Mock API (Microservice)

**Technology**: NestJS REST API

**Endpoints**:
```
GET /api/v1/issues/:ticketId
  - Returns: Jira issue with Business Rule description

GET /api/v1/issues/:ticketId/attachments
  - Returns: List of attachments (CSV files)

GET /api/v1/attachments/:attachmentId
  - Returns: CSV file content
```

**Data Storage**: In-memory with pre-seeded demo tasks

#### 4. Transformator Mock API (Microservice)

**Technology**: NestJS REST API

**Endpoints**:
```
POST /api/v1/business-rules/validate
  - Body: { xml: string, ruleId: string }
  - Returns: Validation results (success/errors)

POST /api/v1/business-rules/import
  - Body: { xml: string, ruleId: string }
  - Returns: Import job ID

GET /api/v1/jobs/:jobId/status
  - Returns: Job status with errors (if any)
```

**Behavior**:
- First attempt: Returns validation errors (simulate failure)
- Second attempt: Returns different errors
- Third attempt: Success (simulate iteration cycle)

## Data Models

### Jira Task Structure

```typescript
interface JiraIssue {
  id: string;
  key: string;              // e.g., "BR-1234"
  summary: string;          // "Create Business Rule: Employee Positions"
  description: string;      // Markdown with requirements
  attachments: Attachment[];
  customFields: {
    businessRuleName: string;    // e.g., "CO_EmployeePositions"
    countryCode: string;          // e.g., "USA"
    transactionType: string;      // Always "SIMPLERULE"
  };
}

interface Attachment {
  id: string;
  filename: string;         // e.g., "positions.csv"
  mimeType: string;
  size: number;
  downloadUrl: string;
}
```

### CSV Structure

```csv
RuleCode,Description
BHS1,Behavior Intervention Specialist 1
BHS2,Behavior Intervention Specialist 2
COUNS,School Counselor
PSYCH,School Psychologist
```

### XML Structure (UKG Pro Business Rule Import)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Import>
  <Transaction>
    <Header>
      <TransactionType>SIMPLERULE</TransactionType>
      <BusinessRule>CO_EmployeePositions</BusinessRule>
    </Header>
    <SimpleRule>
      <RuleCode>BHS1</RuleCode>
      <Description>Behavior Intervention Specialist 1</Description>
      <CountryCode>USA</CountryCode>
    </SimpleRule>
  </Transaction>
  <Transaction>
    <!-- Additional transactions for each CSV row -->
  </Transaction>
</Import>
```

### Transformator Error Response

```typescript
interface ValidationResult {
  success: boolean;
  jobId?: string;
  errors?: ValidationError[];
}

interface ValidationError {
  line: number;              // XML line number
  code: string;              // Error code (e.g., "DUPLICATE_RULE_CODE")
  message: string;           // Human-readable error
  severity: 'error' | 'warning';
  suggestion?: string;       // AI-friendly fix suggestion
}
```

## Workflow

### Phase 1: Task Fetching

1. Specialist opens VS Code
2. Uses Copilot Chat: "Fetch Jira task BR-1234"
3. Copilot/Extension calls Jira Mock API
4. Downloads CSV attachment
5. Displays task summary and CSV preview

### Phase 2: XML Generation

1. Specialist: "Generate XML from this CSV"
2. Copilot uses:
   - XML template from `templates/`
   - CSV data
   - Business Rule metadata from Jira
3. Generates complete XML file
4. Saves to workspace: `output/BR-1234.xml`

### Phase 3: Validation & Testing

1. Specialist: "Test this XML"
2. Extension submits to Transformator API
3. Transformator returns validation errors (first iteration)
4. Errors displayed in VS Code Problems panel

### Phase 4: Error Resolution (Iteration)

1. Specialist: "Fix the validation errors"
2. Copilot analyzes errors:
   - Duplicate RuleCode → Suggests unique codes
   - Invalid characters → Suggests sanitization
   - Missing fields → Suggests default values
3. Specialist accepts suggestions
4. Re-submit for testing
5. Repeat until success

### Phase 5: Success

1. Transformator returns success response
2. Specialist marks Jira task as complete
3. XML file archived in repository

## Demo Scenario

### Pre-requisites

1. Docker Compose running both microservices
2. VS Code with GitHub Copilot installed
3. Copilot Instructions configured
4. (Optional) VS Code Extension installed

### Demo Script

**Step 1**: Show the problem
- Open Jira Mock UI (simple web interface)
- Show task "BR-1234" with CSV attachment
- Explain manual process pain points

**Step 2**: AI-assisted workflow
- Open VS Code
- Use Copilot to fetch task: `@vibe-transformer fetch BR-1234`
- Copilot displays task details and CSV

**Step 3**: Generate XML
- Ask Copilot: "Generate XML for this Business Rule"
- Show generated XML file
- Highlight how Copilot used template + CSV data

**Step 4**: First test attempt
- Run: `@vibe-transformer test`
- Show validation errors from Transformator
- Demonstrate error highlighting

**Step 5**: Fix errors with AI
- Ask Copilot: "Fix these validation errors"
- Show suggested changes
- Apply fixes

**Step 6**: Second test attempt
- Run test again
- Show different errors (simulate iteration)
- Fix with Copilot guidance

**Step 7**: Success
- Third test passes
- Show success message
- Mark task complete

**Duration**: 10-15 minutes

## Technical Implementation Notes

### GitHub Copilot Instructions Structure

```markdown
# VibeTransformer Workflow Guide

## Role
You are assisting an L2 specialist with UKG Pro Business Rule creation.

## Workflow Steps
1. Fetch Jira task details
2. Parse CSV attachment
3. Generate XML using template
4. Validate against schema
5. Submit to Transformator
6. Analyze errors and suggest fixes

## XML Generation Rules
- Use SIMPLERULE transaction type
- Prefix BusinessRule name with CO_
- RuleCode max 6 characters
- Description max 255 characters
- CountryCode defaults to USA

## Error Resolution Patterns
[Examples of common errors and fixes]
```

### VS Code Extension Architecture

```typescript
// extension.ts
export function activate(context: vscode.ExtensionContext) {
  // Register chat participant
  const participant = vscode.chat.createChatParticipant(
    'vibe-transformer',
    handler
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('vibe.fetch', fetchJiraTask),
    vscode.commands.registerCommand('vibe.generate', generateXml),
    vscode.commands.registerCommand('vibe.test', testXml)
  );
}
```

### Microservices Tech Stack

**Common**:
- NestJS 10.x
- TypeScript
- Swagger/OpenAPI docs
- Docker + Docker Compose

**Jira Mock**:
- In-memory storage
- Pre-seeded demo tasks
- CSV parsing library

**Transformator Mock**:
- XML validation (xsd schema)
- Simulated error generation
- State machine for iteration testing

## Success Metrics

### Demo Success Criteria

- [ ] All microservices run with `docker-compose up`
- [ ] Copilot successfully fetches Jira task
- [ ] XML generation completes in <30 seconds
- [ ] Validation errors are clear and actionable
- [ ] Error fixing workflow is smooth (2-3 iterations)
- [ ] Total workflow time: <5 minutes (vs 20+ minutes manual)

### AI Adoption Benefits

1. **Time Savings**: 75% reduction in XML creation time
2. **Error Reduction**: 90% fewer validation errors on first attempt
3. **Learning Curve**: New specialists productive in days (not weeks)
4. **Consistency**: Standardized XML structure across team

## Future Enhancements

1. **Real Jira Integration**: Connect to actual Jira API
2. **Real Transformator Integration**: Connect to UKG Pro API
3. **Learning System**: Capture error patterns for better suggestions
4. **Batch Processing**: Handle multiple Business Rules
5. **Template Library**: User-contributed XML templates
6. **Audit Trail**: Track changes and approvals

## References

- UKG Pro Business Rules Import: https://redthree.com/ukg_pro_import_simple_business_rules/
- GitHub Copilot Extensions: https://docs.github.com/copilot/building-copilot-extensions
- VS Code Extension API: https://code.visualstudio.com/api

---

**Status**: Draft
**Author**: Solution Architect
**Created**: 2026-02-17
**Last Updated**: 2026-02-17
