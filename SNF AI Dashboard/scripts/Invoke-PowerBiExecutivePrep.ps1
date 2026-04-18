Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

& 'D:\SNF AI Dashboard\scripts\Invoke-CommandCenterCrossSourcePipeline.ps1'
& 'D:\SNF AI Dashboard\scripts\New-PowerBiExecutiveSourcePackage.ps1'
& 'D:\SNF AI Dashboard\scripts\New-PowerBiExecutiveModelTables.ps1'
& 'D:\SNF AI Dashboard\scripts\New-PowerBiExecutiveAuthoringKit.ps1'
& 'D:\SNF AI Dashboard\scripts\Test-PowerBiExecutivePackage.ps1'

Write-Host 'Power BI executive prep completed.'
