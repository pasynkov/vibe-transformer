# Project Structure Specification

## Overview

The project is split into two main directories:
1. **demo-workspace/** - The workspace to open in VS Code for demo
2. **mock-services/** - NestJS monorepo with mock APIs

---

## Root Structure

```
vibe-transformer-2/
├── demo-workspace/              # 🎯 Open this in VS Code for demo
│   ├── .github/
│   │   └── copilot-instructions.md
│   ├── .vscode/
│   │   ├── settings.json
│   │   └── extensions.json
│   ├── templates/
│   │   └── business-rule.xml.template
│   ├── examples/
│   │   ├── example-1-simple/
│   │   ├── example-2-with-errors/
│   │   └── example-3-complex/
│   ├── output/                  # Generated XML files
│   ├── docs/
│   │   └── workflow-guide.md
│   └── README.md
│
├── mock-services/               # 🔧 NestJS Monorepo
│   ├── apps/
│   │   ├── jira-mock/
│   │   │   ├── src/
│   │   │   ├── test/
│   │   │   ├── Dockerfile
│   │   │   └── package.json
│   │   └── transformator-mock/
│   │       ├── src/
│   │       ├── test/
│   │       ├── Dockerfile
│   │       └── package.json
│   ├── libs/                    # Shared libraries (optional)
│   │   └── common/
│   ├── docker-compose.yml
│   ├── nest-cli.json
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── docs/
│   └── specs/                   # All specifications
│
├── .codemie/                    # Template system
│
├── START_HERE.md                # Entry point
├── CLAUDE.md                    # AI assistant guide
└── README.md                    # Project README
```

---

## demo-workspace/

**Purpose**: The working directory that L2 specialists (or demo presenters) open in VS Code.

### Key Features

1. **GitHub Copilot Context**
   - `.github/copilot-instructions.md` - AI instructions
   - `templates/` - XML templates for generation
   - `examples/` - Few-shot learning examples

2. **VS Code Configuration**
   - `.vscode/settings.json` - Workspace settings
   - `.vscode/extensions.json` - Recommended extensions

3. **Working Directories**
   - `output/` - Where generated XML files are saved
   - `docs/` - Workflow guide for humans

### File Structure Detail

```
demo-workspace/
├── .github/
│   └── copilot-instructions.md          # Main Copilot context
│
├── .vscode/
│   ├── settings.json                    # Workspace settings
│   │   - API endpoints configuration
│   │   - File associations
│   │   - Copilot settings
│   └── extensions.json                  # Recommended extensions
│       - GitHub Copilot
│       - VibeTransformer extension (Phase 2)
│
├── templates/
│   └── business-rule.xml.template       # XML template with placeholders
│
├── examples/
│   ├── example-1-simple/
│   │   ├── README.md                    # Example description
│   │   ├── jira-task.json              # Simulated Jira response
│   │   ├── input.csv                    # Input CSV
│   │   └── output.xml                   # Expected output
│   │
│   ├── example-2-with-errors/
│   │   ├── README.md
│   │   ├── jira-task.json
│   │   ├── input.csv
│   │   ├── output-attempt1.xml          # First attempt (with errors)
│   │   ├── errors-attempt1.json         # Validation errors
│   │   ├── output-attempt2.xml          # Second attempt
│   │   ├── errors-attempt2.json
│   │   └── output-final.xml             # Success!
│   │
│   └── example-3-complex/
│       ├── README.md
│       ├── jira-task.json
│       ├── input.csv                    # Larger dataset
│       └── output.xml
│
├── output/                              # Generated files (gitignored)
│   ├── BR-1234.xml
│   ├── BR-1235.xml
│   └── .gitkeep
│
├── docs/
│   └── workflow-guide.md                # Human-readable workflow
│
└── README.md                            # Demo workspace README
```

### .vscode/settings.json

```json
{
  "vibeTransformer.jiraApi.url": "http://localhost:3001",
  "vibeTransformer.transformatorApi.url": "http://localhost:3002",
  "vibeTransformer.autoFix": true,
  "vibeTransformer.outputDirectory": "${workspaceFolder}/output",

  "files.associations": {
    "*.xml": "xml",
    "*.csv": "csv"
  },

  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "markdown": true,
    "xml": true
  }
}
```

### .vscode/extensions.json

```json
{
  "recommendations": [
    "github.copilot",
    "github.copilot-chat",
    "vibe-transformer.vibe-transformer-extension"
  ]
}
```

---

## mock-services/

**Purpose**: NestJS monorepo containing both mock APIs.

### Monorepo Structure

Using **NestJS CLI Monorepo** mode with shared workspace.

```
mock-services/
├── apps/
│   ├── jira-mock/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── issues/
│   │   │   │   ├── issues.controller.ts
│   │   │   │   ├── issues.service.ts
│   │   │   │   └── issues.module.ts
│   │   │   ├── attachments/
│   │   │   │   ├── attachments.controller.ts
│   │   │   │   └── attachments.service.ts
│   │   │   └── data/
│   │   │       ├── seed-data.ts
│   │   │       └── csv-files/
│   │   ├── test/
│   │   ├── Dockerfile
│   │   └── tsconfig.app.json
│   │
│   └── transformator-mock/
│       ├── src/
│       │   ├── main.ts
│       │   ├── app.module.ts
│       │   ├── validation/
│       │   │   ├── validation.controller.ts
│       │   │   ├── validation.service.ts
│       │   │   ├── validation.module.ts
│       │   │   └── validators/
│       │   ├── import/
│       │   │   ├── import.controller.ts
│       │   │   └── import.service.ts
│       │   ├── jobs/
│       │   │   ├── jobs.controller.ts
│       │   │   └── jobs.service.ts
│       │   └── state/
│       │       └── validation-state.service.ts
│       ├── test/
│       ├── Dockerfile
│       └── tsconfig.app.json
│
├── libs/                        # Shared libraries (optional)
│   └── common/
│       ├── src/
│       │   ├── index.ts
│       │   ├── dto/             # Shared DTOs
│       │   ├── interfaces/      # Shared interfaces
│       │   └── utils/           # Shared utilities
│       └── tsconfig.lib.json
│
├── docker-compose.yml
├── nest-cli.json
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
└── README.md
```

### package.json (Monorepo Root)

```json
{
  "name": "vibe-transformer-mock-services",
  "version": "1.0.0",
  "description": "Mock services for VibeTransformer demo",
  "private": true,
  "workspaces": [
    "apps/*",
    "libs/*"
  ],
  "scripts": {
    "build": "nest build",
    "build:jira": "nest build jira-mock",
    "build:transformator": "nest build transformator-mock",

    "start:dev": "concurrently \"npm run start:dev:jira\" \"npm run start:dev:transformator\"",
    "start:dev:jira": "nest start jira-mock --watch",
    "start:dev:transformator": "nest start transformator-mock --watch",

    "start:prod": "concurrently \"npm run start:prod:jira\" \"npm run start:prod:transformator\"",
    "start:prod:jira": "node dist/apps/jira-mock/main",
    "start:prod:transformator": "node dist/apps/transformator-mock/main",

    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",

    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",

    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\""
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "xml2js": "^0.6.0",
    "fast-xml-parser": "^4.3.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.0.0",
    "concurrently": "^8.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0"
  }
}
```

### nest-cli.json

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "apps/",
  "monorepo": true,
  "root": "apps/",
  "compilerOptions": {
    "webpack": true,
    "tsConfigPath": "apps/"
  },
  "projects": {
    "jira-mock": {
      "type": "application",
      "root": "apps/jira-mock",
      "entryFile": "main",
      "sourceRoot": "apps/jira-mock/src",
      "compilerOptions": {
        "tsConfigPath": "apps/jira-mock/tsconfig.app.json"
      }
    },
    "transformator-mock": {
      "type": "application",
      "root": "apps/transformator-mock",
      "entryFile": "main",
      "sourceRoot": "apps/transformator-mock/src",
      "compilerOptions": {
        "tsConfigPath": "apps/transformator-mock/tsconfig.app.json"
      }
    },
    "common": {
      "type": "library",
      "root": "libs/common",
      "entryFile": "index",
      "sourceRoot": "libs/common/src",
      "compilerOptions": {
        "tsConfigPath": "libs/common/tsconfig.lib.json"
      }
    }
  }
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  jira-mock:
    build:
      context: .
      dockerfile: apps/jira-mock/Dockerfile
    container_name: vibe-jira-mock
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - CORS_ORIGIN=*
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - vibe-network

  transformator-mock:
    build:
      context: .
      dockerfile: apps/transformator-mock/Dockerfile
    container_name: vibe-transformator-mock
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
      - PORT=3002
      - CORS_ORIGIN=*
      - MAX_ITERATIONS=3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3002/api/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - vibe-network

networks:
  vibe-network:
    driver: bridge
```

---

## Demo Workflow

### Setup (One-time)

```bash
# 1. Start mock services
cd mock-services
npm install
docker-compose up -d

# 2. Verify services are running
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health

# 3. Open demo workspace in VS Code
cd ../demo-workspace
code .
```

### During Demo

**In VS Code** (demo-workspace opened):

1. GitHub Copilot reads `.github/copilot-instructions.md` automatically
2. User interacts with Copilot Chat
3. Copilot calls mock APIs (localhost:3001, 3002)
4. Generated XMLs saved to `output/`

**Mock services** run in background (Docker):
- Jira Mock API: http://localhost:3001
- Transformator Mock API: http://localhost:3002
- Swagger docs: /api/docs

---

## Development Workflow

### Working on Mock Services

```bash
cd mock-services

# Install dependencies
npm install

# Start in dev mode (hot reload)
npm run start:dev

# Or start individual services
npm run start:dev:jira
npm run start:dev:transformator

# Run tests
npm test

# Build for production
npm run build

# Docker
npm run docker:up
npm run docker:logs
npm run docker:down
```

### Working on Demo Workspace

```bash
cd demo-workspace

# Just open in VS Code
code .

# Test Copilot instructions
# - Open Copilot Chat
# - Try: "Fetch task BR-1234"
# - Verify Copilot uses context correctly
```

---

## File Ownership & Responsibilities

### demo-workspace/

**Owned by**: AI/Copilot Integration Developer

**Responsibilities**:
- Write comprehensive Copilot instructions
- Create XML templates
- Prepare few-shot examples
- Configure VS Code settings

**Key Files**:
- `.github/copilot-instructions.md` - MOST IMPORTANT
- `templates/business-rule.xml.template`
- `examples/` - Quality matters

### mock-services/

**Owned by**: Backend Developer

**Responsibilities**:
- Implement NestJS APIs
- Create seed data
- Write tests
- Docker configuration

**Key Directories**:
- `apps/jira-mock/` - Jira API implementation
- `apps/transformator-mock/` - Transformator API implementation
- `libs/common/` - Shared code

---

## Git Strategy

### .gitignore

```gitignore
# Demo workspace
demo-workspace/output/*
!demo-workspace/output/.gitkeep
demo-workspace/.vscode/*.log

# Mock services
mock-services/node_modules/
mock-services/dist/
mock-services/coverage/
mock-services/.env

# IDE
.idea/
*.swp
*.swo
.DS_Store
```

### Branches

- `main` - Stable, ready for demo
- `develop` - Active development
- `feature/jira-mock` - Jira API development
- `feature/transformator-mock` - Transformator API development
- `feature/copilot-integration` - Copilot instructions

---

## CI/CD (Future)

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test-mock-services:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: cd mock-services && npm ci
      - name: Run tests
        run: cd mock-services && npm test
      - name: Build
        run: cd mock-services && npm run build

  test-docker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Start services
        run: cd mock-services && docker-compose up -d
      - name: Wait for health checks
        run: sleep 10
      - name: Test endpoints
        run: |
          curl -f http://localhost:3001/api/health
          curl -f http://localhost:3002/api/health
```

---

## Documentation Structure

### READMEs

Each directory has its own README:

- **`/README.md`** - Project overview, quick start
- **`/demo-workspace/README.md`** - Demo workspace guide
- **`/mock-services/README.md`** - API development guide
- **`/docs/specs/README.md`** - Specifications index

### Specs Mapping

| Component | Spec File |
|-----------|-----------|
| Project structure | `project-structure.md` (this file) |
| Demo workspace | `copilot-integration.md` |
| Jira Mock API | `api-jira-mock.md` |
| Transformator Mock | `api-transformator-mock.md` |
| Overall project | `project-overview.md` |

---

## Benefits of This Structure

### Separation of Concerns

✅ **Demo workspace** = Client-side concerns
- Copilot context
- Templates
- Examples
- User workspace

✅ **Mock services** = Server-side concerns
- API implementation
- Data management
- Testing
- Deployment

### Easy Demo

1. Open `demo-workspace/` in VS Code
2. Services already running (Docker)
3. Start using Copilot immediately

### Scalable Development

- Teams can work independently
- Clear boundaries
- Easy to test in isolation
- Simple deployment

---

## Migration from Old Structure

If you had files in wrong places:

```bash
# Move Copilot instructions
mv .github/copilot-instructions.md demo-workspace/.github/

# Move templates
mv templates/* demo-workspace/templates/

# Move examples
mv examples/* demo-workspace/examples/

# Create mock services structure
mkdir -p mock-services/apps/{jira-mock,transformator-mock}
```

---

**Status**: Structure Defined
**Next Step**: Populate directories with actual code
