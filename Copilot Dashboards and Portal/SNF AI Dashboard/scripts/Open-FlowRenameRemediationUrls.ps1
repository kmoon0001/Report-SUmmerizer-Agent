param(
    [string]$EnvironmentId = 'a944fdf0-0d2e-e14d-8a73-0f5ffae23315'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$flowIds = @(
    '9d834a1f-1a18-f111-8341-000d3a5a5d47',
    'fcf035ad-af0c-f111-8406-0022480b6bd9',
    '51112488-9726-f111-8341-0022480b6bd9',
    '3a73a4c2-5a18-f111-8341-000d3a5a5d47',
    '0b930a15-2516-f111-8341-0022480b6bd9',
    'f96d43dd-fd24-f111-8341-6045bd061151',
    'db104008-d226-f111-8341-000d3a5b88c6'
)

foreach ($flowId in $flowIds) {
    $url = "https://make.powerautomate.com/environments/$EnvironmentId/flows/$flowId/edit"
    Start-Process $url
}

Write-Host "Opened $($flowIds.Count) flow designer tabs for rename remediation."
