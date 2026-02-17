# VibeTransformer VS Code Extension

VS Code extension that adds chat participant `@vibe-transformer` for Business Rule workflow automation.

## Installation

### One-Time Setup

1. Open demo-workspace in VS Code:
   ```bash
   cd demo-workspace
   code .
   ```

2. Install extension from VSIX:
   - Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux)
   - Type: "Extensions: Install from VSIX"
   - Navigate to: `../vibe-transformer-extension/vibe-transformer-0.1.0.vsix`
   - Click "Install"

3. Reload VS Code:
   - Press `Cmd+Shift+P` → "Developer: Reload Window"

4. Verify installation:
   - Open Copilot Chat (`Cmd+Shift+I`)
   - Type `@vibe-transformer` - should autocomplete

---

## Available Commands

### `@vibe-transformer fetch <ticket-id>`

Fetches Jira task details and CSV attachment.

**Example**:
```
@vibe-transformer fetch BR-1235
```

**Output**:
- Task summary
- Business Rule metadata
- CSV preview
- Button: "Generate XML"

---

### `@vibe-transformer generate`

Generates XML from CSV data.

**Example**:
```
@vibe-transformer generate
```

**Output**:
- Generated XML preview
- Saved to: `output/<ticket-id>.xml`
- Button: "Validate XML"

---

### `@vibe-transformer validate`

Validates XML against Transformator API.

**Example**:
```
@vibe-transformer validate
```

**Output**:
- Validation result (success/errors)
- Error table with line numbers
- Suggestions for fixes
- Button: "Fix Errors" (if errors exist)

---

### `@vibe-transformer fix`

Automatically fixes validation errors.

**Example**:
```
@vibe-transformer fix
```

**Actions**:
- Analyzes validation errors
- Applies fixes based on error codes
- Regenerates XML
- Shows diff of changes

---

### `@vibe-transformer import`

Imports validated Business Rule (Phase 2 feature).

**Example**:
```
@vibe-transformer import
```

**Output**:
- Import job ID
- Progress indicator
- Final status

---

## Features

### 1. Chat Participant Integration

The `@vibe-transformer` participant integrates with GitHub Copilot Chat:
- Context-aware responses
- Remembers previous interactions in session
- Access to workspace files
- API integration (Jira + Transformator)

### 2. Error Panel

Shows validation errors with:
- Line numbers in XML
- Error codes
- Human-readable messages
- Quick fix suggestions

### 3. Status Bar

Bottom status bar shows:
- Current task ID
- Validation status (pending/valid/invalid)
- Attempt number
- Quick access to commands

### 4. Configuration

Settings available in VS Code (`Cmd+,` → search "vibe"):

- `vibeTransformer.jiraApi.url` (default: `http://localhost:3001`)
- `vibeTransformer.transformatorApi.url` (default: `http://localhost:3002`)
- `vibeTransformer.autoFix` (default: `true`)
- `vibeTransformer.outputDirectory` (default: `${workspaceFolder}/output`)

---

## Development

### Building from Source

```bash
cd vibe-transformer-extension

# Install dependencies
npm install

# Build extension
npm run build

# Package as VSIX
npm run package
```

This creates `vibe-transformer-0.1.0.vsix` ready for installation.

### Project Structure

```
vibe-transformer-extension/
├── src/
│   ├── extension.ts              # Entry point
│   ├── chat-participant.ts       # @vibe-transformer implementation
│   ├── commands/
│   │   ├── fetch-task.ts
│   │   ├── generate-xml.ts
│   │   ├── validate-xml.ts
│   │   └── fix-errors.ts
│   ├── api/
│   │   ├── jira-client.ts
│   │   └── transformator-client.ts
│   └── ui/
│       ├── error-panel.ts
│       └── status-bar.ts
├── package.json
├── tsconfig.json
└── vibe-transformer-0.1.0.vsix   # Packaged extension
```

---

## Troubleshooting

### Extension Not Found

**Problem**: `@vibe-transformer` doesn't autocomplete in Copilot Chat

**Solution**:
1. Check installed extensions: `Cmd+Shift+X`
2. Search for "VibeTransformer"
3. Should show as installed
4. If not, reinstall from VSIX

### Commands Not Working

**Problem**: `@vibe-transformer fetch` returns error

**Solution**:
1. Verify mock services are running:
   ```bash
   curl http://localhost:3001/api/health
   curl http://localhost:3002/api/health
   ```
2. Check extension logs: `Cmd+Shift+P` → "Developer: Show Logs" → "Extension Host"
3. Restart extension host: `Cmd+Shift+P` → "Developer: Restart Extension Host"

### API Connection Failed

**Problem**: Extension can't connect to mock APIs

**Solution**:
1. Check VS Code settings: `Cmd+,` → search "vibe"
2. Verify URLs are correct:
   - Jira: `http://localhost:3001`
   - Transformator: `http://localhost:3002`
3. Check CORS is enabled in mock services

---

## Alternative: Without Extension

If you don't want to install the extension, you can still use Copilot Instructions:

1. Copilot automatically reads `.github/copilot-instructions.md`
2. Use regular Copilot Chat (no `@vibe-transformer` prefix)
3. Commands work similarly:
   - "Fetch Jira task BR-1235"
   - "Generate XML from CSV"
   - "Validate this XML"
   - "Fix the validation errors"

The extension just adds convenience:
- ✅ Shorter commands (`@vibe-transformer fetch` vs full sentence)
- ✅ Custom UI (error panel, status bar)
- ✅ Direct API integration
- ✅ Buttons for quick actions

Both approaches work! Extension is optional enhancement.

---

**Status**: To Be Developed (Phase 2)
**Priority**: P1 (Nice to Have)
**Estimated Development**: 3-4 days
