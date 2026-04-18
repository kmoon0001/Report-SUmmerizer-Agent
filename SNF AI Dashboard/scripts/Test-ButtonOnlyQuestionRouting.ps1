param(
    [string]$TopicsRoot = 'D:\SNF AI Dashboard\topics'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $TopicsRoot)) {
    throw "Topics root not found: $TopicsRoot"
}

$allowedEntityKinds = @(
    'DynamicClosedListEntity',
    'BooleanPrebuiltEntity'
)

$issues = New-Object System.Collections.Generic.List[string]

$topicFiles = @(Get-ChildItem -LiteralPath $TopicsRoot -Filter '*.mcs.yml' -File | Sort-Object Name)
foreach ($file in $topicFiles) {
    $lines = @(Get-Content -LiteralPath $file.FullName)
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = [string]$lines[$i]
        if ($line -notmatch '^\s*-\s*kind:\s*Question\s*$') { continue }

        $questionLine = $i + 1
        $hasEntity = $false
        $entityKind = ''
        for ($j = $i + 1; $j -lt $lines.Count; $j++) {
            $next = [string]$lines[$j]
            if ($next -match '^\s*-\s*kind:\s*\w+') { break }
            if ($next -match '^\s*entity:\s*(\w+)\s*$') {
                $hasEntity = $true
                $entityKind = $Matches[1]
                break
            }
            if ($next -match '^\s*entity:\s*$') {
                $hasEntity = $true
                for ($k = $j + 1; $k -lt $lines.Count; $k++) {
                    $entityLine = [string]$lines[$k]
                    if ($entityLine -match '^\s*-\s*kind:\s*\w+') { break }
                    if ($entityLine -match '^\s*kind:\s*(\w+)\s*$') {
                        $entityKind = $Matches[1]
                        break
                    }
                }
                break
            }
        }

        if (-not $hasEntity) {
            $issues.Add(("{0}:{1} Question node has no entity definition (potential open text)." -f $file.Name, $questionLine)) | Out-Null
            continue
        }

        if ([string]::IsNullOrWhiteSpace($entityKind)) {
            $issues.Add(("{0}:{1} Question node entity kind could not be resolved." -f $file.Name, $questionLine)) | Out-Null
            continue
        }

        if ($allowedEntityKinds -notcontains $entityKind) {
            $issues.Add(("{0}:{1} Question entity kind '{2}' is not in button-only allowlist ({3})." -f $file.Name, $questionLine, $entityKind, ($allowedEntityKinds -join ', '))) | Out-Null
        }
    }
}

if ($issues.Count -gt 0) {
    throw "Button-only question routing check failed: $($issues -join ' | ')"
}

Write-Host 'Button-only question routing check passed.'
Write-Host "Topics scanned: $($topicFiles.Count)"
