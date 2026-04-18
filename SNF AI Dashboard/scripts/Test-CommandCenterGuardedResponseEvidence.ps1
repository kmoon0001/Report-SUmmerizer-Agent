param(
    [string]$Path = 'D:\SNF AI Dashboard\data\processed\command_center_automated_handoff_queue.csv',
    [string]$ContractPath = 'D:\SNF AI Dashboard\contracts\guarded-response-contract.json'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path)) {
    throw "Guarded response queue file not found: $Path"
}

if (-not (Test-Path -LiteralPath $ContractPath)) {
    throw "Guarded response contract file not found: $ContractPath"
}

$rows = @(Import-Csv -LiteralPath $Path)
if ($rows.Count -eq 0) {
    throw "Guarded response queue file is empty: $Path"
}

$contract = Get-Content -LiteralPath $ContractPath -Raw | ConvertFrom-Json
$requiredColumns = @($contract.requiredFields)

$header = @($rows[0].PSObject.Properties.Name)
$missing = @($requiredColumns | Where-Object { $header -notcontains $_ })
if ($missing.Count -gt 0) {
    throw "Guarded response queue is missing required evidence columns: $($missing -join ', ')"
}

$allowedGroundedness = @($contract.allowedGroundednessStatus)
$allowedVerification = @($contract.allowedVerificationStatus)

$invalidGroundedness = @(
    $rows | Where-Object {
        $value = [string]$_.GroundednessStatus
        [string]::IsNullOrWhiteSpace($value) -or ($allowedGroundedness -notcontains $value)
    }
)
if ($invalidGroundedness.Count -gt 0) {
    throw "GroundednessStatus contains unsupported values."
}

$invalidVerification = @(
    $rows | Where-Object {
        $value = [string]$_.VerificationStatus
        [string]::IsNullOrWhiteSpace($value) -or ($allowedVerification -notcontains $value)
    }
)
if ($invalidVerification.Count -gt 0) {
    throw "VerificationStatus contains unsupported values."
}

$verifiedWithoutCitation = @(
    $rows | Where-Object {
        [string]$_.VerificationStatus -eq 'Verified' -and [string]::IsNullOrWhiteSpace([string]$_.Citations)
    }
)
if ($verifiedWithoutCitation.Count -gt 0) {
    throw "Verified rows must include non-empty Citations."
}

$invalidCitationFormat = @()
foreach ($row in $rows) {
    $rawCitations = [string]$row.Citations
    if ([string]::IsNullOrWhiteSpace($rawCitations)) { continue }

    try {
        $parsed = $rawCitations | ConvertFrom-Json -ErrorAction Stop
    }
    catch {
        $invalidCitationFormat += $row
        continue
    }

    $asArray = @($parsed)
    if ($asArray.Count -eq 0) {
        $invalidCitationFormat += $row
        continue
    }

    $missingKeys = $false
    foreach ($citation in $asArray) {
        $sourceId = [string]$citation.sourceId
        $location = [string]$citation.location
        if ([string]::IsNullOrWhiteSpace($sourceId) -or [string]::IsNullOrWhiteSpace($location)) {
            $missingKeys = $true
            break
        }
    }

    if ($missingKeys) {
        $invalidCitationFormat += $row
    }
}
if ($invalidCitationFormat.Count -gt 0) {
    throw "Citations contains invalid JSON format or missing sourceId/location keys."
}

$needsReviewWithoutReason = @(
    $rows | Where-Object {
        [string]$_.VerificationStatus -eq 'NeedsReview' -and [string]::IsNullOrWhiteSpace([string]$_.UncertaintyReason)
    }
)
if ($needsReviewWithoutReason.Count -gt 0) {
    throw "NeedsReview rows must include UncertaintyReason."
}

[pscustomobject]@{
    FilePath = $Path
    ContractPath = $ContractPath
    RowCount = $rows.Count
    MissingRequiredColumns = $missing.Count
    InvalidGroundedness = $invalidGroundedness.Count
    InvalidVerification = $invalidVerification.Count
    VerifiedWithoutCitation = $verifiedWithoutCitation.Count
    InvalidCitationFormat = $invalidCitationFormat.Count
    NeedsReviewWithoutReason = $needsReviewWithoutReason.Count
} | ConvertTo-Json -Depth 4
