param(
    [Parameter(Mandatory = $true)]
    [string]$ServerInstance,

    [Parameter(Mandatory = $true)]
    [string]$DatabaseName,

    [switch]$UseTrustedConnection = $true,

    [string]$SqlUser,

    [string]$SqlPassword,

    [string]$PccInputPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.active-only.csv',

    [string]$DocumentationInputPath = 'D:\SNF AI Dashboard\data\processed\nethealth_documentation_due_dates.normalized.csv',

    [string]$TherapyInputPath = 'D:\SNF AI Dashboard\data\processed\nethealth_therapy_census.normalized.csv'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-CommonSqlArgs {
    $args = @(
        '-ServerInstance', $ServerInstance,
        '-DatabaseName', $DatabaseName
    )

    if ($UseTrustedConnection) {
        $args += '-UseTrustedConnection'
    }
    else {
        if ([string]::IsNullOrWhiteSpace($SqlUser) -or [string]::IsNullOrWhiteSpace($SqlPassword)) {
            throw 'SqlUser and SqlPassword are required when UseTrustedConnection is disabled.'
        }
        $args += @('-SqlUser', $SqlUser, '-SqlPassword', $SqlPassword)
    }

    return $args
}

$commonSqlArgs = @(Get-CommonSqlArgs)

if (-not (Test-Path -LiteralPath $PccInputPath)) {
    throw "Required PCC input file not found: $PccInputPath"
}

& 'D:\SNF AI Dashboard\scripts\Import-PccResidentCensusToSqlStage.ps1' `
    @commonSqlArgs `
    -InputPath $PccInputPath

& 'D:\SNF AI Dashboard\scripts\Invoke-PccResidentCensusSqlLoad.ps1' `
    @commonSqlArgs `
    -InputPath $PccInputPath

if (Test-Path -LiteralPath $DocumentationInputPath) {
    & 'D:\SNF AI Dashboard\scripts\Import-NetHealthNormalizedCsvToSqlStage.ps1' `
        @commonSqlArgs `
        -InputPath $DocumentationInputPath `
        -StageTarget DocumentationDueDates

    & 'D:\SNF AI Dashboard\scripts\Invoke-NetHealthSqlLoad.ps1' `
        @commonSqlArgs `
        -InputPath $DocumentationInputPath `
        -LoadTarget DocumentationDueDates
}

if (Test-Path -LiteralPath $TherapyInputPath) {
    & 'D:\SNF AI Dashboard\scripts\Import-NetHealthNormalizedCsvToSqlStage.ps1' `
        @commonSqlArgs `
        -InputPath $TherapyInputPath `
        -StageTarget TherapyCensus

    & 'D:\SNF AI Dashboard\scripts\Invoke-NetHealthSqlLoad.ps1' `
        @commonSqlArgs `
        -InputPath $TherapyInputPath `
        -LoadTarget TherapyCensus
}

Write-Host 'Command center SQL deployment completed.'
Write-Host "Server: $ServerInstance"
Write-Host "Database: $DatabaseName"
