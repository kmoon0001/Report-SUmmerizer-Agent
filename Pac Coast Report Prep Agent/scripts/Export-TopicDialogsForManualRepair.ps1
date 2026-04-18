param(
    [string]$ProjectRoot = "D:\Report SUmmerizer Agent\SNF Rehab Agent",
    [string]$OutputDir = "D:\Report SUmmerizer Agent\exports\manual-repair\dialogs",
    [string[]]$Topics = @(
        "ClassifyAndRouteRehabRecord",
        "EvalAnalysis",
        "ProgressAnalysis",
        "RecertAnalysis",
        "DischargeAnalysis",
        "Search"
    )
)

$ErrorActionPreference = "Stop"

function Info($m) { Write-Host "[INFO] $m" -ForegroundColor Cyan }
function Ok($m) { Write-Host "[OK]   $m" -ForegroundColor Green }
function Fail($m) { Write-Host "[FAIL] $m" -ForegroundColor Red; exit 1 }

$topicsPath = Join-Path $ProjectRoot "topics"
if (-not (Test-Path $topicsPath)) { Fail "Topics path not found: $topicsPath" }

New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

$manifest = New-Object System.Collections.Generic.List[object]

foreach ($topic in $Topics) {
    $topicPath = Join-Path $topicsPath "$topic.mcs.yml"
    if (-not (Test-Path $topicPath)) {
        Write-Host "[WARN] Topic file missing: $topicPath" -ForegroundColor Yellow
        continue
    }

    $raw = Get-Content -Raw $topicPath
    $start = $raw.IndexOf("kind: AdaptiveDialog")
    if ($start -lt 0) {
        Write-Host "[WARN] No dialog block found in: $topicPath" -ForegroundColor Yellow
        continue
    }

    $dialog = $raw.Substring($start).TrimEnd()
    $outPath = Join-Path $OutputDir "$topic.dialog.yml"
    Set-Content -LiteralPath $outPath -Value $dialog -Encoding UTF8

    $manifest.Add([pscustomobject]@{
        Topic  = $topic
        Source = $topicPath
        Dialog = $outPath
    }) | Out-Null
}

$manifestPath = Join-Path $OutputDir "dialog-manifest.json"
$manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $manifestPath -Encoding UTF8

Ok "Exported $($manifest.Count) topic dialog file(s) to: $OutputDir"
Ok "Manifest: $manifestPath"
