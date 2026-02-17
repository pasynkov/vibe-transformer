# Transformator Mock API Specification

## Overview

REST API microservice that emulates UKG Pro Transformator API for Business Rule validation and import testing.

**Technology**: NestJS + TypeScript
**Port**: 3002
**Purpose**: Simulate multi-iteration testing workflow with realistic error responses

---

## Key Features

1. **Stateful Testing**: Tracks submission attempts per Business Rule
2. **Progressive Errors**: Returns different errors on each iteration (simulate learning)
3. **XML Validation**: Validates against UKG Pro Business Rule schema
4. **Realistic Errors**: Returns error codes and suggestions similar to real Transformator

---

## API Endpoints

### 1. Validate Business Rule XML

**Endpoint**: `POST /api/v1/business-rules/validate`

**Description**: Validate XML structure without importing

**Request Body**:
```typescript
{
  "xml": string,              // XML content
  "ruleId": string,           // Business Rule ID (e.g., "BR-1234")
  "businessRuleName": string  // e.g., "CO_EmployeePositions"
}
```

**Response**: `200 OK`

```typescript
{
  "valid": boolean,
  "errors": ValidationError[],
  "warnings": ValidationError[],
  "validatedAt": string,      // ISO 8601 datetime
  "attemptNumber": number     // 1, 2, 3, etc.
}

interface ValidationError {
  line: number | null,        // XML line number (null for structural errors)
  column: number | null,
  code: string,               // Error code (e.g., "DUPLICATE_RULE_CODE")
  message: string,            // Human-readable error
  severity: 'error' | 'warning',
  field?: string,             // Field name if applicable
  suggestion?: string         // AI-friendly fix suggestion
}
```

**Example Response (1st Attempt - Structure Errors)**:
```json
{
  "valid": false,
  "errors": [
    {
      "line": 12,
      "column": 8,
      "code": "DUPLICATE_RULE_CODE",
      "message": "RuleCode 'ADMIN' appears multiple times in the import",
      "severity": "error",
      "field": "RuleCode",
      "suggestion": "Ensure all RuleCode values are unique. Consider using 'ADMIN1', 'ADMIN2' for variations."
    },
    {
      "line": 18,
      "column": 15,
      "code": "RULE_CODE_TOO_LONG",
      "message": "RuleCode 'POSITION001' exceeds maximum length of 6 characters",
      "severity": "error",
      "field": "RuleCode",
      "suggestion": "Shorten RuleCode to 6 characters or less. Example: 'POS001'"
    }
  ],
  "warnings": [],
  "validatedAt": "2026-02-17T09:30:00Z",
  "attemptNumber": 1
}
```

**Example Response (2nd Attempt - Business Logic Errors)**:
```json
{
  "valid": false,
  "errors": [
    {
      "line": 8,
      "column": 20,
      "code": "INVALID_CHARACTERS",
      "message": "Description contains invalid character '!'",
      "severity": "error",
      "field": "Description",
      "suggestion": "Remove special characters from description. Allowed: letters, numbers, spaces, hyphens, underscores."
    }
  ],
  "warnings": [
    {
      "line": 15,
      "column": 12,
      "code": "SHORT_RULE_CODE",
      "message": "RuleCode 'P1' is very short (2 chars). Consider using more descriptive code.",
      "severity": "warning",
      "field": "RuleCode",
      "suggestion": "Use at least 4 characters for better readability. Example: 'POS1'"
    }
  ],
  "validatedAt": "2026-02-17T09:35:00Z",
  "attemptNumber": 2
}
```

**Example Response (3rd Attempt - Success)**:
```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "validatedAt": "2026-02-17T09:40:00Z",
  "attemptNumber": 3
}
```

---

### 2. Import Business Rule

**Endpoint**: `POST /api/v1/business-rules/import`

**Description**: Import Business Rule XML (only after validation passes)

**Request Body**:
```typescript
{
  "xml": string,
  "ruleId": string,
  "businessRuleName": string,
  "environment": "DEV" | "UAT" | "PROD"
}
```

**Response**: `202 Accepted`

```typescript
{
  "jobId": string,            // Unique job ID
  "status": "queued",
  "message": "Import job created successfully",
  "createdAt": string,
  "estimatedDuration": number // Seconds
}
```

**Error Response (if validation failed)**:
```typescript
{
  "statusCode": 400,
  "message": "XML validation failed. Please validate first.",
  "errors": [/* validation errors */]
}
```

---

### 3. Get Import Job Status

**Endpoint**: `GET /api/v1/jobs/:jobId/status`

**Description**: Check status of import job

**Path Parameters**:
- `jobId` (string, required) - Job ID from import response

**Response**: `200 OK`

```typescript
{
  "jobId": string,
  "status": JobStatus,
  "progress": number,         // 0-100
  "createdAt": string,
  "completedAt": string | null,
  "result": JobResult | null
}

type JobStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed';

interface JobResult {
  success: boolean,
  recordsProcessed: number,
  recordsImported: number,
  errors: ValidationError[]
}
```

**Example Response (In Progress)**:
```json
{
  "jobId": "job-uuid-123",
  "status": "running",
  "progress": 45,
  "createdAt": "2026-02-17T09:40:00Z",
  "completedAt": null,
  "result": null
}
```

**Example Response (Completed)**:
```json
{
  "jobId": "job-uuid-123",
  "status": "completed",
  "progress": 100,
  "createdAt": "2026-02-17T09:40:00Z",
  "completedAt": "2026-02-17T09:41:30Z",
  "result": {
    "success": true,
    "recordsProcessed": 5,
    "recordsImported": 5,
    "errors": []
  }
}
```

---

### 4. Reset Test State (Dev Only)

**Endpoint**: `POST /api/v1/dev/reset/:ruleId`

**Description**: Reset attempt counter for a Business Rule (for demo purposes)

**Path Parameters**:
- `ruleId` (string, required) - Business Rule ID

**Response**: `200 OK`

```typescript
{
  "message": "Test state reset for BR-1234",
  "ruleId": "BR-1234"
}
```

---

## Error Simulation Strategy

### Iteration-Based Error Generation

The API tracks attempts per `ruleId` and returns different errors on each iteration:

**Attempt 1: Structural/Duplicate Errors**
- Duplicate RuleCodes
- RuleCode length violations (>6 chars, <1 char)
- Missing required fields
- Invalid XML structure

**Attempt 2: Content/Business Logic Errors**
- Invalid characters in fields
- Description too long (>255 chars)
- Invalid country codes
- Warnings about short codes

**Attempt 3: Success**
- All validations pass
- Ready for import

**Attempt 4+: Success**
- Continue returning success

### Error Code Catalog

| Error Code | Severity | Description | Suggestion |
|-----------|----------|-------------|------------|
| `DUPLICATE_RULE_CODE` | error | RuleCode appears multiple times | Make RuleCodes unique (ADMIN → ADMIN1, ADMIN2) |
| `RULE_CODE_TOO_LONG` | error | RuleCode exceeds 6 characters | Shorten to 6 chars (POSITION001 → POS001) |
| `RULE_CODE_TOO_SHORT` | error | RuleCode is empty | Provide a valid RuleCode |
| `INVALID_CHARACTERS` | error | Special characters not allowed | Remove special chars (!@#$%^&*) |
| `DESCRIPTION_TOO_LONG` | error | Description exceeds 255 chars | Shorten description to max 255 chars |
| `MISSING_REQUIRED_FIELD` | error | Required field is missing | Add required field: {fieldName} |
| `INVALID_COUNTRY_CODE` | error | Country code not recognized | Use ISO country code (USA, CAN, GBR, etc.) |
| `INVALID_TRANSACTION_TYPE` | error | TransactionType must be SIMPLERULE | Set TransactionType to 'SIMPLERULE' |
| `SHORT_RULE_CODE` | warning | RuleCode is very short | Consider using 4+ characters for clarity |
| `GENERIC_DESCRIPTION` | warning | Description is too generic | Make description more specific |

---

## Data Models

### Validation State

```typescript
interface ValidationState {
  ruleId: string;
  businessRuleName: string;
  attemptCount: number;
  lastValidation: string;       // ISO 8601 datetime
  xmlHistory: string[];          // Store last 3 XML submissions
  validationPassed: boolean;
}
```

### Import Job

```typescript
interface ImportJob {
  jobId: string;
  ruleId: string;
  businessRuleName: string;
  environment: string;
  xml: string;
  status: JobStatus;
  progress: number;
  createdAt: string;
  completedAt: string | null;
  result: JobResult | null;
}
```

---

## XML Validation Logic

### Schema Validation

Validate against UKG Pro Business Rule XSD schema:

```xml
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="Import">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="Transaction" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="Header">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="TransactionType" type="xs:string" fixed="SIMPLERULE"/>
                    <xs:element name="BusinessRule" type="xs:string"/>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
              <xs:element name="SimpleRule">
                <xs:complexType>
                  <xs:sequence>
                    <xs:element name="RuleCode" type="RuleCodeType"/>
                    <xs:element name="Description" type="DescriptionType"/>
                    <xs:element name="CountryCode" type="xs:string"/>
                  </xs:sequence>
                </xs:complexType>
              </xs:element>
            </xs:sequence>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>

  <xs:simpleType name="RuleCodeType">
    <xs:restriction base="xs:string">
      <xs:minLength value="1"/>
      <xs:maxLength value="6"/>
    </xs:restriction>
  </xs:simpleType>

  <xs:simpleType name="DescriptionType">
    <xs:restriction base="xs:string">
      <xs:maxLength value="255"/>
    </xs:restriction>
  </xs:simpleType>
</xs:schema>
```

### Custom Business Rules

Beyond XSD validation:
1. Unique RuleCodes within single import
2. No special characters in RuleCode: `^[A-Z0-9_-]+$`
3. Description allowed chars: `^[A-Za-z0-9 _-]+$`
4. Valid country codes from ISO 3166-1 alpha-3

---

## Implementation Details

### Technology Stack

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "xml2js": "^0.6.0",
    "fast-xml-parser": "^4.3.0",
    "uuid": "^9.0.0"
  }
}
```

### Project Structure

```
transformator-mock-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── validation/
│   │   ├── validation.controller.ts
│   │   ├── validation.service.ts
│   │   ├── validation.module.ts
│   │   ├── validators/
│   │   │   ├── xml-schema.validator.ts
│   │   │   ├── business-rules.validator.ts
│   │   │   └── duplicate-checker.validator.ts
│   │   └── error-generator.ts         # Iteration-based error generation
│   ├── import/
│   │   ├── import.controller.ts
│   │   ├── import.service.ts
│   │   └── import.module.ts
│   ├── jobs/
│   │   ├── jobs.controller.ts
│   │   ├── jobs.service.ts
│   │   └── jobs.module.ts
│   └── state/
│       └── validation-state.service.ts  # Track attempts per ruleId
├── Dockerfile
└── package.json
```

### Validation Service Implementation

```typescript
@Injectable()
export class ValidationService {
  constructor(
    private readonly stateService: ValidationStateService,
    private readonly errorGenerator: ErrorGenerator,
  ) {}

  async validate(
    xml: string,
    ruleId: string,
    businessRuleName: string,
  ): Promise<ValidationResult> {
    // Get or create state
    const state = await this.stateService.getOrCreate(ruleId);
    state.attemptCount++;

    // Parse XML
    const parsed = await this.parseXml(xml);

    // Generate errors based on attempt number
    const errors = this.errorGenerator.generateForAttempt(
      parsed,
      state.attemptCount,
    );

    // Update state
    state.lastValidation = new Date().toISOString();
    state.validationPassed = errors.length === 0;
    await this.stateService.save(state);

    return {
      valid: errors.length === 0,
      errors,
      warnings: this.generateWarnings(parsed),
      validatedAt: state.lastValidation,
      attemptNumber: state.attemptCount,
    };
  }
}
```

### Error Generator Implementation

```typescript
@Injectable()
export class ErrorGenerator {
  generateForAttempt(parsed: any, attemptNumber: number): ValidationError[] {
    switch (attemptNumber) {
      case 1:
        return this.firstAttemptErrors(parsed);
      case 2:
        return this.secondAttemptErrors(parsed);
      case 3:
      default:
        return []; // Success
    }
  }

  private firstAttemptErrors(parsed: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for duplicates
    const ruleCodes = this.extractRuleCodes(parsed);
    const duplicates = this.findDuplicates(ruleCodes);

    duplicates.forEach(code => {
      errors.push({
        line: this.findLineNumber(parsed, code),
        column: 8,
        code: 'DUPLICATE_RULE_CODE',
        message: `RuleCode '${code}' appears multiple times`,
        severity: 'error',
        field: 'RuleCode',
        suggestion: `Make RuleCodes unique. Consider '${code}1', '${code}2'`,
      });
    });

    // Check length
    ruleCodes.forEach((code, index) => {
      if (code.length > 6) {
        errors.push({
          line: index * 10 + 5,
          column: 15,
          code: 'RULE_CODE_TOO_LONG',
          message: `RuleCode '${code}' exceeds 6 characters`,
          severity: 'error',
          field: 'RuleCode',
          suggestion: `Shorten to 6 chars. Example: '${code.substring(0, 6)}'`,
        });
      }
    });

    return errors;
  }

  private secondAttemptErrors(parsed: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check for invalid characters
    const descriptions = this.extractDescriptions(parsed);

    descriptions.forEach((desc, index) => {
      const invalidChars = desc.match(/[^A-Za-z0-9 _-]/g);
      if (invalidChars) {
        errors.push({
          line: index * 10 + 7,
          column: 20,
          code: 'INVALID_CHARACTERS',
          message: `Description contains invalid character '${invalidChars[0]}'`,
          severity: 'error',
          field: 'Description',
          suggestion: 'Remove special characters from description',
        });
      }
    });

    return errors;
  }
}
```

---

## Configuration

### Environment Variables

```env
PORT=3002
NODE_ENV=development

# Validation
MAX_ITERATIONS=3
SIMULATE_DELAYS=true
VALIDATION_DELAY_MS=2000

# Import Jobs
JOB_SIMULATION_DURATION_MS=90000  # 1.5 minutes
```

---

## Testing

### Unit Tests

```typescript
describe('ErrorGenerator', () => {
  it('should return structural errors on first attempt', () => {
    const xml = `<Import><Transaction>...</Transaction></Import>`;
    const errors = generator.generateForAttempt(parsed, 1);
    expect(errors).toContainEqual(
      expect.objectContaining({ code: 'DUPLICATE_RULE_CODE' })
    );
  });

  it('should return business logic errors on second attempt', () => {
    const errors = generator.generateForAttempt(parsed, 2);
    expect(errors).toContainEqual(
      expect.objectContaining({ code: 'INVALID_CHARACTERS' })
    );
  });

  it('should return success on third attempt', () => {
    const errors = generator.generateForAttempt(parsed, 3);
    expect(errors).toHaveLength(0);
  });
});
```

---

## Docker Compose

```yaml
services:
  transformator-mock:
    build: ./transformator-mock-api
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=development
      - PORT=3002
      - MAX_ITERATIONS=3
```

---

## Demo Flow

1. **First Validation** → Returns duplicate and length errors
2. **Fix in VS Code** with Copilot assistance
3. **Second Validation** → Returns special character errors
4. **Fix again** with Copilot
5. **Third Validation** → Success! ✅
6. **Import** → Job created
7. **Poll status** → Job completes successfully

---

**Status**: Ready for Implementation
**Estimated Effort**: 3-4 days
**Priority**: P0 (Required for demo)
