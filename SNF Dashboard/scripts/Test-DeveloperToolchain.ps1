Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$knownCommandPaths = @{
  code = @(
    "C:\Users\kevin\AppData\Local\Programs\Microsoft VS Code\bin\code.cmd",
    "C:\Users\kevin\AppData\Local\Programs\Microsoft VS Code\Code.exe"
  )
  pac = @(
    "C:\Users\kevin\AppData\Local\Microsoft\PowerAppsCLI\pac.cmd"
  )
  az = @(
    "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd"
  )
  gh = @(
    "C:\Program Files\GitHub CLI\gh.exe"
  )
}

function Find-ToolCommand {
  param(
    [Parameter(Mandatory = $true)]
    [string]$CommandName
  )

  $cmd = Get-Command $CommandName -ErrorAction SilentlyContinue
  if ($null -ne $cmd) {
    return $cmd.Source
  }

  $candidates = @()
  if ($knownCommandPaths.ContainsKey($CommandName)) {
    $candidates = $knownCommandPaths[$CommandName]
  }

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath $candidate) {
      return $candidate
    }
  }

  return $null
}

$checks = @(
  @{ Name = "VS Code CLI"; Command = "code" },
  @{ Name = "Node.js"; Command = "node" },
  @{ Name = "npx"; Command = "npx" },
  @{ Name = "PAC CLI"; Command = "pac" },
  @{ Name = "Python"; Command = "python" },
  @{ Name = "Azure CLI"; Command = "az" },
  @{ Name = "GitHub CLI"; Command = "gh" }
)

$missing = [System.Collections.Generic.List[string]]::new()

Write-Host "Developer toolchain check"
Write-Host ""

foreach ($check in $checks) {
  $cmdSource = Find-ToolCommand -CommandName $check.Command
  if ($null -eq $cmdSource) {
    Write-Host "- Missing: $($check.Name) [$($check.Command)]"
    $missing.Add($check.Command)
    continue
  }

  Write-Host "- Found: $($check.Name) [$($check.Command)] -> $cmdSource"
}

Write-Host ""

if ($missing.Count -gt 0) {
  Write-Host "Missing tools:"
  $missing | ForEach-Object { Write-Host "- $_" }
  exit 1
}

Write-Host "Toolchain check passed."
