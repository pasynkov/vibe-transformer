# Jira Mock API Specification

## Overview

REST API microservice that emulates Jira's API endpoints for retrieving Business Rule tasks and CSV attachments.

**Technology**: NestJS + TypeScript
**Port**: 3001
**Purpose**: Provide realistic demo data for AI workflow demonstration

---

## API Endpoints

### 1. Get Issue by ID

**Endpoint**: `GET /api/v1/issues/:ticketId`

**Description**: Retrieve Jira issue details including Business Rule metadata

**Path Parameters**:
- `ticketId` (string, required) - Jira ticket ID (e.g., "BR-1234")

**Response**: `200 OK`

```typescript
{
  "id": "10001",
  "key": "BR-1234",
  "summary": "Create Business Rule: Employee Positions",
  "description": "Create a new Business Rule for employee positions...",
  "status": "In Progress",
  "assignee": {
    "name": "john.doe",
    "displayName": "John Doe",
    "email": "john.doe@company.com"
  },
  "created": "2026-02-15T10:00:00Z",
  "updated": "2026-02-16T14:30:00Z",
  "customFields": {
    "businessRuleName": "CO_EmployeePositions",
    "countryCode": "USA",
    "transactionType": "SIMPLERULE",
    "targetEnvironment": "DEV"
  },
  "attachments": [
    {
      "id": "att-001",
      "filename": "positions.csv",
      "mimeType": "text/csv",
      "size": 1024,
      "created": "2026-02-15T10:05:00Z",
      "downloadUrl": "/api/v1/attachments/att-001"
    }
  ]
}
```

**Error Responses**:
- `404 Not Found` - Issue not found
- `500 Internal Server Error` - Server error

---

### 2. List Issue Attachments

**Endpoint**: `GET /api/v1/issues/:ticketId/attachments`

**Description**: List all attachments for a specific issue

**Path Parameters**:
- `ticketId` (string, required) - Jira ticket ID

**Response**: `200 OK`

```typescript
{
  "attachments": [
    {
      "id": "att-001",
      "filename": "positions.csv",
      "mimeType": "text/csv",
      "size": 1024,
      "created": "2026-02-15T10:05:00Z",
      "downloadUrl": "/api/v1/attachments/att-001"
    }
  ],
  "total": 1
}
```

---

### 3. Download Attachment

**Endpoint**: `GET /api/v1/attachments/:attachmentId`

**Description**: Download attachment file content

**Path Parameters**:
- `attachmentId` (string, required) - Attachment ID

**Response**: `200 OK`
- **Content-Type**: `text/csv` (or appropriate MIME type)
- **Body**: Raw file content

```csv
RuleCode,Description
BHS1,Behavior Intervention Specialist 1
BHS2,Behavior Intervention Specialist 2
COUNS,School Counselor
PSYCH,School Psychologist
SLPA,Speech Language Pathology Assistant
```

**Error Responses**:
- `404 Not Found` - Attachment not found

---

### 4. Search Issues (Optional)

**Endpoint**: `GET /api/v1/issues`

**Description**: Search for issues by criteria

**Query Parameters**:
- `status` (string, optional) - Filter by status
- `assignee` (string, optional) - Filter by assignee
- `limit` (number, optional, default: 10) - Max results

**Response**: `200 OK`

```typescript
{
  "issues": [/* array of issue objects */],
  "total": 5,
  "page": 1,
  "pageSize": 10
}
```

---

## Data Models

### Issue Model

```typescript
interface JiraIssue {
  id: string;
  key: string;              // Format: BR-\d{4}
  summary: string;
  description: string;      // Markdown format
  status: IssueStatus;
  assignee: User | null;
  created: string;          // ISO 8601 datetime
  updated: string;          // ISO 8601 datetime
  customFields: BusinessRuleFields;
  attachments: Attachment[];
}

type IssueStatus =
  | 'To Do'
  | 'In Progress'
  | 'In Review'
  | 'Done'
  | 'Blocked';

interface BusinessRuleFields {
  businessRuleName: string;    // Format: CO_[Name]
  countryCode: string;          // ISO country code
  transactionType: string;      // Always "SIMPLERULE"
  targetEnvironment: string;    // DEV, UAT, PROD
}

interface User {
  name: string;
  displayName: string;
  email: string;
}

interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;              // Bytes
  created: string;           // ISO 8601 datetime
  downloadUrl: string;       // Relative URL
}
```

---

## Demo Data Seeds

### Seed 1: Employee Positions (BR-1234)

**Issue**:
- **Key**: BR-1234
- **Summary**: Create Business Rule: Employee Positions
- **Business Rule Name**: CO_EmployeePositions
- **Status**: In Progress

**CSV** (`positions.csv`):
```csv
RuleCode,Description
BHS1,Behavior Intervention Specialist 1
BHS2,Behavior Intervention Specialist 2
COUNS,School Counselor
PSYCH,School Psychologist
SLPA,Speech Language Pathology Assistant
```

**Expected Complexity**: Simple (5 rows, no errors expected)

---

### Seed 2: Department Codes (BR-1235)

**Issue**:
- **Key**: BR-1235
- **Summary**: Create Business Rule: Department Codes
- **Business Rule Name**: CO_DepartmentCodes
- **Status**: To Do

**CSV** (`departments.csv`):
```csv
RuleCode,Description
ADMIN,Administration
ADMIN,Administrative Services
HR,Human Resources
IT-SUP,IT Support
IT-DEV,IT Development
SALES,Sales Department
```

**Expected Complexity**: Medium (6 rows, has duplicate ADMIN - will trigger error)

---

### Seed 3: Large Position Codes (BR-1236)

**Issue**:
- **Key**: BR-1236
- **Summary**: Create Business Rule: Extended Position Codes
- **Business Rule Name**: CO_ExtendedPositions
- **Status**: To Do

**CSV** (`extended-positions.csv`):
```csv
RuleCode,Description
POS001,Position with code exactly 6 chars
POSITION001,Position with code too long (will fail)
P1,Position with code too short
VALID1,Valid Position Code
SPECIAL!,Position with invalid character
```

**Expected Complexity**: High (multiple validation errors)

---

## Implementation Details

### Technology Stack

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Project Structure

```
jira-mock-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── issues/
│   │   ├── issues.controller.ts
│   │   ├── issues.service.ts
│   │   ├── issues.module.ts
│   │   └── dto/
│   │       ├── issue.dto.ts
│   │       └── attachment.dto.ts
│   ├── attachments/
│   │   ├── attachments.controller.ts
│   │   └── attachments.service.ts
│   └── data/
│       ├── seed-data.ts           # Pre-defined demo issues
│       └── csv-files/              # CSV file storage
│           ├── positions.csv
│           ├── departments.csv
│           └── extended-positions.csv
├── Dockerfile
├── docker-compose.yml
└── package.json
```

### Module Structure

```typescript
// issues.module.ts
@Module({
  imports: [],
  controllers: [IssuesController],
  providers: [IssuesService],
  exports: [IssuesService],
})
export class IssuesModule {}
```

### Controller Implementation Pattern

```typescript
// issues.controller.ts
@Controller('api/v1/issues')
@ApiTags('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get(':ticketId')
  @ApiOperation({ summary: 'Get issue by ID' })
  @ApiResponse({ status: 200, description: 'Issue found', type: IssueDto })
  @ApiResponse({ status: 404, description: 'Issue not found' })
  async getIssue(@Param('ticketId') ticketId: string): Promise<IssueDto> {
    const issue = await this.issuesService.findById(ticketId);
    if (!issue) {
      throw new NotFoundException(`Issue ${ticketId} not found`);
    }
    return issue;
  }
}
```

### Service Implementation Pattern

```typescript
// issues.service.ts
@Injectable()
export class IssuesService {
  private issues: Map<string, JiraIssue> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData(): void {
    // Load from seed-data.ts
    SEED_ISSUES.forEach(issue => {
      this.issues.set(issue.key, issue);
    });
  }

  async findById(ticketId: string): Promise<JiraIssue | null> {
    return this.issues.get(ticketId) || null;
  }

  async findAll(filters?: IssueFilters): Promise<JiraIssue[]> {
    let results = Array.from(this.issues.values());

    if (filters?.status) {
      results = results.filter(i => i.status === filters.status);
    }

    return results;
  }
}
```

---

## Configuration

### Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=*

# Logging
LOG_LEVEL=debug
```

### Docker Configuration

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/main"]
```

---

## API Documentation

- **Swagger UI**: `http://localhost:3001/api/docs`
- **OpenAPI Spec**: `http://localhost:3001/api/docs-json`

---

## Testing

### Unit Tests

```typescript
describe('IssuesController', () => {
  it('should return issue BR-1234', async () => {
    const issue = await controller.getIssue('BR-1234');
    expect(issue.key).toBe('BR-1234');
    expect(issue.customFields.businessRuleName).toBe('CO_EmployeePositions');
  });

  it('should throw 404 for non-existent issue', async () => {
    await expect(controller.getIssue('BR-9999'))
      .rejects.toThrow(NotFoundException);
  });
});
```

### Integration Tests

Test full workflow:
1. GET issue
2. GET attachments
3. Download CSV
4. Verify CSV content

---

## Deployment

### Docker Compose

```yaml
services:
  jira-mock:
    build: ./jira-mock-api
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
    volumes:
      - ./jira-mock-api/src/data:/app/src/data
```

### Running Locally

```bash
# Install dependencies
npm install

# Run in dev mode
npm run start:dev

# Run in production
npm run build
npm run start:prod
```

---

## Future Enhancements

1. **Authentication**: Add API token validation
2. **Pagination**: Support large result sets
3. **Webhooks**: Simulate Jira webhooks for updates
4. **Comments**: Support issue comments
5. **Transitions**: Simulate status transitions
6. **Rich text**: Support Jira markdown in descriptions

---

**Status**: Ready for Implementation
**Estimated Effort**: 2-3 days
**Priority**: P0 (Required for demo)
