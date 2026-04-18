param(
    [Parameter(Mandatory = $true)]
    [string]$ServerInstance,
    [Parameter(Mandatory = $true)]
    [string]$DatabaseName,
    [Parameter(Mandatory = $true)]
    [string]$InputPath,
    [Parameter(Mandatory = $true)]
    [ValidateSet('TherapyCensus','DocumentationDueDates')]
    [string]$StageTarget,
    [switch]$UseTrustedConnection = $true,
    [string]$SqlUser,
    [string]$SqlPassword
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) { throw "Input file not found: $InputPath" }
$sqlcmd = Get-Command sqlcmd -ErrorAction SilentlyContinue
if (-not $sqlcmd) { throw "sqlcmd was not found on PATH." }

$tableName = switch ($StageTarget) {
    'TherapyCensus' { 'stg.NetHealthTherapyCensusNormalized' }
    'DocumentationDueDates' { 'stg.NetHealthDocumentationDueDatesNormalized' }
}

$escapedInputPath = $InputPath.Replace("'", "''")
$bulkInsert = @"
TRUNCATE TABLE $tableName;

BULK INSERT $tableName
FROM '$escapedInputPath'
WITH (
    FIRSTROW = 2,
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '0x0a',
    CODEPAGE = '65001',
    FORMAT = 'CSV',
    FIELDQUOTE = '\"',
    TABLOCK
);
"@

$args = @('-S',$ServerInstance,'-d',$DatabaseName,'-b','-Q',$bulkInsert)
if ($UseTrustedConnection) { $args += '-E' } else { $args += @('-U',$SqlUser,'-P',$SqlPassword) }
& $sqlcmd.Source @args
Write-Host "Imported $StageTarget into $tableName"
