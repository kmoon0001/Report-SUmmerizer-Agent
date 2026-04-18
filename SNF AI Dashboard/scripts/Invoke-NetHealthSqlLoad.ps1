param(
    [Parameter(Mandatory = $true)]
    [string]$ServerInstance,
    [Parameter(Mandatory = $true)]
    [string]$DatabaseName,
    [Parameter(Mandatory = $true)]
    [string]$InputPath,
    [Parameter(Mandatory = $true)]
    [ValidateSet('TherapyCensus','DocumentationDueDates')]
    [string]$LoadTarget,
    [switch]$UseTrustedConnection = $true,
    [string]$SqlUser,
    [string]$SqlPassword
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$sqlcmd = Get-Command sqlcmd -ErrorAction SilentlyContinue
if (-not $sqlcmd) { throw "sqlcmd was not found on PATH." }

$loadBatchId = & 'D:\SNF AI Dashboard\scripts\Get-NormalizedCsvLoadBatchId.ps1' -Path $InputPath
$procName = switch ($LoadTarget) {
    'TherapyCensus' { 'mart.usp_LoadNetHealthTherapyCensus' }
    'DocumentationDueDates' { 'mart.usp_LoadNetHealthDocumentationDueDates' }
}

$commandText = "EXEC $procName @LoadBatchId = '$loadBatchId';"
$args = @('-S',$ServerInstance,'-d',$DatabaseName,'-b','-Q',$commandText)
if ($UseTrustedConnection) { $args += '-E' } else { $args += @('-U',$SqlUser,'-P',$SqlPassword) }
& $sqlcmd.Source @args
Write-Host "Executed $procName"
Write-Host "LoadBatchId: $loadBatchId"
