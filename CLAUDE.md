# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**vibe-transformer-2** is an AI adoption demonstration project that automates L2 specialist workflows for UKG Pro Business Rule creation using GitHub Copilot integration.

**Primary Purpose**: Demo AI-assisted workflow that reduces Business Rule creation time from 20 minutes to 5 minutes (75% improvement).

**Secondary Purpose**: Contains reusable documentation templates (CodeMie extension) for generating Claude Code documentation.

**⚡ Quick Start**: Read [`START_HERE.md`](START_HERE.md) for project overview and navigation guide.

---

## Repository Structure

```
vibe-transformer-2/
├── demo-workspace/                    # 🎯 VS Code workspace for demo
│   ├── .github/
│   │   └── copilot-instructions.md    # Copilot context (auto-loaded)
│   ├── .vscode/
│   │   ├── settings.json              # API endpoints config
│   │   └── extensions.json            # Recommended extensions
│   ├── templates/
│   │   └── business-rule.xml.template # XML generation template
│   ├── examples/                      # Few-shot learning examples
│   │   ├── example-1-simple/
│   │   ├── example-2-with-errors/
│   │   └── example-3-complex/
│   ├── output/                        # Generated XML files (gitignored)
│   └── README.md                      # Demo workspace guide
│
├── mock-services/                     # 🔧 NestJS Monorepo
│   ├── apps/
│   │   ├── jira-mock/                 # Jira Mock API (port 3001)
│   │   │   ├── src/
│   │   │   ├── Dockerfile
│   │   │   └── package.json
│   │   └── transformator-mock/        # Transformator API (port 3002)
│   │       ├── src/
│   │       ├── Dockerfile
│   │       └── package.json
│   ├── libs/common/                   # Shared libraries
│   ├── docker-compose.yml
│   ├── nest-cli.json
│   ├── package.json
│   └── README.md                      # API development guide
│
├── docs/
│   └── specs/                         # Project specifications
│       ├── README.md                  # Specs navigator
│       ├── executive-summary.md       # High-level overview
│       ├── project-overview.md        # Complete requirements
│       ├── project-structure.md       # Folder structure explained
│       ├── api-jira-mock.md          # Jira API spec
│       ├── api-transformator-mock.md # Transformator API spec
│       ├── copilot-integration.md    # Copilot integration spec
│       └── implementation-roadmap.md # Development plan
│
├── .codemie/                          # Template system
│   ├── claude.extension.json
│   └── claude-templates/
│       ├── README.md
│       └── templates/
│           ├── CLAUDE.md.template
│           ├── agents/
│           └── guides/
│
├── START_HERE.md                      # 🚀 Entry point
├── CLAUDE.md                          # This file
└── README.md                          # Project README
```

---

## Template System Components

### 1. Main Template
- **CLAUDE.md.template**: AI-optimized execution guide with task classifier, workflow gates, and guide imports
- Contains placeholders like `[PROJECT_NAME]`, `[LANGUAGE]`, `[FRAMEWORK]` to be replaced during generation

### 2. Guide Templates (9 categories)
Each guide template follows AI-first writing principles:
- Pattern-first (code before explanation)
- Example-driven (real code examples)
- Highly structured (tables, code blocks, lists)
- Project-specific placeholders for customization

### 3. Agent Templates (4 types)
Specialized behavior patterns for different AI agent roles:
- Code review agent
- Refactoring agent
- Solution architect agent
- Unit testing agent

---

## Working with Templates

### Reading Templates
All template files use this placeholder convention:
- `[PLACEHOLDER]` = Required value, must be replaced
- `[PLACEHOLDER?]` = Optional value, delete if not applicable
- `# FILL IN` = Section requiring project-specific content
- `<!-- INSTRUCTION -->` = LLM instructions for populating template

### Modifying Templates

When editing templates:

1. **Preserve placeholder format**: Keep `[BRACKETS]` for values to be filled
2. **Follow AI-first principles**: Pattern-first, example-driven, structured
3. **Keep generic**: Templates should work across different tech stacks
4. **Document placeholders**: Add comments explaining what should fill each placeholder
5. **Test with multiple projects**: Verify template works for different languages/frameworks

### Adding New Templates

To add a new guide template:

1. Create file in appropriate category: `.codemie/claude-templates/templates/guides/[category]/[name].md.template`
2. Follow existing template structure:
   - Quick Summary section
   - Prerequisites
   - 3-5 main patterns with code examples
   - Best practices (DO/DON'T tables)
   - Integration section (links to related patterns)
   - References
3. Use standard placeholders: `[PROJECT_NAME]`, `[LANGUAGE]`, `[FRAMEWORK]`, etc.
4. Add project-specific markers: `# FILL IN` for sections needing analysis
5. Update `.codemie/claude-templates/README.md` to document the new template

---

## Project Components

### 1. demo-workspace/

**Purpose**: The workspace L2 specialists open in VS Code to work with GitHub Copilot.

**Key Files**:
- `.github/copilot-instructions.md` - Main AI context (automatically loaded by Copilot)
- `templates/business-rule.xml.template` - XML generation template
- `examples/` - Few-shot learning examples for Copilot

**Usage**:
```bash
cd demo-workspace
code .
# Copilot automatically reads instructions
```

**See**: `demo-workspace/README.md` for demo workflow

### 2. mock-services/

**Purpose**: NestJS monorepo with mock APIs that simulate Jira and Transformator.

**Structure**:
- `apps/jira-mock/` - Jira Mock API (port 3001)
- `apps/transformator-mock/` - Transformator Mock API (port 3002)
- `docker-compose.yml` - Orchestration

**Usage**:
```bash
cd mock-services
docker-compose up -d
# APIs available at localhost:3001 and localhost:3002
```

**See**: `mock-services/README.md` for development guide

---

## Working with Specifications

### Specifications Directory

The `docs/specs/` directory is the **central location** for all project specifications and requirements documents.

**Purpose**:
- Store feature specifications and requirements
- Document API contracts and data models
- Maintain design decisions and architectural specifications
- Track requirement changes and updates

### Workflow for Specifications

**When creating features or making changes:**

1. **Check for existing specs first**: Always read relevant specifications from `docs/specs/` before starting implementation
2. **Create new specs when needed**: Document new features or significant changes in `docs/specs/`
3. **Update specs during development**: Keep specifications in sync with actual implementation
4. **Reference specs in code**: Link to specification files in comments where appropriate

### Specification File Naming

Use clear, descriptive names:
- `feature-[name].md` - Feature specifications
- `api-[endpoint-name].md` - API endpoint specifications
- `data-model-[name].md` - Data model and schema specifications
- `architecture-[component].md` - Architectural design documents

### Specification Template

When creating new specifications in `docs/specs/`, include:

```markdown
# [Feature/Component Name]

## Overview
Brief description of what this specifies

## Requirements
- Functional requirements
- Non-functional requirements (performance, security, etc.)

## Design
- Architecture decisions
- Data models
- API contracts
- Integration points

## Implementation Notes
- Technical considerations
- Dependencies
- Migration strategy (if applicable)

## Testing Strategy
- Test scenarios
- Acceptance criteria

## References
- Related specifications
- External documentation
```

### Reading Specifications

**Before any implementation task**:
1. Use `Glob` to find relevant specs: `Glob pattern="docs/specs/*.md"`
2. Read applicable specification files with `Read`
3. Clarify any ambiguities with the user before proceeding
4. Follow the requirements and design documented in specs

---

## Key Files to Reference

### Primary Documentation
- `.codemie/claude-templates/README.md` - Complete template system documentation
  - Template writing best practices
  - Placeholder conventions
  - Usage examples for Python, TypeScript, Java projects
  - Troubleshooting guide
- `docs/specs/README.md` - Specifications directory guide and workflow

### Specifications
All project specifications are in `docs/specs/`
- **executive-summary.md** - High-level overview and architecture decisions
- **project-overview.md** - Complete project requirements and workflow
- **project-structure.md** - Folder structure and organization explained
- **api-jira-mock.md** - Jira Mock API specification
- **api-transformator-mock.md** - Transformator Mock API specification
- **copilot-integration.md** - GitHub Copilot and VS Code Extension specs
- **implementation-roadmap.md** - Development timeline, phases, and risks
- Check this directory FIRST before implementing features
- Create new specs for new features or significant changes
- Keep specs updated with implementation changes

### Template Files
All templates are in `.codemie/claude-templates/templates/`
- Start with `CLAUDE.md.template` to understand main structure
- Review guide templates in `guides/` for pattern documentation structure
- Check agent templates in `agents/` for specialized AI behavior patterns

---

## Template Design Principles

### 1. AI-First Writing
- **Dense information**: High signal per line
- **Pattern-first**: Show code before explaining
- **Example-driven**: Minimum 3 examples per pattern
- **Structured**: Use tables, lists, code blocks (not prose)

### 2. Placeholder Strategy
- Use placeholders for project-specific terms: `[DATABASE_NAME]`, `[TEST_FRAMEWORK]`
- Use `# FILL IN` for sections requiring codebase analysis
- Keep 80% generic, 20% customizable
- Always include source references: `# Source: [file.ext:lines]`

### 3. Code Example Guidelines
- Show complete, runnable examples (not toy code)
- Keep examples under 20 lines
- Always reference source file and line numbers
- Use real patterns from actual codebases

---

## Extension Metadata

The `.codemie/claude.extension.json` file tracks:
- Template version (currently 1.0.6)
- Installation timestamp
- Should not be manually edited

---

## Template Categories

### Development Templates
- `development-practices.md.template` - General development patterns
- Setup, configuration, and workflow patterns

### Architecture Templates
- `architecture.md.template` - Layered architecture, project structure
- Directory organization and module boundaries

### API Templates
- `api-patterns.md.template` - REST/GraphQL endpoint patterns
- Request/response formats, validation, error handling

### Data Templates
- `database-patterns.md.template` - ORM patterns, queries, transactions
- Repository patterns, migrations, schema design

### Testing Templates
- `testing-patterns.md.template` - Unit/integration test patterns
- Fixtures, mocking, test organization

### Standards Templates
- `code-quality.md.template` - Linting, formatting, type safety
- `git-workflow.md.template` - Branching strategy, commit conventions

### Security Templates
- `security-practices.md.template` - Authentication, validation, encryption
- Input sanitization, secure patterns

### Integration Templates
- `external-integrations.md.template` - Third-party service patterns
- API clients, webhooks, event handling

---

## Making Changes

### For Demo Workspace (Copilot Integration)
1. **Copilot Instructions**: Edit `demo-workspace/.github/copilot-instructions.md`
   - Add new patterns
   - Update validation rules
   - Improve error suggestions
2. **Templates**: Modify `demo-workspace/templates/business-rule.xml.template`
3. **Examples**: Add examples to `demo-workspace/examples/`
4. **Test**: Open in VS Code and verify Copilot behavior

### For Mock Services (APIs)
1. **Development**: Use `npm run start:dev` in `mock-services/`
2. **Add Endpoints**: Use NestJS generators (`nest g`)
3. **Seed Data**: Modify files in `apps/*/src/data/`
4. **Test**: Run `npm test`
5. **Docker**: Build with `docker-compose build`

### For Template System
1. Read `.codemie/claude-templates/README.md` first
2. Understand the 5-phase generation process
3. Follow the decision gate structure
4. Update README if adding new categories or templates

### For Specifications
1. Update relevant spec in `docs/specs/`
2. Follow template structure (`.template-example.md`)
3. Update `docs/specs/README.md` if adding new specs
4. Keep specs in sync with implementation

---

## Distribution

This template repository can be:
1. Copied into new projects as a starting point
2. Used as a reference for creating project-specific templates
3. Extended with custom templates for specific tech stacks or patterns
4. Distributed as a package for team-wide documentation standards

---

## Notes

- This is a templates-only repository (no actual code)
- Templates are language-agnostic and framework-agnostic
- Designed to support Python, TypeScript, Java, Go, Rust, and other major languages
- Based on successful documentation patterns from the CodeMie project
- **Always check `docs/specs/` for requirements before implementing features**
