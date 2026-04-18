param(
    [Parameter(Mandatory = $true)]
    [string]$ServerInstance,

    [Parameter(Mandatory = $true)]
    [string]$DatabaseName,

    [string]$InputPath = 'D:\my agents copilot studio\SNF Dashboard\data\processed\pcc_resident_list_current.active-only.csv',

    [switch]$UseTrustedConnection = $true,

    [string]$SqlUser,

    [string]$SqlPassword
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$sqlcmd = Get-Command sqlcmd -ErrorAction SilentlyContinue
if (-not $sqlcmd) {
    throw "sqlcmd was not found on PATH. Install SQL Server command line tools before using this load script."
}

$loadBatchId = & 'D:\my agents copilot studio\SNF Dashboard\scripts\Get-PccResidentCensusLoadBatchId.ps1' -Path $InputPath
if ([string]::IsNullOrWhiteSpace($loadBatchId)) {
    throw "Could not determine LoadBatchId from $InputPath"
}

$commandText = "EXEC mart.usp_LoadPccResidentCensus @LoadBatchId = '$loadBatchId';"
$args = @(
    '-S', $ServerInstance,
    '-d', $DatabaseName,
    '-b',
    '-Q', $commandText
)

if ($UseTrustedConnection) {
    $args += '-E'
} else {
    if ([string]::IsNullOrWhiteSpace($SqlUser) -or [string]::IsNullOrWhiteSpace($SqlPassword)) {
        throw "SqlUser and SqlPassword are required when UseTrustedConnection is disabled."
    }
    $args += @('-U', $SqlUser, '-P', $SqlPassword)
}

& $sqlcmd.Source @args

Write-Host "Executed mart.usp_LoadPccResidentCensus"
Write-Host "LoadBatchId: $loadBatchId"

