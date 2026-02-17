# Mock Services - NestJS Monorepo

This is a NestJS monorepo containing mock APIs for the VibeTransformer demo.

## 🎯 Purpose

Provide realistic mock APIs that simulate:
1. **Jira API** - Task retrieval and CSV attachments
2. **Transformator API** - XML validation with iteration-based errors

---

## 📁 Structure

```
mock-services/
├── apps/
│   ├── jira-mock/           # Jira Mock API (port 3001)
│   └── transformator-mock/  # Transformator Mock API (port 3002)
├── libs/
│   └── common/              # Shared code (DTOs, utilities)
├── docker-compose.yml       # Docker orchestration
├── nest-cli.json            # NestJS monorepo config
└── package.json             # Workspace dependencies
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **npm** or **yarn**
- **Docker** (for containerized deployment)

### Installation

```bash
# Install dependencies
npm install

# Or using yarn
yarn install
```

### Development Mode

Run both services with hot-reload:

```bash
npm run start:dev
```

Or run individually:

```bash
# Jira Mock only
npm run start:dev:jira

# Transformator Mock only
npm run start:dev:transformator
```

Services will be available at:
- Jira Mock API: http://localhost:3001
- Transformator Mock API: http://localhost:3002

### Production Mode

Build and run:

```bash
# Build all apps
npm run build

# Run in production mode
npm run start:prod
```

### Docker Mode (Recommended for Demo)

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Health Checks

```bash
# Check if services are running
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health
```

---

## 📡 API Documentation

### Swagger UI

Both services provide interactive API documentation:

- **Jira Mock**: http://localhost:3001/api/docs
- **Transformator Mock**: http://localhost:3002/api/docs

### OpenAPI Spec

- **Jira Mock**: http://localhost:3001/api/docs-json
- **Transformator Mock**: http://localhost:3002/api/docs-json

---

## 🔧 Development

### Creating New Endpoints

#### In Jira Mock

```bash
# Generate a new module
cd apps/jira-mock
nest g module users
nest g controller users
nest g service users
```

#### In Transformator Mock

```bash
# Generate a new module
cd apps/transformator-mock
nest g module reports
nest g controller reports
nest g service reports
```

### Using Shared Library

```bash
# Generate shared library code
nest g library common
```

Import in apps:

```typescript
// apps/jira-mock/src/app.module.ts
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
})
export class AppModule {}
```

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests for Specific App

```bash
# Jira Mock tests
npm test -- --testPathPattern=jira-mock

# Transformator Mock tests
npm test -- --testPathPattern=transformator-mock
```

### Test Coverage

```bash
npm run test:cov
```

### E2E Tests

```bash
npm run test:e2e
```

---

## 🐳 Docker

### Build Images

```bash
docker-compose build
```

### Run with Docker Compose

```bash
# Start in detached mode
docker-compose up -d

# Start with logs
docker-compose up

# Stop and remove containers
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Docker Health Checks

Services include health checks that verify:
- HTTP server is responding
- `/api/health` endpoint returns 200

View health status:
```bash
docker-compose ps
```

---

## 📦 Apps Overview

### jira-mock

**Port**: 3001

**Endpoints**:
- `GET /api/v1/issues/:ticketId` - Get issue details
- `GET /api/v1/issues/:ticketId/attachments` - List attachments
- `GET /api/v1/attachments/:attachmentId` - Download attachment
- `GET /api/health` - Health check

**Features**:
- Pre-seeded demo tasks (BR-1234, BR-1235, BR-1236)
- CSV file storage and serving
- In-memory data store

**Spec**: `../docs/specs/api-jira-mock.md`

### transformator-mock

**Port**: 3002

**Endpoints**:
- `POST /api/v1/business-rules/validate` - Validate XML
- `POST /api/v1/business-rules/import` - Import Business Rule
- `GET /api/v1/jobs/:jobId/status` - Get import job status
- `POST /api/v1/dev/reset/:ruleId` - Reset test state (dev only)
- `GET /api/health` - Health check

**Features**:
- Iteration-based error generation
- Stateful validation (tracks attempts per rule)
- XML schema validation
- Job simulation with progress tracking

**Spec**: `../docs/specs/api-transformator-mock.md`

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in root:

```env
# Jira Mock
JIRA_PORT=3001
JIRA_CORS_ORIGIN=*

# Transformator Mock
TRANSFORMATOR_PORT=3002
TRANSFORMATOR_CORS_ORIGIN=*
TRANSFORMATOR_MAX_ITERATIONS=3
```

### NestJS Configuration

Each app has its own configuration:

**apps/jira-mock/src/main.ts**:
```typescript
const port = process.env.JIRA_PORT || 3001;
app.enableCors({
  origin: process.env.JIRA_CORS_ORIGIN || '*',
});
```

**apps/transformator-mock/src/main.ts**:
```typescript
const port = process.env.TRANSFORMATOR_PORT || 3002;
```

---

## 📊 Monorepo Benefits

### Shared Code

Common DTOs, interfaces, and utilities in `libs/common/`:

```typescript
// libs/common/src/dto/error.dto.ts
export class ValidationErrorDto {
  line: number;
  code: string;
  message: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}
```

Used in both apps:

```typescript
// apps/transformator-mock/src/validation/validation.service.ts
import { ValidationErrorDto } from '@app/common';
```

### Unified Build

```bash
# Build all apps at once
npm run build

# Or build individually
npm run build:jira
npm run build:transformator
```

### Consistent Dependencies

Single `package.json` for all apps:
- No version conflicts
- Easier updates
- Smaller total size

---

## 🔍 Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jira Mock",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug:jira"],
      "console": "integratedTerminal"
    },
    {
      "name": "Debug Transformator Mock",
      "type": "node",
      "request": "launch",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "start:debug:transformator"],
      "console": "integratedTerminal"
    }
  ]
}
```

Add debug scripts to `package.json`:
```json
{
  "scripts": {
    "start:debug:jira": "nest start jira-mock --debug --watch",
    "start:debug:transformator": "nest start transformator-mock --debug --watch"
  }
}
```

### Logging

Use NestJS Logger:

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  async validate(xml: string): Promise<ValidationResult> {
    this.logger.log(`Validating XML for rule ${ruleId}`);
    // ...
  }
}
```

View logs:
```bash
# Docker logs
docker-compose logs -f jira-mock
docker-compose logs -f transformator-mock

# Development logs
# Logs appear in terminal
```

---

## 🚀 Deployment

### Docker Deployment

1. **Build images**:
   ```bash
   docker-compose build
   ```

2. **Push to registry** (if needed):
   ```bash
   docker tag vibe-jira-mock:latest registry.example.com/vibe-jira-mock:latest
   docker push registry.example.com/vibe-jira-mock:latest
   ```

3. **Deploy**:
   ```bash
   docker-compose up -d
   ```

### Kubernetes (Future)

Create Kubernetes manifests:

```yaml
# k8s/jira-mock-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jira-mock
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: jira-mock
        image: vibe-jira-mock:latest
        ports:
        - containerPort: 3001
```

### PM2 (Node Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start services
pm2 start npm --name "jira-mock" -- run start:prod:jira
pm2 start npm --name "transformator-mock" -- run start:prod:transformator

# View status
pm2 status

# View logs
pm2 logs
```

---

## 📈 Performance

### Expected Load (Demo)

- **Concurrent users**: 1-5 (demo scenario)
- **Requests per minute**: < 50
- **Response time**: < 100ms (local)

### Optimization (If Needed)

1. **Caching**: Add Redis for validation state
2. **Connection pooling**: If using real databases
3. **Compression**: Enable gzip compression
4. **Rate limiting**: Prevent abuse

```typescript
// Enable compression
import * as compression from 'compression';
app.use(compression());

// Enable rate limiting
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
  ],
})
```

---

## 🔒 Security

### CORS

Configured to allow all origins in development:

```typescript
app.enableCors({
  origin: '*',
});
```

**For production**, restrict to specific origins:

```typescript
app.enableCors({
  origin: ['https://demo.example.com'],
});
```

### Validation

Using `class-validator`:

```typescript
import { IsString, MaxLength } from 'class-validator';

export class ValidateRequestDto {
  @IsString()
  @MaxLength(1000000)
  xml: string;

  @IsString()
  ruleId: string;
}
```

---

## 🧰 Useful Commands

```bash
# Development
npm run start:dev              # Start all services in dev mode
npm run start:dev:jira         # Start Jira mock only
npm run start:dev:transformator # Start Transformator mock only

# Production
npm run build                  # Build all apps
npm run start:prod             # Start all services in prod mode

# Docker
docker-compose up -d           # Start in background
docker-compose logs -f         # View logs
docker-compose down            # Stop and remove containers
docker-compose ps              # View status

# Testing
npm test                       # Run all tests
npm run test:watch             # Run tests in watch mode
npm run test:cov               # Run tests with coverage

# Linting
npm run lint                   # Check code quality
npm run format                 # Auto-format code
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3001
lsof -i :3002

# Kill process
kill -9 <PID>
```

### Docker Issues

```bash
# Remove all containers
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache

# View detailed logs
docker-compose logs -f jira-mock
```

### Module Not Found

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

---

## 🔗 Related Documentation

- **Jira Mock Spec**: `../docs/specs/api-jira-mock.md`
- **Transformator Mock Spec**: `../docs/specs/api-transformator-mock.md`
- **Project Structure**: `../docs/specs/project-structure.md`
- **Demo Workspace**: `../demo-workspace/README.md`

---

**Status**: Development Ready
**Last Updated**: 2026-02-17
