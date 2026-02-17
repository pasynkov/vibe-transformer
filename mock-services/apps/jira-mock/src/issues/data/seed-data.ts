import { IssueDto } from '../dto/issue.dto';

export const SEED_ISSUES: IssueDto[] = [
  // BR-1234: Employee Positions (Simple, clean data)
  {
    id: '10001',
    key: 'BR-1234',
    summary: 'Create Business Rule: Employee Positions [0 ошибок]',
    description: `# Business Rule Request

Create a new Business Rule for employee positions in the school district.

## Requirements

- Business Rule Name: CO_EmployeePositions
- Country: USA
- Transaction Type: SIMPLERULE

## Data Source

See attached CSV file with position codes and descriptions.

## Acceptance Criteria

- All position codes imported successfully
- Validation passes in Transformator
- No duplicate codes
`,
    status: 'In Progress',
    assignee: {
      name: 'john.doe',
      displayName: 'John Doe',
      email: 'john.doe@schooldistrict.edu',
    },
    created: '2026-02-15T10:00:00Z',
    updated: '2026-02-16T14:30:00Z',
    customFields: {
      businessRuleName: 'CO_EmployeePositions',
      countryCode: 'USA',
      transactionType: 'SIMPLERULE',
      targetEnvironment: 'DEV',
    },
    attachments: [
      {
        id: 'att-001',
        filename: 'positions.csv',
        mimeType: 'text/csv',
        size: 245,
        created: '2026-02-15T10:05:00Z',
        downloadUrl: '/api/v1/attachments/att-001',
      },
    ],
  },

  // BR-1235: Department Codes (With errors - main demo example)
  {
    id: '10002',
    key: 'BR-1235',
    summary: 'Create Business Rule: Department Codes [3 ошибки]',
    description: `# Business Rule Request

Create Business Rule for department codes.

## Requirements

- Business Rule Name: CO_DepartmentCodes
- Country: USA
- Transaction Type: SIMPLERULE

## Data Source

See attached CSV. **Note**: Data quality issues may exist - please validate carefully.

## Acceptance Criteria

- All valid department codes imported
- Duplicates resolved
- Invalid characters removed
`,
    status: 'In Progress',
    assignee: {
      name: 'john.doe',
      displayName: 'John Doe',
      email: 'john.doe@schooldistrict.edu',
    },
    created: '2026-02-16T09:00:00Z',
    updated: '2026-02-16T15:00:00Z',
    customFields: {
      businessRuleName: 'CO_DepartmentCodes',
      countryCode: 'USA',
      transactionType: 'SIMPLERULE',
      targetEnvironment: 'DEV',
    },
    attachments: [
      {
        id: 'att-002',
        filename: 'departments.csv',
        mimeType: 'text/csv',
        size: 198,
        created: '2026-02-16T09:05:00Z',
        downloadUrl: '/api/v1/attachments/att-002',
      },
    ],
  },

  // BR-1236: Teacher Certifications (Complex, 15 records)
  {
    id: '10003',
    key: 'BR-1236',
    summary: 'Create Business Rule: Teacher Certifications [0 ошибок]',
    description: `# Business Rule Request

Create comprehensive Business Rule for teacher certification codes.

## Requirements

- Business Rule Name: CO_TeacherCertifications
- Country: USA
- Transaction Type: SIMPLERULE

## Data Source

See attached CSV with 15 certification types.

## Acceptance Criteria

- All certification codes imported
- Codes follow state requirements
- Ready for production deployment
`,
    status: 'In Progress',
    assignee: {
      name: 'sarah.smith',
      displayName: 'Sarah Smith',
      email: 'sarah.smith@schooldistrict.edu',
    },
    created: '2026-02-17T08:00:00Z',
    updated: '2026-02-17T09:00:00Z',
    customFields: {
      businessRuleName: 'CO_TeacherCertifications',
      countryCode: 'USA',
      transactionType: 'SIMPLERULE',
      targetEnvironment: 'PROD',
    },
    attachments: [
      {
        id: 'att-003',
        filename: 'certifications.csv',
        mimeType: 'text/csv',
        size: 512,
        created: '2026-02-17T08:10:00Z',
        downloadUrl: '/api/v1/attachments/att-003',
      },
    ],
  },
];

// Map for quick lookup by ticket key
export const ISSUES_MAP = new Map<string, IssueDto>(
  SEED_ISSUES.map((issue) => [issue.key, issue]),
);
