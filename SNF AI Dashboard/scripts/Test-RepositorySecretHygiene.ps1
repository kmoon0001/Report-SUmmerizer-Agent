param(
    [string]$ProjectRoot = 'D:\SNF AI Dashboard'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$excludedPathTokens = @(
    '\.git\',
    '\node_modules\',
    '\.playwright-mcp\',
    '\.venv',
    '\.codacy\',
    '\data\exports\',
    '\data\processed\',
    '\playwright-report\',
    '\test-results\',
    '\tmp\'
)

$allowlistFiles = @(
    (Join-Path $ProjectRoot '.env.example')
)

$regexes = @(
    '(?i)\bgh[pousr]_[A-Za-z0-9]{30,}\b',
    '(?i)\b(sk|rk)_(live|test)_[A-Za-z0-9]{16,}\b',
    '(?i)\b(?:api[_-]?key|access[_-]?token|bearer[_ -]?token|client[_-]?secret|password|passwd|pwd)\b\s*[:=]\s*["'']?[^\s"'']{8,}$',
    '(?i)\bAZURE_OPENAI_API_KEY\s*=\s*[^\s]{8,}$',
    '(?i)\bPOWERBI_CLIENT_SECRET\s*=\s*[^\s]{8,}$',
    '(?i)\bGRAPH_CLIENT_SECRET\s*=\s*[^\s]{8,}$',
    '(?i)\bDATAVERSE_CLIENT_SECRET\s*=\s*[^\s]{8,}$',
    '(?i)\bFHIR_CLIENT_SECRET\s*=\s*[^\s]{8,}$'
)

$findings = New-Object System.Collections.Generic.List[object]

$files = Get-ChildItem -LiteralPath $ProjectRoot -Recurse -File -ErrorAction SilentlyContinue
foreach ($file in $files) {
    $fullPath = $file.FullName

    if ($allowlistFiles -contains $fullPath) { continue }
    if ($excludedPathTokens | Where-Object { $fullPath -like "*$_*" }) { continue }
    if ($file.Length -gt 2MB) { continue }

    $lines = @()
    try {
        $lines = @(Get-Content -LiteralPath $fullPath -ErrorAction Stop)
    }
    catch {
        continue
    }

    if ($null -eq $lines -or $lines.Count -eq 0) { continue }

    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = [string]$lines[$i]
        if ([string]::IsNullOrWhiteSpace($line)) { continue }

        foreach ($regex in $regexes) {
            if ($line -match $regex) {
                $findings.Add([pscustomobject]@{
                    Path    = $fullPath
                    Line    = ($i + 1)
                    Pattern = $regex
                    Snippet = $line.Trim()
                }) | Out-Null
            }
        }
    }
}

if ($findings.Count -gt 0) {
    $summary = @($findings | Select-Object -First 10 | ForEach-Object { "$($_.Path):$($_.Line) [$($_.Snippet)]" }) -join ' | '
    throw "Potential secrets found ($($findings.Count)). $summary"
}

Write-Host 'Repository secret hygiene scan passed.'
Write-Host "Project root: $ProjectRoot"
