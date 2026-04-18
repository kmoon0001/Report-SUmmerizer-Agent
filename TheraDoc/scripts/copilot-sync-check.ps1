param(
    [string]$Root = ".",
    [switch]$ResetSyncState,
    [switch]$SkipRemote
)

$ErrorActionPreference = "Stop"
$resolvedRoot = (Resolve-Path $Root).Path
Set-Location $resolvedRoot

function Write-Section {
    param([string]$Name)
    Write-Host ""
    Write-Host "== $Name =="
}

function Info {
    param([string]$Message)
    Write-Host "INFO: $Message" -ForegroundColor Cyan
}

function Warn {
    param([string]$Message)
    Write-Host "WARN: $Message" -ForegroundColor Yellow
}

function Fail {
    param([string]$Message)
    Write-Host "FAIL: $Message" -ForegroundColor Red
    exit 1
}

Write-Section "Workspace"
Write-Host "Root: $resolvedRoot"

$preflight = Join-Path $resolvedRoot "scripts\copilot-preflight.ps1"
if (-not (Test-Path $preflight)) {
    Fail "Missing scripts\\copilot-preflight.ps1"
}

Write-Section "Preflight"
& powershell -ExecutionPolicy Bypass -File $preflight
if ($LASTEXITCODE -ne 0) {
    Fail "Preflight failed. Resolve local integrity first."
}

if ($ResetSyncState) {
    Write-Section "Reset Sync State"
    $mcsDir = Join-Path $resolvedRoot ".mcs"
    if (-not (Test-Path $mcsDir)) {
        Fail "Missing .mcs directory"
    }

    $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $trackPath = Join-Path $mcsDir "filechangetrack.json"
    $tokenPath = Join-Path $mcsDir "changetoken.txt"

    if (Test-Path $trackPath) {
        Copy-Item -LiteralPath $trackPath -Destination ("{0}.bak-{1}" -f $trackPath, $stamp) -Force
    }
    "{}" | Set-Content -LiteralPath $trackPath -Encoding utf8
    Info "Reset .mcs/filechangetrack.json"

    if (Test-Path $tokenPath) {
        Copy-Item -LiteralPath $tokenPath -Destination ("{0}.bak-{1}" -f $tokenPath, $stamp) -Force
        Remove-Item -LiteralPath $tokenPath -Force
        Info "Removed .mcs/changetoken.txt"
    } else {
        Info "No changetoken.txt found"
    }
}

Write-Section "Connection"
$connPath = Join-Path $resolvedRoot ".mcs\conn.json"
if (-not (Test-Path $connPath)) {
    Fail "Missing .mcs\\conn.json"
}
$conn = Get-Content -Raw $connPath | ConvertFrom-Json
if (-not $conn.AgentId -or -not $conn.EnvironmentId -or -not $conn.DataverseEndpoint) {
    Fail "conn.json missing AgentId/EnvironmentId/DataverseEndpoint"
}
$envGuid = ($conn.EnvironmentId -replace '^Default-', '')
Write-Host "AgentId: $($conn.AgentId)"
Write-Host "EnvironmentId(raw): $($conn.EnvironmentId)"
Write-Host "EnvironmentId(guid): $envGuid"
Write-Host "DataverseEndpoint: $($conn.DataverseEndpoint)"

Write-Section "PAC Profile"
& pac auth list
if ($LASTEXITCODE -ne 0) {
    Fail "pac auth list failed"
}
& pac auth who
if ($LASTEXITCODE -ne 0) {
    Warn "pac auth who failed"
}

Write-Section "Copilot Presence"
& pac copilot list --environment $conn.DataverseEndpoint
if ($LASTEXITCODE -ne 0) {
    Fail "pac copilot list failed"
}

Write-Section "Flow References"
$flowRefs = @()
Get-ChildItem -Path "actions","topics" -Filter *.mcs.yml -File | ForEach-Object {
    $lineNo = 0
    Get-Content $_.FullName | ForEach-Object {
        $lineNo++
        if ($_ -match '^\s*flowId:\s*([0-9a-fA-F-]{36})\s*$') {
            $flowRefs += $matches[1].ToLower()
        }
    }
}
$flowRefs = $flowRefs | Sort-Object -Unique
if (-not $flowRefs) {
    Warn "No flowId references found in actions/topics"
} else {
    Write-Host "Referenced flow IDs:"
    $flowRefs | ForEach-Object { Write-Host "- $_" }
}

if (-not $SkipRemote -and $flowRefs) {
    Write-Section "Remote Flow Verification"
    $az = Get-Command az -ErrorAction SilentlyContinue
    if (-not $az) {
        Warn "Azure CLI not found; skipping remote workflow verification"
    } else {
        $token = az account get-access-token --resource $conn.DataverseEndpoint --query accessToken -o tsv 2>$null
        if (-not $token) {
            Warn "Could not get Dataverse token from Azure CLI; skipping remote workflow verification"
        } else {
            $headers = @{
                Authorization = "Bearer $token"
                Accept = "application/json"
                'OData-MaxVersion' = '4.0'
                'OData-Version' = '4.0'
            }
            $base = ($conn.DataverseEndpoint.TrimEnd('/')) + "/api/data/v9.2"
            $missing = @()
            $placeholderRemote = @()
            foreach ($fid in $flowRefs) {
                $uri = "$base/workflows($fid)?`$select=workflowid,name,statecode,statuscode,category,clientdata"
                try {
                    $w = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
                    Write-Host ("FOUND {0} | {1} | state={2} status={3} category={4}" -f $fid, $w.name, $w.statecode, $w.statuscode, $w.category)
                    if ($w.clientdata -match 'YOUR-AZURE-OPENAI-KEY|YOUR-RESOURCE-NAME\.openai\.azure\.com') {
                        $placeholderRemote += $fid
                        Write-Host ("WARN: {0} has placeholder endpoint/secret patterns in remote clientdata." -f $fid) -ForegroundColor Yellow
                    }
                } catch {
                    $missing += $fid
                    Write-Host ("MISSING {0}" -f $fid) -ForegroundColor Yellow
                }
            }

            if ($missing.Count -gt 0) {
                Warn "Some referenced flow IDs are missing remotely. Run Get/Preview/Apply in Copilot Studio and re-run this script."
                Write-Host "Missing flow IDs:"
                $missing | ForEach-Object { Write-Host "- $_" }
            } else {
                Info "All referenced flow IDs exist in Dataverse."
            }

            if ($placeholderRemote.Count -gt 0) {
                Warn "One or more remote flows still contain placeholder endpoint/secret patterns."
                Write-Host "Placeholder remote flow IDs:"
                $placeholderRemote | Sort-Object -Unique | ForEach-Object { Write-Host "- $_" }
            }
        }
    }
}

Write-Section "Next Steps"
Write-Host "1) In VS Code, run: Copilot Studio: Get changes"
Write-Host "2) Run: Copilot Studio: Preview changes"
Write-Host "3) Run: Copilot Studio: Apply changes"
Write-Host "4) Run: pac copilot publish --environment $($conn.DataverseEndpoint) --bot $($conn.AgentId)"
Write-Host "5) Run: pac copilot list --environment $($conn.DataverseEndpoint)"

Write-Host ""
Write-Host "Sync check completed." -ForegroundColor Green
exit 0
