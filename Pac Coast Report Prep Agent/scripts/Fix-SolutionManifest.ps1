
$SolutionPath = "D:\my agents copilot studio\SNF-Rehab-Agent\SNFRehabSolution"
$SolutionXmlPath = "$SolutionPath\src\Other\Solution.xml"
$BotComponentsPath = "$SolutionPath\src\botcomponents"
$EnvVarsPath = "$SolutionPath\src\EnvironmentVariables"

# 1. Get all bot component schema names
$Components = Get-ChildItem -Path $BotComponentsPath -Directory | Select-Object -ExpandProperty Name
$EnvVars = Get-ChildItem -Path $EnvVarsPath -Filter "*.xml" | ForEach-Object { [xml]$xml = Get-Content $_.FullName; $xml.environmentvariable.schemaname }

# 2. Build RootComponents XML
$XmlBuilder = [System.Text.StringBuilder]::new()
[void]$XmlBuilder.AppendLine("    <RootComponents>")

foreach ($comp in $Components) {
    # Only include Topics (Type 9) for now to avoid invalid type errors
    if ($comp -like "*.topic.*") {
         [void]$XmlBuilder.AppendLine("      <RootComponent type=`"9`" schemaName=`"$comp`" behavior=`"0`" />")
    }
}

foreach ($ev in $EnvVars) {
    [void]$XmlBuilder.AppendLine("      <RootComponent type=`"380`" schemaName=`"$ev`" behavior=`"0`" />")
}

[void]$XmlBuilder.AppendLine("    </RootComponents>")
$RootComponentsXml = $XmlBuilder.ToString()

# 3. Read Solution.xml and replace RootComponents block
$Content = Get-Content -Path $SolutionXmlPath -Raw
$Content = $Content -replace "<RootComponents>[\s\S]*?</RootComponents>", "<RootComponents />"
$NewContent = $Content -replace "<RootComponents />", $RootComponentsXml

# 4. Save back to Solution.xml
Set-Content -Path $SolutionXmlPath -Value $NewContent -Encoding UTF8

Write-Host "Solution.xml successfully updated (Only topics and env vars)." -ForegroundColor Green
