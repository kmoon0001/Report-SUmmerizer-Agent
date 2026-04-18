param(
    [string]$ProjectRoot = 'C:\Users\kevin\OneDrive\Desktop\SNF Dashboard\SNF-Dashboard'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$topicsDir = Join-Path $ProjectRoot 'topics'
$actionsDir = Join-Path $ProjectRoot 'actions'
$workflowsDir = Join-Path $ProjectRoot 'workflows'

function Get-TriggerPhrases {
    param([string]$RawContent)

    $matches = [regex]::Matches($RawContent, '(?ms)triggerQueries:\s*(.*?)\r?\n\r?\n')
    if ($matches.Count -eq 0) { return @() }
    return @(
        [regex]::Matches($matches[0].Groups[1].Value, '(?m)^\s*-\s+(.+)$') |
            ForEach-Object { $_.Groups[1].Value.Trim() }
    )
}

function Get-YamlValue {
    param(
        [string]$RawContent,
        [string]$Key
    )

    $match = [regex]::Match($RawContent, "(?m)^\s*" + [regex]::Escape($Key) + ":\s*(.+)$")
    if ($match.Success) { return $match.Groups[1].Value.Trim() }
    return ''
}

$errors = [System.Collections.Generic.List[string]]::new()
$warnings = [System.Collections.Generic.List[string]]::new()

$topicFiles = Get-ChildItem -LiteralPath $topicsDir -Filter '*.mcs.yml' -File | Sort-Object Name
foreach ($topic in $topicFiles) {
    $raw = Get-Content -LiteralPath $topic.FullName -Raw
    $description = Get-YamlValue -RawContent $raw -Key 'description'
    $modelDescription = Get-YamlValue -RawContent $raw -Key 'modelDescription'

    if ([string]::IsNullOrWhiteSpace($description)) {
        $errors.Add("Topic missing description: $($topic.Name)") | Out-Null
    }
    if ($modelDescription -notmatch '^(Use this topic when|Use this topic to)') {
        $errors.Add("Topic modelDescription must start with 'Use this topic when' or 'Use this topic to': $($topic.Name)") | Out-Null
    }

    $triggerPhrases = @(Get-TriggerPhrases -RawContent $raw)
    foreach ($phrase in $triggerPhrases) {
        $wordCount = @($phrase -split '\s+' | Where-Object { -not [string]::IsNullOrWhiteSpace($_) }).Count
        if ($wordCount -lt 2) {
            $errors.Add("Topic trigger phrase should avoid single-word phrases: $($topic.Name) -> '$phrase'") | Out-Null
        }
        if ($wordCount -gt 10) {
            $warnings.Add("Topic trigger phrase is long; prefer short phrases: $($topic.Name) -> '$phrase'") | Out-Null
        }
    }
}

$requiredActionOutputs = @(
    'status',
    'summary',
    'confidence',
    'requireshumanreview',
    'datasource',
    'warnings',
    'citations',
    'groundedness_status',
    'verification_status',
    'uncertainty_reason'
)

$actionFiles = Get-ChildItem -LiteralPath $actionsDir -Filter '*.mcs.yml' -File | Sort-Object Name
foreach ($action in $actionFiles) {
    $raw = Get-Content -LiteralPath $action.FullName -Raw
    $modelDescription = Get-YamlValue -RawContent $raw -Key 'modelDescription'
    if ($modelDescription -notmatch '^(Use this action to|Use this action when)') {
        $errors.Add("Action modelDescription must start with 'Use this action to' or 'Use this action when': $($action.Name)") | Out-Null
    }

    $outputs = @(
        [regex]::Matches($raw, '(?m)^\s*-\s+propertyName:\s*(.+)$') |
            ForEach-Object { $_.Groups[1].Value.Trim() }
    )
    $missing = @($requiredActionOutputs | Where-Object { $outputs -notcontains $_ })
    if ($missing.Count -gt 0) {
        $errors.Add("Action missing required shared/guardrail outputs ($($missing -join ', ')): $($action.Name)") | Out-Null
    }
}

$workflowFolders = Get-ChildItem -LiteralPath $workflowsDir -Directory | Sort-Object Name
foreach ($folder in $workflowFolders) {
    if ($folder.Name -notmatch '^SNF-Command-Center-[A-Za-z0-9-]+$') {
        $warnings.Add("Workflow folder naming should follow SNF-Command-Center-* convention: $($folder.Name)") | Out-Null
    }
}

$summary = [pscustomobject]@{
    TopicsScanned = $topicFiles.Count
    ActionsScanned = $actionFiles.Count
    WorkflowsScanned = $workflowFolders.Count
    ErrorCount = $errors.Count
    WarningCount = $warnings.Count
}

$summary | ConvertTo-Json -Depth 4 | Write-Output
if ($warnings.Count -gt 0) {
    Write-Output ("Warnings: " + ($warnings -join ' | '))
}
if ($errors.Count -gt 0) {
    throw ("Copilot authoring compliance failed: " + ($errors -join ' | '))
}

