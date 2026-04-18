Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

& 'D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-CommandCenterCrossSourcePipeline.ps1'
& 'D:\my agents copilot studio\SNF Dashboard\scripts\New-PowerBiExecutiveSourcePackage.ps1'
& 'D:\my agents copilot studio\SNF Dashboard\scripts\New-PowerBiExecutiveModelTables.ps1'
& 'D:\my agents copilot studio\SNF Dashboard\scripts\New-PowerBiExecutiveAuthoringKit.ps1'
& 'D:\my agents copilot studio\SNF Dashboard\scripts\Test-PowerBiExecutivePackage.ps1'

Write-Host 'Power BI executive prep completed.'

