param(
    [switch]$SkipPac
)

$ErrorActionPreference = "Stop"

function Add-Issue {
    param(
        [string]$Message
    )

    $script:Issues.Add($Message) | Out-Null
}

function Add-WarningMessage {
    param(
        [string]$Message
    )

    $script:Warnings.Add($Message) | Out-Null
}

function Get-MetadataValue {
    param(
        [string]$Path,
        [string]$Key
    )

    $line = Select-String -Path $Path -Pattern ("^{0}:\s*(.+)$" -f [regex]::Escape($Key)) | Select-Object -First 1
    if (-not $line) {
        return $null
    }

    return $line.Matches[0].Groups[1].Value.Trim()
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$connPath = Join-Path $repoRoot ".mcs\conn.json"

if (-not (Test-Path $connPath)) {
    throw "Missing .mcs\conn.json at $connPath"
}

$Issues = New-Object System.Collections.Generic.List[string]
$Warnings = New-Object System.Collections.Generic.List[string]

$conn = Get-Content -Raw $connPath | ConvertFrom-Json
$expectedEnvironmentId = $conn.EnvironmentId
$expectedEnvironmentUrl = $conn.DataverseEndpoint.TrimEnd("/")
$expectedBotId = $conn.AgentId

$workflowMetadata = Get-ChildItem (Join-Path $repoRoot "workflows") -Recurse -Filter metadata.yml
$workflowIds = @{}

foreach ($file in $workflowMetadata) {
    $workflowId = Get-MetadataValue -Path $file.FullName -Key "workflowId"
    if ($workflowId) {
        $workflowIds[$workflowId] = $file.FullName
    }
}

$referenceFiles = @()
$referenceFiles += Get-ChildItem (Join-Path $repoRoot "actions") -Filter *.mcs.yml -ErrorAction SilentlyContinue
$referenceFiles += Get-ChildItem (Join-Path $repoRoot "topics") -Filter *.mcs.yml -ErrorAction SilentlyContinue

$references = foreach ($file in $referenceFiles) {
    Select-String -Path $file.FullName -Pattern "flowId:\s*([0-9a-fA-F-]+)" | ForEach-Object {
        [pscustomobject]@{
            Path = $file.FullName
            FlowId = $_.Matches[0].Groups[1].Value
            Line = $_.LineNumber
        }
    }
}

foreach ($reference in $references) {
    if (-not $workflowIds.ContainsKey($reference.FlowId)) {
        Add-Issue ("Missing workflow for flowId {0} referenced by {1}:{2}" -f $reference.FlowId, $reference.Path, $reference.Line)
    }
}

$malformedLines = Get-ChildItem (Join-Path $repoRoot "topics") -Filter *.mcs.yml -ErrorAction SilentlyContinue |
    Select-String -Pattern "^- kind: (InvokeFlowAction|BeginDialog|SendActivity|ConditionGroup|Question)"

foreach ($line in $malformedLines) {
    Add-Issue ("Malformed top-level action indentation in {0}:{1}" -f $line.Path, $line.LineNumber)
}

$suspiciousBindingLines = Get-ChildItem (Join-Path $repoRoot "topics") -Filter *.mcs.yml -ErrorAction SilentlyContinue |
    Select-String -Pattern '^\s+"?outputs\('

foreach ($line in $suspiciousBindingLines) {
    Add-Issue ("Suspicious expression-shaped topic output binding in {0}:{1}" -f $line.Path, $line.LineNumber)
}

$suspiciousWorkflowSchemaLines = Get-ChildItem (Join-Path $repoRoot "workflows") -Recurse -Filter workflow.json |
    Select-String -Pattern '"outputs\('

foreach ($line in $suspiciousWorkflowSchemaLines) {
    Add-Issue ("Suspicious expression-shaped workflow response property in {0}:{1}" -f $line.Path, $line.LineNumber)
}

$topicFiles = Get-ChildItem (Join-Path $repoRoot "topics") -Filter *.mcs.yml -ErrorAction SilentlyContinue
foreach ($file in $topicFiles) {
    $content = Get-Content -Raw $file.FullName
    $definedQuestionIds = [System.Collections.Generic.HashSet[string]]::new()
    foreach ($match in [regex]::Matches($content, '(?m)^\s+id:\s+(question_[A-Za-z0-9]+)\s*$')) {
        [void]$definedQuestionIds.Add($match.Groups[1].Value)
    }

    foreach ($match in [regex]::Matches($content, "question_[A-Za-z0-9]+")) {
        $questionId = $match.Value
        if (-not $definedQuestionIds.Contains($questionId)) {
            Add-Issue ("Condition or expression references missing question id {0} in {1}" -f $questionId, $file.FullName)
        }
    }
}

$undefinedContentVersion = Get-ChildItem (Join-Path $repoRoot "workflows") -Recurse -Filter workflow.json |
    Select-String -Pattern '"contentVersion"\s*:\s*"undefined"'

foreach ($line in $undefinedContentVersion) {
    Add-WarningMessage ("Workflow uses contentVersion=`"undefined`" in {0}:{1}" -f $line.Path, $line.LineNumber)
}

if (-not $SkipPac) {
    try {
        $authOutput = & pac auth list 2>&1
        if ($LASTEXITCODE -ne 0) {
            Add-Issue ("pac auth list failed: {0}" -f ($authOutput -join " "))
        } else {
            $activeRow = $authOutput | Where-Object { $_ -match '^\[\d+\]\s+\*' } | Select-Object -First 1
            if (-not $activeRow) {
                Add-Issue("No active PAC profile found.")
            } else {
                $activeUrl = ($activeRow -split '\s{2,}')[-1].Trim().TrimEnd("/")
                if ($activeUrl -ne $expectedEnvironmentUrl) {
                    Add-Issue ("Active PAC environment URL mismatch. Expected {0} but found {1}" -f $expectedEnvironmentUrl, $activeUrl)
                }
            }
        }
    } catch {
        Add-Issue ("pac auth list failed: {0}" -f $_.Exception.Message)
    }

    try {
        $listOutput = & pac copilot list --environment $expectedEnvironmentId 2>&1
        if ($LASTEXITCODE -ne 0) {
            Add-Issue ("pac copilot list failed for environment {0}: {1}" -f $expectedEnvironmentId, ($listOutput -join " "))
        } else {
            $botFound = $false
            foreach ($line in $listOutput) {
                if ($line -match [regex]::Escape($expectedBotId)) {
                    $botFound = $true
                    break
                }
            }

            if (-not $botFound) {
                Add-Issue ("Bot {0} not visible in environment {1}" -f $expectedBotId, $expectedEnvironmentId)
            }
        }
    } catch {
        Add-Issue ("pac copilot list failed: {0}" -f $_.Exception.Message)
    }
}

Write-Host "Copilot preflight"
Write-Host ("EnvironmentId: {0}" -f $expectedEnvironmentId)
Write-Host ("EnvironmentUrl: {0}" -f $expectedEnvironmentUrl)
Write-Host ("BotId: {0}" -f $expectedBotId)
Write-Host ("Workflow count: {0}" -f $workflowIds.Count)
Write-Host ("Flow references checked: {0}" -f @($references).Count)

if ($Warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "Warnings:"
    foreach ($warning in $Warnings) {
        Write-Host ("- {0}" -f $warning)
    }
}

if ($Issues.Count -gt 0) {
    Write-Host ""
    Write-Host "Issues:"
    foreach ($issue in $Issues) {
        Write-Host ("- {0}" -f $issue)
    }

    exit 1
}

Write-Host ""
Write-Host "Preflight passed."
