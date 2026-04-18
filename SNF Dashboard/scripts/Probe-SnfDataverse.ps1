$ErrorActionPreference = 'Stop'

$dataverseUrl = 'https://orgbd048f00.crm.dynamics.com'
$token = az account get-access-token --resource $dataverseUrl --query accessToken -o tsv

if (-not $token) {
    throw 'Unable to obtain Dataverse access token.'
}

$headers = @{
    Authorization    = "Bearer $token"
    Accept           = 'application/json'
    'OData-MaxVersion' = '4.0'
    'OData-Version'    = '4.0'
}

$results = [ordered]@{}
$results.WhoAmI = Invoke-RestMethod -Method Get -Uri "$dataverseUrl/api/data/v9.2/WhoAmI" -Headers $headers
$results.EntityDefinitionsTop = Invoke-RestMethod -Method Get -Uri "$dataverseUrl/api/data/v9.2/EntityDefinitions?`$select=LogicalName&`$top=30" -Headers $headers
$results.EntityDefinitionsCustom = Invoke-RestMethod -Method Get -Uri "$dataverseUrl/api/data/v9.2/EntityDefinitions?`$select=LogicalName&`$filter=startswith(LogicalName,'cr')&`$top=50" -Headers $headers

$results | ConvertTo-Json -Depth 10
