// CSV file contents stored as constants for reliability
// In a real system, these would be read from a database or file system

export const CSV_FILES: Record<string, { filename: string; content: string }> = {
  'att-001': {
    filename: 'positions.csv',
    content: `RuleCode,Description
BHS1,Behavior Intervention Specialist 1
BHS2,Behavior Intervention Specialist 2
COUNS,School Counselor
PSYCH,School Psychologist
SLPA,Speech Language Pathology Assistant
`,
  },
  'att-002': {
    filename: 'departments.csv',
    content: `RuleCode,Description
ADMIN,Administration
ADMIN,Administrative Services
HR,Human Resources
POSITION001,IT Support Position
P1,Sales Department
SPECIAL!,Special Projects
`,
  },
  'att-003': {
    filename: 'certifications.csv',
    content: `RuleCode,Description
ELEM,Elementary Education K-6
SPED,Special Education K-12
MATH,Secondary Mathematics 7-12
ENG,Secondary English Language Arts 7-12
SCI,Secondary Science 7-12
SOC,Secondary Social Studies 7-12
PE,Physical Education K-12
MUSIC,Music Education K-12
ART,Visual Arts K-12
ESL,English as Second Language K-12
READ,Reading Specialist K-12
ADMIN,School Administration PreK-12
GUID,School Guidance Counselor K-12
LIBR,School Librarian PreK-12
TECH,Educational Technology Specialist
`,
  },
};
