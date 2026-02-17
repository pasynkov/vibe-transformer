# Phase 3: VS Code Extension (Optional)

**Duration**: 4 days (6 iterations)
**Status**: ⏳ Not Started (0/6 done)
**Goal**: Build VS Code Extension with chat participant `@vibe-transformer`

**Note**: This phase is optional. The MVP (Phases 1-2) is fully functional without the extension.

---

## Iterations

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

## Phase 3 Progress

```
Iteration 3.1: ⬜ Extension Scaffold
Iteration 3.2: ⬜ Chat Participant Registration
Iteration 3.3: ⬜ API Client Implementation
Iteration 3.4: ⬜ Commands Implementation
Iteration 3.5: ⬜ UI Components
Iteration 3.6: ⬜ Package Extension

Progress: 0/6 (0%)
```

---

**Prerequisites**: Phase 2 must be complete
**Optional**: This phase can be skipped. The MVP works without the extension using only Copilot Instructions.
**Next**: After Phase 3 (or skipping it), proceed to Phase 4
