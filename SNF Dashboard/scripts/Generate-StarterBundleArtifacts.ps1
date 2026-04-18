param(
  [string]$BundleRoot = "D:\my agents copilot studio\SNF Dashboard\SNF_Command_Center_Starter_Bundle"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-EquivalentFileName([string]$manifestFileName) {
  $baseName = [System.IO.Path]::GetFileNameWithoutExtension($manifestFileName)
  $extension = [System.IO.Path]::GetExtension($manifestFileName).ToLowerInvariant()
  switch ($extension) {
    ".xlsx" { return "$baseName.csv" }
    ".pdf" { return "$baseName.md" }
    ".docx" { return "$baseName.md" }
    ".txt" { return $manifestFileName }
    ".md" { return $manifestFileName }
    default { return "$baseName.md" }
  }
}

function Get-CsvTemplate([string]$artifactName, [string]$folderName) {
  $headers = "ArtifactName,Purpose,Owner,Version,LastReviewed,Status,Notes"
  $row = "$artifactName,Starter source-controlled equivalent,$folderName,0.1,AssignBeforeUse,StarterTemplate,Populate with facility-specific governed content"
  return @($headers, $row) -join [Environment]::NewLine
}

function Get-MarkdownTemplate([string]$artifactName, [string]$folderName) {
  $title = ([System.IO.Path]::GetFileNameWithoutExtension($artifactName) -replace '[_-]', ' ')
  return @(
    "# $title",
    "",
    "## Purpose",
    "",
    "- Starter source-controlled equivalent for the governed artifact named $artifactName.",
    "- Use this file as the editable design source before a controlled PDF or DOCX version is issued.",
    "",
    "## Scope",
    "",
    "- Folder: $folderName",
    "- Status: StarterTemplate",
    "- Owner: AssignBeforeUse",
    "- Last reviewed: AssignBeforeUse",
    "",
    "## Minimum Content",
    "",
    "- Business or clinical purpose",
    "- Trigger or use context",
    "- Required approvals or reviewers",
    "- Core rules, steps, or controls",
    "- Validation and audit evidence expectations",
    "",
    "## Notes",
    "",
    "- Replace this starter text with facility-specific approved content."
  ) -join [Environment]::NewLine
}

function Get-ManifestEntries([string]$manifestPath) {
  $pattern = '^\s*-\s+`(.+?)`'
  return Get-Content -Path $manifestPath | ForEach-Object {
    if ($_ -match $pattern) { $matches[1] }
  } | Where-Object { $_ }
}

if (-not (Test-Path $BundleRoot)) {
  throw "Bundle root not found: $BundleRoot"
}

$folderNames = @(
  "00_ReadMe_and_Governance",
  "01_Clinical_Assistant_Specs",
  "02_Clinical_Workflows_and_Protocols",
  "03_Clinical_Dashboard_and_Visualization_Specs"
)

$createdFiles = [System.Collections.Generic.List[string]]::new()
$indexRows = [System.Collections.Generic.List[string]]::new()
$indexRows.Add("| Manifest Artifact | Source-Controlled Equivalent | Folder |")
$indexRows.Add("| --- | --- | --- |")

foreach ($folderName in $folderNames) {
  $folderPath = Join-Path $BundleRoot $folderName
  $manifestPath = Join-Path $folderPath "FILE_MANIFEST.md"
  if (-not (Test-Path $manifestPath)) { continue }

    $entries = Get-ManifestEntries $manifestPath
  foreach ($entry in $entries) {
    $equivalentName = Get-EquivalentFileName $entry
    $targetPath = Join-Path $folderPath $equivalentName
    $indexRows.Add("| $entry | $equivalentName | $folderName |")
    if (Test-Path $targetPath) { continue }

    $extension = [System.IO.Path]::GetExtension($equivalentName).ToLowerInvariant()
    $content = switch ($extension) {
      ".csv" { Get-CsvTemplate $entry $folderName }
      ".txt" { "Starter source-controlled equivalent for $entry. Replace with approved governed content." }
      default { Get-MarkdownTemplate $entry $folderName }
    }

    Set-Content -Path $targetPath -Value $content -NoNewline
    $createdFiles.Add($targetPath)
  }
}

$indexPath = Join-Path $BundleRoot "Source_Controlled_Equivalents_Index.md"
$indexContent = (@(
  "# Source Controlled Equivalents Index",
  "",
  "This index maps governed bundle artifact names to the editable source-controlled files created in the starter bundle.",
  "",
  $indexRows
) | ForEach-Object { $_ }) -join [Environment]::NewLine
Set-Content -Path $indexPath -Value $indexContent -NoNewline

Write-Host "Created files:" $createdFiles.Count
if ($createdFiles.Count -gt 0) {
  $createdFiles | ForEach-Object { Write-Host "- $_" }
}
Write-Host "Index:" $indexPath

