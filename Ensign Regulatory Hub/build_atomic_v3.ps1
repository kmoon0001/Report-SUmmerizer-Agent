$sourcePath = "D:\my agents copilot studio\QM Agent and Coach\extracted_hardened\Chatbots\cr53f_pcca_v2"
$targetSchema = "cr917_agentu92bPc"
$buildPath = "D:\my agents copilot studio\QM Agent and Coach\build_atomic_v3"
$zipPath = "D:\my agents copilot studio\QM Agent and Coach\PCCA_Atomic_V3_Final.zip"

Write-Host "Building Atomic Package for $targetSchema..." -ForegroundColor Cyan

# 1. Clean and Create Folders
if (Test-Path $buildPath) { Remove-Item $buildPath -Recurse -Force }
New-Item -ItemType Directory -Path "$buildPath\Chatbots\$targetSchema" -Force | Out-Null

# 2. Copy and Align Source Files
Write-Host "Aligning schema in source files..." -ForegroundColor Yellow
Copy-Item "$sourcePath\*" "$buildPath\Chatbots\$targetSchema" -Recurse -Force -Exclude ".mcs"

Get-ChildItem -Path "$buildPath\Chatbots\$targetSchema" -Recurse -File | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content -replace "cr53f_pcca_v2", $targetSchema
    $newContent = $newContent -replace "cr53f_agentOptimizationAssistant", $targetSchema
    if ($content -ne $newContent) {
        $newContent | Set-Content $_.FullName
    }
}

# 3. Create manifest files
Write-Host "Creating manifest files..." -ForegroundColor Yellow

$solutionXml = @"
<?xml version="1.0" encoding="utf-8"?>
<ImportExportXml version="9.1.0.643" SolutionPackageVersion="9.1" languagecode="1033" generatedBy="CrmLive" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <SolutionManifest>
    <UniqueName>PacificCoast_Atomic</UniqueName>
    <LocalizedNames>
      <LocalizedName description="Pacific Coast Compliance Atomic" languagecode="1033" />
    </LocalizedNames>
    <Descriptions />
    <Version>1.0.0.3</Version>
    <Managed>0</Managed>
    <Publisher>
      <UniqueName>Pacific CoastServices</UniqueName>
      <LocalizedNames>
        <LocalizedName description="Pacific CoastServices" languagecode="1033" />
      </LocalizedNames>
      <Descriptions>
        <Description description="Pacific CoastServices" languagecode="1033" />
      </Descriptions>
      <EMailAddress xsi:nil="true"></EMailAddress>
      <SupportingWebsiteUrl xsi:nil="true"></SupportingWebsiteUrl>
      <CustomizationPrefix>cr917</CustomizationPrefix>
      <CustomizationOptionValuePrefix>53079</CustomizationOptionValuePrefix>
    </Publisher>
    <RootComponents>
      <RootComponent type="91" schemaName="$targetSchema" />
    </RootComponents>
    <MissingDependencies />
  </SolutionManifest>
</ImportExportXml>
"@

$customizationsXml = @"
<?xml version="1.0" encoding="utf-8"?>
<ImportExportXml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Entities />
  <Roles />
  <Workflows />
  <FieldSecurityProfiles />
  <Templates />
  <EntityMaps />
  <EntityRelationships />
  <OrganizationSettings />
  <optionsets />
  <CustomControls />
  <SolutionPluginAssemblies />
  <EntityDataProviders />
  <Languages>
    <Language>1033</Language>
  </Languages>
</ImportExportXml>
"@

$contentTypesXml = @"
<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="xml" ContentType="application/octet-stream" />
  <Default Extension="yml" ContentType="application/octet-stream" />
  <Default Extension="json" ContentType="application/octet-stream" />
</Types>
"@

$solutionXml | Set-Content -LiteralPath "$buildPath\solution.xml"
$customizationsXml | Set-Content -LiteralPath "$buildPath\customizations.xml"
$contentTypesXml | Set-Content -LiteralPath "$buildPath\[Content_Types].xml"

# 4. ZIP it up
Write-Host "Creating ZIP archive..." -ForegroundColor Green
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Push-Location $buildPath
try {
    Compress-Archive -Path * -DestinationPath $zipPath -Force
} finally {
    Pop-Location
}

Write-Host "Atomic Build Complete: $zipPath" -ForegroundColor Cyan

