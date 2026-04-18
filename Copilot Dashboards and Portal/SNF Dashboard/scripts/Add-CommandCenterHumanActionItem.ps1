param(
    [Parameter(Mandatory = $true)]
    [string]$Title,
    [Parameter(Mandatory = $true)]
    [string]$Details,
    [string]$Priority = 'High',
    [string]$Owner = 'User',
    [string]$SuggestedAction = '',
    [string]$Source = 'autonomous-orchestrator',
    [string]$QueuePath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\human_action_queue.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$queueDir = Split-Path -Parent $QueuePath
if ($queueDir -and -not (Test-Path -LiteralPath $queueDir)) {
    New-Item -ItemType Directory -Path $queueDir -Force | Out-Null
}

$existing = @()
if (Test-Path -LiteralPath $QueuePath) {
    $existing = @(Import-Csv -LiteralPath $QueuePath)
}

$alreadyOpen = @(
    $existing | Where-Object {
        [string]$_.Status -eq 'Open' -and
        [string]$_.Title -eq $Title -and
        [string]$_.Details -eq $Details
    }
)

if ($alreadyOpen.Count -gt 0) {
    Write-Host "Human action item already exists: $Title"
    exit 0
}

$now = (Get-Date).ToString('s')
$item = [pscustomobject]@{
    Id              = [Guid]::NewGuid().ToString()
    CreatedAt       = $now
    UpdatedAt       = $now
    Status          = 'Open'
    Priority        = $Priority
    Owner           = $Owner
    Title           = $Title
    Details         = $Details
    SuggestedAction = $SuggestedAction
    Source          = $Source
}

$combined = @($existing + $item)
$combined | Export-Csv -LiteralPath $QueuePath -NoTypeInformation -Encoding UTF8
Write-Host "Human action item added: $Title"
Write-Host "Queue path: $QueuePath"


