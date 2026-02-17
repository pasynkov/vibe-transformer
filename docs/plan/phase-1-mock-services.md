# Phase 1: Mock Services Backend

**Duration**: 6 days (8 iterations)
**Status**: ⏳ Not Started (0/8 done)
**Goal**: Build NestJS monorepo with Jira Mock API and Transformator Mock API

---

## Iterations

### Iteration 1.1: Jira Mock API - Basic Setup ✅

**Status**: `done`
**Started**: 2026-02-17
**Completed**: 2026-02-17
**Duration**: 0.5 days (actual: ~1 hour)
**Goal**: Create NestJS monorepo structure and basic Jira Mock API with health check

**Deliverables**:
- [x] `mock-services/package.json` - Monorepo root with workspaces
- [x] `mock-services/nest-cli.json` - Monorepo configuration
- [x] `mock-services/apps/jira-mock/src/main.ts` - Entry point
- [x] `mock-services/apps/jira-mock/src/app.module.ts` - Root module
- [x] `mock-services/apps/jira-mock/src/health/health.controller.ts` - Health check

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
- [x] Server starts on port 3001
- [x] Health endpoint returns 200 OK
- [x] Swagger docs accessible at `/api/docs`
- [x] No errors in console

**Blocked By**: None

---

### Iteration 1.2: Jira Mock API - Issues Endpoint ✅

**Status**: `done`
**Started**: 2026-02-17
**Completed**: 2026-02-17
**Duration**: 1 day (actual: ~1 hour)
**Goal**: Implement GET /api/v1/issues/:ticketId endpoint with in-memory data

**Deliverables**:
- [x] `issues/issues.controller.ts` - Issues controller
- [x] `issues/issues.service.ts` - Business logic
- [x] `issues/issues.module.ts` - Issues module
- [x] `issues/dto/issue.dto.ts` - Issue DTO with validation
- [x] `data/seed-data.ts` - Seed data for BR-1234, BR-1235, BR-1236

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
- [x] GET /api/v1/issues/BR-1234 returns employee positions data
- [x] GET /api/v1/issues/BR-1235 returns department codes data
- [x] GET /api/v1/issues/BR-1236 returns teacher certifications data
- [x] Non-existent ID returns 404
- [x] Response matches JiraIssue DTO schema
- [x] Swagger docs show endpoint

**Blocked By**: Iteration 1.1

---

### Iteration 1.3: Jira Mock API - Attachments Endpoint ✅

**Status**: `done`
**Started**: 2026-02-17
**Completed**: 2026-02-17
**Duration**: 0.5 days (actual: ~1 hour)
**Goal**: Implement CSV file serving for attachments

**Deliverables**:
- [x] `attachments/attachments.controller.ts` - Attachments controller
- [x] `attachments/attachments.service.ts` - File serving logic
- [x] `attachments/data/csv-data.ts` - CSV content (BR-1234, BR-1235, BR-1236)
- [x] `data/csv-files/positions.csv` - BR-1234 CSV (also in app data folder)
- [x] `data/csv-files/departments.csv` - BR-1235 CSV (also in app data folder)
- [x] `data/csv-files/certifications.csv` - BR-1236 CSV (also in app data folder)

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
- [x] All 3 CSV files exist and have correct data
- [x] GET /api/v1/issues/:id/attachments returns attachment list
- [x] GET /api/v1/attachments/:id downloads CSV
- [x] CSV Content-Type header is correct
- [x] CSV content matches examples in demo-workspace/examples/

**Blocked By**: Iteration 1.2

---

### Iteration 1.4: Transformator Mock API - Basic Setup ✅

**Status**: `done`
**Started**: 2026-02-17
**Completed**: 2026-02-17
**Duration**: 0.5 days (actual: ~30 min)
**Goal**: Create Transformator Mock API with health check

**Deliverables**:
- [x] `mock-services/apps/transformator-mock/src/main.ts` - Entry point
- [x] `mock-services/apps/transformator-mock/src/app.module.ts` - Root module
- [x] `mock-services/apps/transformator-mock/src/health/health.controller.ts` - Health check

**Success Criteria**:
```bash
npm run start:dev:transformator

# Test health endpoint
curl http://localhost:3002/api/health
# Expected: {"status":"ok"}
```

**Testing Checklist**:
- [x] Server starts on port 3002
- [x] Health endpoint returns 200 OK
- [x] Swagger docs accessible at `/api/docs`
- [x] Both servers run concurrently: `npm run start:dev`

**Blocked By**: Iteration 1.1

---

### Iteration 1.5: Transformator Mock API - Validation Endpoint ✅

**Status**: `done`
**Started**: 2026-02-17
**Completed**: 2026-02-17
**Duration**: 1 day (actual: ~1.5 hours)
**Goal**: Implement POST /api/v1/business-rules/validate with basic XML validation

**Deliverables**:
- [x] `validation/validation.controller.ts` - Validation controller
- [x] `validation/validation.service.ts` - Validation business logic
- [x] `validation/dto/validate-request.dto.ts` - Request DTO
- [x] `validation/dto/validation-result.dto.ts` - Response DTO
- [x] `state/validation-state.service.ts` - Track attempts per ruleId

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
- [x] POST /api/v1/business-rules/validate accepts XML
- [x] Validates against basic schema (XML structure)
- [x] Returns attemptNumber correctly
- [x] State persists across requests for same ruleId
- [x] Different ruleIds have independent state

**Blocked By**: Iteration 1.4

---

### Iteration 1.6: Transformator Mock API - Error Generation Logic ✅

**Status**: `done`
**Started**: 2026-02-17
**Completed**: 2026-02-17
**Duration**: 1.5 days (actual: ~2 hours)
**Goal**: Implement iteration-based error generation (attempt 1 → structural, attempt 2 → content, attempt 3 → success)

**Deliverables**:
- [x] `validation/validators/xml-parser.validator.ts` - Parse XML
- [x] `validation/validators/duplicate-checker.validator.ts` - Check duplicates
- [x] `validation/validators/length-validator.ts` - Check RuleCode length
- [x] `validation/validators/character-validator.ts` - Check invalid chars
- [x] `validation/error-generator.ts` - Generate errors based on attempt

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
- [x] Attempt 1 returns DUPLICATE_RULE_CODE error
- [x] Attempt 1 returns RULE_CODE_TOO_LONG error
- [x] Attempt 2 returns INVALID_CHARACTERS error
- [x] Attempt 2 returns SHORT_RULE_CODE warning
- [x] Attempt 3 returns valid: true
- [x] Error messages include suggestions
- [x] Line numbers are provided in errors

**Blocked By**: Iteration 1.5

---

### Iteration 1.7: Transformator Mock API - Import Jobs 🔄

**Status**: `in_progress`
**Started**: 2026-02-17
**Duration**: 1 day
**Goal**: Implement import job simulation with status polling

**Deliverables**:
- [x] `import/import.controller.ts` - Import controller
- [x] `import/import.service.ts` - Job creation and simulation
- [x] `jobs/jobs.controller.ts` - Job status controller
- [x] `jobs/jobs.service.ts` - Job state management

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
- [x] POST /api/v1/business-rules/import creates job
- [x] Job progresses from queued → running → completed
- [x] GET /api/v1/jobs/:id/status returns current state
- [x] Completed jobs show results

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

## Phase 1 Progress

```
Iteration 1.1: ⬜ Jira Mock API - Basic Setup
Iteration 1.2: ⬜ Jira Mock API - Issues Endpoint
Iteration 1.3: ⬜ Jira Mock API - Attachments Endpoint
Iteration 1.4: ⬜ Transformator Mock API - Basic Setup
Iteration 1.5: ⬜ Transformator Mock API - Validation Endpoint
Iteration 1.6: ⬜ Transformator Mock API - Error Generation Logic
Iteration 1.7: ⬜ Transformator Mock API - Import Jobs (Optional)
Iteration 1.8: ⬜ Docker Setup

Progress: 0/8 (0%)
```

---

**Next**: Start with [Iteration 1.1](#iteration-11-jira-mock-api---basic-setup-)
