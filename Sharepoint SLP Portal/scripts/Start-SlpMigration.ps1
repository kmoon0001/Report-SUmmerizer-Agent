Param(
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$preflightScript = Join-Path $PSScriptRoot "Test-SlpMigrationPreflight.ps1"
$exportScript = Join-Path $PSScriptRoot "Export-SlpListSchema.ps1"

& $preflightScript -ProjectRoot $ProjectRoot
if ($LASTEXITCODE -ne 0) {
    throw "Preflight failed. Resolve failed checks before continuing."
}

& $exportScript -ProjectRoot $ProjectRoot
if ($LASTEXITCODE -ne 0) {
    throw "Schema export failed."
}

$runlogDir = Join-Path $ProjectRoot "docs/runlogs"
New-Item -ItemType Directory -Path $runlogDir -Force | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$runlogPath = Join-Path $runlogDir "migration-next-$timestamp.md"

$generatedAt = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
$content = @'
# SLP Migration Next Actions

Generated: __GENERATED_AT__

## Immediate Work Queue

1. Create SharePoint lists from schema CSV in `docs/contracts/csv`.
2. Create/confirm SharePoint library `SLP_ClinicalKnowledge`.
3. Implement Power App MVP screens:
   - Intake form -> `SLP_Patients`
   - Session note form -> `SLP_SessionNotes`
4. Build Power Automate review flow:
   - Trigger on new session note
   - Route to supervisor
   - Update `SLP_ReviewQueue` and note review fields
5. Run UAT pass for workflow:
   - Intake -> Note -> Review -> Approval

## Artifacts

- Migration matrix: `docs/sharepoint-migration-matrix.md`
- List schema json: `docs/contracts/sharepoint-list-schemas.json`
- List schema csv: `docs/contracts/csv/*.csv`
'@

$content = $content -replace "__GENERATED_AT__", $generatedAt

Set-Content -LiteralPath $runlogPath -Value $content -Encoding UTF8

Write-Host ""
Write-Host "Migration starter completed." -ForegroundColor Green
Write-Host "Runlog: $runlogPath"
Write-Host ""
Write-Host "Next: Create SharePoint lists from docs/contracts/csv/*.csv" -ForegroundColor Cyan
