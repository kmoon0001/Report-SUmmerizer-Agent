<#
.SYNOPSIS
    Creates stub Environment Variables in Dataverse using Power Platform CLI.
.DESCRIPTION
    Aligns with Microsoft Learn ALM standards by creating the environment variables
    for the SNF Rehab Agent solution locally, pushing them via Solution components.
.NOTE
    Requires PA CLI to be authenticated.
#>

$SolutionName = "SNF_Rehab_Agent"

Write-Host "Verifying PAC CLI Auth..."
pac auth list

$EnvVars = @(
    @{ Name = "env_PCC_BaseUrl"; Type = "String"; Default = "https://api.pointclickcare.com/mock" },
    @{ Name = "env_Optima_BaseUrl"; Type = "String"; Default = "https://api.optimahcs.com/mock" },
    @{ Name = "env_CopilotWebhook_Orchestrator"; Type = "String"; Default = "" },
    @{ Name = "env_SNF_FacilityId_Default"; Type = "String"; Default = "FAC-1001" },
    @{ Name = "env_SNF_Use_XAI_Insights"; Type = "Boolean"; Default = "true" },
    @{ Name = "env_SNF_Teams_DOR_ChannelId"; Type = "String"; Default = "" }
)

Write-Host "Creating Solution (if not exists)..."
# In a real pipeline, pac solution init / pac solution add-component would be used.
# Since environment variables require structured XML components in the solution repo,
# this script creates the baseline Solution folder structure for automated deployments.

if (-not (Test-Path ".\solution\$SolutionName\src")) {
    New-Item -ItemType Directory -Force -Path ".\solution\$SolutionName\src\EnvironmentVariables"
}

Write-Host "Stubbing Environment Variables in Solution Source..."

foreach ($v in $EnvVars) {
    $xmlContent = @"
<environmentvariable>
  <schemaname>$($v.Name)</schemaname>
  <datatype>$($v.Type)</datatype>
  <defaultvalue>$($v.Default)</defaultvalue>
</environmentvariable>
"@
    Set-Content -Path ".\solution\$SolutionName\src\EnvironmentVariables\$($v.Name).xml" -Value $xmlContent
}

Write-Host "Done. PAC CLI deployments can now pick up the component architecture."
