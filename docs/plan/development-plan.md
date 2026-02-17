# Development Plan - VibeTransformer 2.0

**Status**: In Progress
**Start Date**: 2026-02-17
**Target Completion**: 10-12 days

---

## Plan Structure

Each iteration has:
- **Goal**: What we're building
- **Success Criteria**: How to verify it works
- **Deliverables**: Files/features to create
- **Testing**: Commands to test functionality
- **Status**: `pending` | `in_progress` | `done` | `blocked`

---

## Phase 1: Mock Services Backend (Days 1-6)

### Iteration 1.1: Jira Mock API - Basic Setup ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Create NestJS monorepo structure and basic Jira Mock API with health check

**Deliverables**:
- [ ] `mock-services/package.json` - Monorepo root with workspaces
- [ ] `mock-services/nest-cli.json` - Monorepo configuration
- [ ] `mock-services/apps/jira-mock/src/main.ts` - Entry point
- [ ] `mock-services/apps/jira-mock/src/app.module.ts` - Root module
- [ ] `mock-services/apps/jira-mock/src/health/health.controller.ts` - Health check

**Success Criteria**:
```bash
cd mock-services
npm install
npm run start:dev:jira

# Test health endpoint
curl http://localhost:3001/api/health
# Expected: {"status":"ok"}
```

**Testing Checklist**:
- [ ] Server starts on port 3001
- [ ] Health endpoint returns 200 OK
- [ ] Swagger docs accessible at `/api/docs`
- [ ] No errors in console

**Blocked By**: None

---

### Iteration 1.2: Jira Mock API - Issues Endpoint ⏳

**Status**: `pending`
**Duration**: 1 day
**Goal**: Implement GET /api/v1/issues/:ticketId endpoint with in-memory data

**Deliverables**:
- [ ] `issues/issues.controller.ts` - Issues controller
- [ ] `issues/issues.service.ts` - Business logic
- [ ] `issues/issues.module.ts` - Issues module
- [ ] `issues/dto/issue.dto.ts` - Issue DTO with validation
- [ ] `data/seed-data.ts` - Seed data for BR-1234, BR-1235, BR-1236

**Success Criteria**:
```bash
# Get issue BR-1235
curl http://localhost:3001/api/v1/issues/BR-1235 | jq

# Expected:
# {
#   "id": "10002",
#   "key": "BR-1235",
#   "summary": "Create Business Rule: Department Codes",
#   "customFields": {
#     "businessRuleName": "CO_DepartmentCodes",
#     "countryCode": "USA",
#     ...
#   }
# }

# Test 404
curl http://localhost:3001/api/v1/issues/BR-9999
# Expected: 404 Not Found
```

**Testing Checklist**:
- [ ] GET /api/v1/issues/BR-1234 returns employee positions data
- [ ] GET /api/v1/issues/BR-1235 returns department codes data
- [ ] GET /api/v1/issues/BR-1236 returns teacher certifications data
- [ ] Non-existent ID returns 404
- [ ] Response matches JiraIssue DTO schema
- [ ] Swagger docs show endpoint

**Blocked By**: Iteration 1.1

---

### Iteration 1.3: Jira Mock API - Attachments Endpoint ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Implement CSV file serving for attachments

**Deliverables**:
- [ ] `attachments/attachments.controller.ts` - Attachments controller
- [ ] `attachments/attachments.service.ts` - File serving logic
- [ ] `data/csv-files/positions.csv` - BR-1234 CSV
- [ ] `data/csv-files/departments.csv` - BR-1235 CSV
- [ ] `data/csv-files/certifications.csv` - BR-1236 CSV

**Success Criteria**:
```bash
# Get attachment list
curl http://localhost:3001/api/v1/issues/BR-1235/attachments | jq

# Expected:
# {
#   "attachments": [
#     {
#       "id": "att-002",
#       "filename": "departments.csv",
#       "downloadUrl": "/api/v1/attachments/att-002"
#     }
#   ]
# }

# Download CSV
curl http://localhost:3001/api/v1/attachments/att-002
# Expected: CSV content
```

**Testing Checklist**:
- [ ] All 3 CSV files exist and have correct data
- [ ] GET /api/v1/issues/:id/attachments returns attachment list
- [ ] GET /api/v1/attachments/:id downloads CSV
- [ ] CSV Content-Type header is correct
- [ ] CSV content matches examples in demo-workspace/examples/

**Blocked By**: Iteration 1.2

---

### Iteration 1.4: Transformator Mock API - Basic Setup ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Create Transformator Mock API with health check

**Deliverables**:
- [ ] `mock-services/apps/transformator-mock/src/main.ts` - Entry point
- [ ] `mock-services/apps/transformator-mock/src/app.module.ts` - Root module
- [ ] `mock-services/apps/transformator-mock/src/health/health.controller.ts` - Health check

**Success Criteria**:
```bash
npm run start:dev:transformator

# Test health endpoint
curl http://localhost:3002/api/health
# Expected: {"status":"ok"}
```

**Testing Checklist**:
- [ ] Server starts on port 3002
- [ ] Health endpoint returns 200 OK
- [ ] Swagger docs accessible at `/api/docs`
- [ ] Both servers run concurrently: `npm run start:dev`

**Blocked By**: Iteration 1.1

---

### Iteration 1.5: Transformator Mock API - Validation Endpoint ⏳

**Status**: `pending`
**Duration**: 1 day
**Goal**: Implement POST /api/v1/business-rules/validate with basic XML validation

**Deliverables**:
- [ ] `validation/validation.controller.ts` - Validation controller
- [ ] `validation/validation.service.ts` - Validation business logic
- [ ] `validation/dto/validate-request.dto.ts` - Request DTO
- [ ] `validation/dto/validation-result.dto.ts` - Response DTO
- [ ] `state/validation-state.service.ts` - Track attempts per ruleId

**Success Criteria**:
```bash
# Test validation (should return attempt 1)
curl -X POST http://localhost:3002/api/v1/business-rules/validate \
  -H "Content-Type: application/json" \
  -d '{
    "xml": "<Import><Transaction>...</Transaction></Import>",
    "ruleId": "BR-1235",
    "businessRuleName": "CO_DepartmentCodes"
  }' | jq

# Expected:
# {
#   "valid": false,
#   "attemptNumber": 1,
#   "errors": [...],
#   "validatedAt": "2026-02-17T..."
# }

# Test again (should return attempt 2)
# Expected: attemptNumber: 2
```

**Testing Checklist**:
- [ ] POST /api/v1/business-rules/validate accepts XML
- [ ] Validates against basic schema (XML structure)
- [ ] Returns attemptNumber correctly
- [ ] State persists across requests for same ruleId
- [ ] Different ruleIds have independent state

**Blocked By**: Iteration 1.4

---

### Iteration 1.6: Transformator Mock API - Error Generation Logic ⏳

**Status**: `pending`
**Duration**: 1.5 days
**Goal**: Implement iteration-based error generation (attempt 1 → structural, attempt 2 → content, attempt 3 → success)

**Deliverables**:
- [ ] `validation/validators/xml-parser.validator.ts` - Parse XML
- [ ] `validation/validators/duplicate-checker.validator.ts` - Check duplicates
- [ ] `validation/validators/length-validator.ts` - Check RuleCode length
- [ ] `validation/validators/character-validator.ts` - Check invalid chars
- [ ] `validation/error-generator.ts` - Generate errors based on attempt

**Success Criteria**:
```bash
# Use example-2-with-errors data
cd demo-workspace/examples/example-2-with-errors

# Attempt 1 - Structural errors
curl -X POST http://localhost:3002/api/v1/business-rules/validate \
  -H "Content-Type: application/json" \
  -d "{\"xml\":\"$(cat output-attempt1.xml)\",\"ruleId\":\"BR-1235\",\"businessRuleName\":\"CO_DepartmentCodes\"}" \
  | jq

# Expected errors:
# - DUPLICATE_RULE_CODE (ADMIN)
# - RULE_CODE_TOO_LONG (POSITION001)

# Attempt 2 - Content errors
curl -X POST http://localhost:3002/api/v1/business-rules/validate \
  -H "Content-Type: application/json" \
  -d "{\"xml\":\"$(cat output-attempt2.xml)\",\"ruleId\":\"BR-1235\",\"businessRuleName\":\"CO_DepartmentCodes\"}" \
  | jq

# Expected errors:
# - INVALID_CHARACTERS (SPECIAL!)
# Expected warnings:
# - SHORT_RULE_CODE (P1)

# Attempt 3 - Success
curl -X POST http://localhost:3002/api/v1/business-rules/validate \
  -H "Content-Type: application/json" \
  -d "{\"xml\":\"$(cat output-final.xml)\",\"ruleId\":\"BR-1235\",\"businessRuleName\":\"CO_DepartmentCodes\"}" \
  | jq

# Expected:
# {
#   "valid": true,
#   "attemptNumber": 3,
#   "errors": []
# }
```

**Testing Checklist**:
- [ ] Attempt 1 returns DUPLICATE_RULE_CODE error
- [ ] Attempt 1 returns RULE_CODE_TOO_LONG error
- [ ] Attempt 2 returns INVALID_CHARACTERS error
- [ ] Attempt 2 returns SHORT_RULE_CODE warning
- [ ] Attempt 3 returns valid: true
- [ ] Error messages include suggestions
- [ ] Line numbers are provided in errors

**Blocked By**: Iteration 1.5

---

### Iteration 1.7: Transformator Mock API - Import Jobs (Optional) ⏳

**Status**: `pending`
**Duration**: 1 day
**Goal**: Implement import job simulation with status polling

**Deliverables**:
- [ ] `import/import.controller.ts` - Import controller
- [ ] `import/import.service.ts` - Job creation and simulation
- [ ] `jobs/jobs.controller.ts` - Job status controller
- [ ] `jobs/jobs.service.ts` - Job state management

**Success Criteria**:
```bash
# Create import job
curl -X POST http://localhost:3002/api/v1/business-rules/import \
  -H "Content-Type: application/json" \
  -d '{
    "xml": "<Import>...</Import>",
    "ruleId": "BR-1235",
    "businessRuleName": "CO_DepartmentCodes",
    "environment": "DEV"
  }' | jq

# Expected:
# {
#   "jobId": "job-uuid-123",
#   "status": "queued",
#   "createdAt": "2026-02-17T..."
# }

# Poll job status
curl http://localhost:3002/api/v1/jobs/job-uuid-123/status | jq

# Expected:
# {
#   "jobId": "job-uuid-123",
#   "status": "completed",
#   "progress": 100,
#   "result": {
#     "success": true,
#     "recordsImported": 6
#   }
# }
```

**Testing Checklist**:
- [ ] POST /api/v1/business-rules/import creates job
- [ ] Job progresses from queued → running → completed
- [ ] GET /api/v1/jobs/:id/status returns current state
- [ ] Completed jobs show results

**Blocked By**: Iteration 1.6

---

### Iteration 1.8: Docker Setup ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Containerize both APIs with Docker Compose

**Deliverables**:
- [ ] `mock-services/docker-compose.yml` - Orchestration
- [ ] `mock-services/apps/jira-mock/Dockerfile` - Jira container
- [ ] `mock-services/apps/transformator-mock/Dockerfile` - Transformator container
- [ ] Health checks in docker-compose

**Success Criteria**:
```bash
cd mock-services

# Build and start
docker-compose up -d

# Wait for health checks
sleep 10

# Test both services
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health

# Check logs
docker-compose logs -f

# Stop
docker-compose down
```

**Testing Checklist**:
- [ ] `docker-compose up -d` starts both containers
- [ ] Both services respond to health checks
- [ ] Services can communicate (if needed)
- [ ] Logs are accessible via `docker-compose logs`
- [ ] `docker-compose down` stops cleanly
- [ ] Volumes persist data if needed

**Blocked By**: Iteration 1.7

---

## Phase 2: Copilot Integration (Days 7-8)

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

## Phase 3: VS Code Extension (Days 9-12) - Optional

### Iteration 3.1: Extension Scaffold ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Create VS Code extension project structure

**Deliverables**:
- [ ] `vibe-transformer-extension/package.json` - Extension manifest
- [ ] `vibe-transformer-extension/src/extension.ts` - Entry point
- [ ] `vibe-transformer-extension/tsconfig.json` - TypeScript config
- [ ] Extension activation and deactivation hooks

**Success Criteria**:
```bash
cd vibe-transformer-extension
npm install
npm run compile

# Press F5 in VS Code to launch Extension Development Host
# Extension should activate without errors
```

**Testing Checklist**:
- [ ] Extension compiles without errors
- [ ] Extension activates in Development Host
- [ ] Extension shows in installed extensions
- [ ] No console errors on activation

**Blocked By**: Iteration 2.3

---

### Iteration 3.2: Chat Participant Registration ⏳

**Status**: `pending`
**Duration**: 1 day
**Goal**: Register `@vibe-transformer` chat participant

**Deliverables**:
- [ ] `src/chat-participant.ts` - Chat participant handler
- [ ] Register participant in extension.ts
- [ ] Basic command routing (fetch, generate, validate, fix)

**Success Criteria**:
```bash
# In Extension Development Host:
# Open Copilot Chat (Cmd+Shift+I)
# Type: @vibe-transformer

# Expected: Autocomplete shows @vibe-transformer
# Type: @vibe-transformer help

# Expected: Shows available commands
```

**Testing Checklist**:
- [ ] `@vibe-transformer` autocompletes in Copilot Chat
- [ ] Participant responds to messages
- [ ] Help command lists available commands
- [ ] Unknown commands show helpful error

**Blocked By**: Iteration 3.1

---

### Iteration 3.3: API Client Implementation ⏳

**Status**: `pending`
**Duration**: 1 day
**Goal**: Implement API clients for Jira and Transformator

**Deliverables**:
- [ ] `src/api/jira-client.ts` - Jira API client
- [ ] `src/api/transformator-client.ts` - Transformator API client
- [ ] Error handling and retries
- [ ] Configuration from VS Code settings

**Success Criteria**:
```typescript
// Test in extension code
const jiraClient = new JiraClient('http://localhost:3001');
const issue = await jiraClient.getIssue('BR-1235');
console.log(issue.key); // "BR-1235"

const transformatorClient = new TransformatorClient('http://localhost:3002');
const result = await transformatorClient.validate({
  xml: '<Import>...</Import>',
  ruleId: 'BR-1235',
  businessRuleName: 'CO_DepartmentCodes'
});
console.log(result.valid); // false or true
```

**Testing Checklist**:
- [ ] Jira client can fetch issues
- [ ] Jira client can list attachments
- [ ] Jira client can download CSV
- [ ] Transformator client can validate XML
- [ ] Transformator client can create import jobs
- [ ] Error handling works (network errors, 404s, etc.)

**Blocked By**: Iteration 3.2

---

### Iteration 3.4: Commands Implementation ⏳

**Status**: `pending`
**Duration**: 1.5 days
**Goal**: Implement all chat participant commands

**Deliverables**:
- [ ] `src/commands/fetch-task.ts` - Fetch Jira task
- [ ] `src/commands/generate-xml.ts` - Generate XML from CSV
- [ ] `src/commands/validate-xml.ts` - Validate XML
- [ ] `src/commands/fix-errors.ts` - Auto-fix validation errors

**Success Criteria**:
```bash
# In Extension Development Host with Copilot Chat:

@vibe-transformer fetch BR-1235
# Expected: Shows task details, CSV preview, "Generate XML" button

@vibe-transformer generate
# Expected: Creates output/BR-1235.xml, shows preview, "Validate" button

@vibe-transformer validate
# Expected: Shows validation result, errors table, "Fix Errors" button

@vibe-transformer fix
# Expected: Applies fixes, regenerates XML, shows diff
```

**Testing Checklist**:
- [ ] `fetch` command calls Jira API and displays results
- [ ] `generate` command creates XML file correctly
- [ ] `validate` command calls Transformator API
- [ ] `fix` command analyzes and fixes errors
- [ ] All commands show appropriate UI elements
- [ ] Error handling works for all commands

**Blocked By**: Iteration 3.3

---

### Iteration 3.5: UI Components ⏳

**Status**: `pending`
**Duration**: 1 day
**Goal**: Add error panel and status bar

**Deliverables**:
- [ ] `src/ui/error-panel.ts` - Error display panel
- [ ] `src/ui/status-bar.ts` - Status bar item
- [ ] CSS styling for error panel

**Success Criteria**:
```bash
# After running @vibe-transformer validate with errors:
# - Error panel opens showing errors
# - Status bar shows "BR-1235 (Invalid - Attempt 2)"

# After validation succeeds:
# - Error panel closes
# - Status bar shows "BR-1235 (Valid - Attempt 3)"
```

**Testing Checklist**:
- [ ] Error panel displays validation errors
- [ ] Error panel shows line numbers
- [ ] Error panel has "Fix" button for each error
- [ ] Status bar shows current task
- [ ] Status bar shows validation status
- [ ] Status bar shows attempt number

**Blocked By**: Iteration 3.4

---

### Iteration 3.6: Package Extension ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Package extension as .vsix for distribution

**Deliverables**:
- [ ] `vibe-transformer-0.1.0.vsix` - Packaged extension
- [ ] Installation instructions in README
- [ ] Test installation from .vsix

**Success Criteria**:
```bash
# Package extension
cd vibe-transformer-extension
npm run package

# Install in fresh VS Code
code --install-extension vibe-transformer-0.1.0.vsix

# Verify installation
code --list-extensions | grep vibe-transformer

# Test in regular VS Code (not Development Host)
# Open demo-workspace
# @vibe-transformer commands should work
```

**Testing Checklist**:
- [ ] Extension packages without errors
- [ ] .vsix file created
- [ ] Can install from .vsix
- [ ] Extension works in regular VS Code
- [ ] All commands functional
- [ ] No errors in console

**Blocked By**: Iteration 3.5

---

## Phase 4: Integration & Polish (Day 13)

### Iteration 4.1: End-to-End Testing ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Test complete demo workflow with all components

**Deliverables**:
- [ ] E2E test script
- [ ] Test results documentation
- [ ] Bug fixes

**Success Criteria**:
```bash
# Complete demo workflow:
1. docker-compose up -d
2. Open demo-workspace in VS Code
3. Install extension (if Phase 3 complete)
4. Run through Example 2 workflow
5. Complete 3 validation iterations
6. Achieve success

# All tests pass
```

**Testing Checklist**:
- [ ] All mock services healthy
- [ ] All API endpoints working
- [ ] Copilot Instructions effective
- [ ] Extension commands work (if applicable)
- [ ] Example 1 completes successfully
- [ ] Example 2 completes with 3 iterations
- [ ] Example 3 completes successfully
- [ ] No errors or warnings

**Blocked By**: Iteration 3.6 (or 2.3 if skipping Phase 3)

---

### Iteration 4.2: Documentation Update ⏳

**Status**: `pending`
**Duration**: 0.5 days
**Goal**: Update all documentation with actual implementation details

**Deliverables**:
- [ ] Update README.md with actual commands
- [ ] Update specs with implementation notes
- [ ] Add troubleshooting based on testing
- [ ] Update SUMMARY.md

**Success Criteria**:
- All documentation accurate
- No broken links
- All curl commands work
- All screenshots/examples current

**Testing Checklist**:
- [ ] README instructions are accurate
- [ ] All links work
- [ ] All commands verified
- [ ] Troubleshooting section helpful

**Blocked By**: Iteration 4.1

---

## Progress Tracking

### Overall Status

- **Phase 1 (Mock Services)**: ⏳ Not Started (0/8 iterations)
- **Phase 2 (Copilot Integration)**: ⏳ Not Started (0/3 iterations)
- **Phase 3 (VS Code Extension)**: ⏳ Not Started (0/6 iterations)
- **Phase 4 (Integration & Polish)**: ⏳ Not Started (0/2 iterations)

**Total Progress**: 0/19 iterations (0%)

---

## Legend

- ⏳ **Not Started** - Iteration not begun
- 🔄 **In Progress** - Currently working on this
- ✅ **Done** - Completed and verified
- ❌ **Blocked** - Cannot proceed (dependency not met)
- ⚠️ **Issues** - Has problems, needs attention

---

## Notes

- Each iteration should be completed and tested before moving to next
- User confirms success before proceeding
- Update status after each completion
- Document any issues or deviations
- Adjust estimates as needed

---

**Last Updated**: 2026-02-17
**Current Iteration**: None (planning phase)
