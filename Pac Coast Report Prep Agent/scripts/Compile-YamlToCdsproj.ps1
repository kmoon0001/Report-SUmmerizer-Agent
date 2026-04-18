<#
.SYNOPSIS
Dynamically compiles raw .yaml logic from src/Topics into the rigorous Dataverse .cdsproj XML architecture.
#>

$SourcePath = "D:\my agents copilot studio\SNF-Rehab-Agent\src\Topics"
$DestPath = "D:\my agents copilot studio\SNF-Rehab-Agent\SNFRehabSolution\src\botcomponents"
$AgentSchemaName = "pcca_agent39xn69"

$Topics = Get-ChildItem -Path $SourcePath -Filter "*.yaml"

foreach ($Topic in $Topics) {
    # Extract name (e.g. EvalAnalysis)
    $BaseName = $Topic.Name.Replace(".topic.yaml", "")
    $SchemaName = "$AgentSchemaName.topic.$BaseName"
    
    # Create the internal target directory
    $TopicDir = Join-Path -Path $DestPath -ChildPath $SchemaName
    if (-not (Test-Path $TopicDir)) {
        New-Item -ItemType Directory -Path $TopicDir | Out-Null
        Write-Host "Created new component schema: $SchemaName" -ForegroundColor Green
    }

    # 1. Generate botcomponent.xml
    $XmlContent = @"
<botcomponent schemaname="$SchemaName">
  <componenttype>9</componenttype>
  <description>Auto-migrated custom code topic: $BaseName.</description>
  <iscustomizable>1</iscustomizable>
  <name>$BaseName</name>
  <parentbotid>
    <schemaname>$AgentSchemaName</schemaname>
  </parentbotid>
  <statecode>0</statecode>
  <statuscode>1</statuscode>
</botcomponent>
"@
    Set-Content -Path "$TopicDir\botcomponent.xml" -Value $XmlContent -Encoding UTF8

    # 2. Map Topic YAML strictly into `content.yaml` Dataverse bindings
    # Replace single '=' logic prefixes which power fx syntax might trip, relying on what's inside
    $YamlCode = Get-Content $Topic.FullName -Raw
    Set-Content -Path "$TopicDir\content.yaml" -Value $YamlCode -Encoding UTF8

    # Note: Microsoft Dataverse relies on `data/content.yaml` for newer versions if missing. We map it identically.
    $DataDir = Join-Path -Path $TopicDir -ChildPath "data"
    if (-not (Test-Path $DataDir)) {
        New-Item -ItemType Directory -Path $DataDir | Out-Null
    }
    Set-Content -Path "$DataDir\content.yaml" -Value $YamlCode -Encoding UTF8
}

Write-Host "All custom local topics successfully integrated into Dataverse CRM boundaries." -ForegroundColor Cyan
