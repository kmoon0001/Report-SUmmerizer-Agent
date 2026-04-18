param(
    [Parameter(Mandatory = $true)]
    [string]$ServerInstance,

    [Parameter(Mandatory = $true)]
    [string]$DatabaseName,

    [string]$InputPath = 'D:\SNF AI Dashboard\data\processed\pcc_resident_list_current.active-only.csv',

    [switch]$UseTrustedConnection = $true,

    [string]$SqlUser,

    [string]$SqlPassword
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Input file not found: $InputPath"
}

$sqlcmd = Get-Command sqlcmd -ErrorAction SilentlyContinue
if (-not $sqlcmd) {
    throw "sqlcmd was not found on PATH. Install SQL Server command line tools before using this import script."
}

$escapedInputPath = $InputPath.Replace("'", "''")
$bulkInsert = @"
TRUNCATE TABLE stg.PccResidentListNormalized;

BULK INSERT stg.PccResidentListNormalized
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

$args = @(
    '-S', $ServerInstance,
    '-d', $DatabaseName,
    '-b',
    '-Q', $bulkInsert
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

Write-Host "Imported PCC resident census stage file into stg.PccResidentListNormalized"
Write-Host "Source file: $InputPath"
Write-Host "Server: $ServerInstance"
Write-Host "Database: $DatabaseName"
