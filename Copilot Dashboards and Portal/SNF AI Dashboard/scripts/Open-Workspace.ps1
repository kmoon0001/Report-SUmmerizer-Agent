param(
  [string]$Path = 'D:\SNF AI Dashboard'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path $Path)) {
  throw "Workspace path not found: $Path"
}

code $Path
