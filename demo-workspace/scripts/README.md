# Helper Scripts for VibeTransformer Workflow

Bash scripts to automate common tasks in the Business Rule creation workflow.

## 📋 Available Scripts

### 1. fetch-task.sh
Fetch Jira task and download CSV attachment.

```bash
./fetch-task.sh BR-1234
```

**Output**:
- `input-BR-1234.csv` - Downloaded CSV data
- `metadata-BR-1234.json` - Task metadata (business rule name, country, etc.)

### 2. generate-xml.sh
Generate XML from CSV and metadata.

```bash
./generate-xml.sh BR-1234
```

**Input**:
- `input-BR-1234.csv`
- `metadata-BR-1234.json`

**Output**:
- `output/output-BR-1234.xml` - Generated XML file

### 3. validate-xml.sh
Validate XML against Transformator API.

```bash
./validate-xml.sh BR-1234
```

**Input**:
- `output/output-BR-1234.xml`
- `metadata-BR-1234.json`

**Output**:
- Validation result (console)
- `validation-result-BR-1234-attempt1.json` - Full validation result

### 4. import-xml.sh
Import Business Rule to Transformator.

```bash
./import-xml.sh BR-1234 DEV
```

**Input**:
- `output/output-BR-1234.xml`
- `metadata-BR-1234.json`

**Output**:
- Import progress (real-time)
- `import-result-BR-1234.json` - Final import result

### 5. poll-job.sh
Poll job status until completion.

```bash
./poll-job.sh job-abc-123
```

**Output**:
- Real-time progress updates
- Final job result (JSON)

## 🚀 Quick Workflow

Complete workflow in 4 commands:

```bash
# 1. Fetch task
./fetch-task.sh BR-1234

# 2. Generate XML
./generate-xml.sh BR-1234

# 3. Validate (repeat until valid)
./validate-xml.sh BR-1234

# 4. Import
./import-xml.sh BR-1234 DEV
```

## 🔧 Requirements

- `curl` - HTTP requests
- `jq` - JSON parsing
- Bash 4.0+

## 📝 Files Created

After running the complete workflow:

```
demo-workspace/
├── input-BR-1234.csv              # Downloaded CSV
├── metadata-BR-1234.json          # Task metadata
├── output/
│   └── output-BR-1234.xml         # Generated XML
├── validation-result-BR-1234-attempt1.json  # Validation results
├── validation-result-BR-1234-attempt2.json
├── validation-result-BR-1234-attempt3.json
└── import-result-BR-1234.json     # Import result
```

## 🐛 Troubleshooting

### Services not running

```bash
cd ../mock-services
docker compose ps
docker compose up -d
```

### Check API health

```bash
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health
```

### Validation fails repeatedly

Check the validation result JSON:
```bash
cat validation-result-BR-1234-attempt1.json | jq '.errors[]'
```

Fix errors in the XML file manually, then validate again.

## 💡 Tips

- **Scripts are idempotent** - safe to run multiple times
- **Use with GitHub Copilot** - Ask Copilot to run these scripts
- **Chain commands** - Use `&&` to run sequentially
- **Check exit codes** - Scripts exit with non-zero on errors

## 🎓 Example Session

```bash
# Start fresh
cd demo-workspace/scripts

# Fetch and preview
./fetch-task.sh BR-1235
head input-BR-1235.csv

# Generate and preview
./generate-xml.sh BR-1235
head -30 output/output-BR-1235.xml

# Validate (expect errors on first attempt)
./validate-xml.sh BR-1235
# Attempt 1: ❌ 2 errors

# Fix XML manually based on suggestions
# Then validate again
./validate-xml.sh BR-1235
# Attempt 2: ❌ 1 error

# Fix remaining error
# Validate one more time
./validate-xml.sh BR-1235
# Attempt 3: ✅ Success!

# Import to DEV
./import-xml.sh BR-1235 DEV
# 🎉 Import completed!
```

---

**Need help?** Refer to the main [demo-workspace README](../README.md) or [Copilot Instructions](../.github/copilot-instructions.md).
