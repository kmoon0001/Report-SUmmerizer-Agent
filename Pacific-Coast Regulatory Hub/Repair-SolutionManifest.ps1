param(
    [string]$SolutionPath = ".\solution_unpacked\Other\Solution.xml",
    [string]$BotComponentsPath = ".\solution_unpacked\botcomponents",
    [string]$BotsPath = ".\solution_unpacked\bots"
)

Write-Host "[ALM] REPAIRING SOLUTION MANIFEST" -ForegroundColor Yellow

if (-not (Test-Path $SolutionPath)) { Write-Error "Solution.xml not found"; return }

[xml]$xml = Get-Content $SolutionPath

$root = $xml.ImportExportXml.SolutionManifest.RootComponents
$root.RemoveAll()

# 1. Register Bot (Id: 161)
foreach ($bot in (Get-ChildItem $BotsPath -Directory)) {
    $node = $xml.CreateElement("RootComponent")
    $node.SetAttribute("type", "161")
    $node.SetAttribute("schemaName", $bot.Name)
    $root.AppendChild($node) | Out-Null
    Write-Host "Registered Bot: $($bot.Name)"
}

# 2. Register BotComponents (Id: 166)
$comps = Get-ChildItem $BotComponentsPath -Directory
foreach ($comp in $comps) {
    if ($comp.Name -contains ".") {
        $node = $xml.CreateElement("RootComponent")
        $node.SetAttribute("type", "166")
        $node.SetAttribute("schemaName", $comp.Name)
        $root.AppendChild($node) | Out-Null
    }
}
Write-Host "Registered $($comps.Count) BotComponents."

$xml.Save((Convert-Path $SolutionPath))
Write-Host "SUCCESS: Manifest updated."
