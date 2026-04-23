Param(
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$ErrorActionPreference = "Stop"

$schemaPath = Join-Path $ProjectRoot "docs/contracts/sharepoint-list-schemas.json"
if (-not (Test-Path -LiteralPath $schemaPath)) {
    throw "Schema file not found: $schemaPath"
}

$outputDir = Join-Path $ProjectRoot "docs/contracts/csv"
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$schema = Get-Content -Raw -LiteralPath $schemaPath | ConvertFrom-Json

foreach ($list in $schema.lists) {
    $rows = @()
    foreach ($col in $list.columns) {
        $rows += [PSCustomObject]@{
            ListName            = $list.name
            ColumnName          = $col.name
            Type                = $col.type
            Required            = $col.required
            EnforceUniqueValues = $col.enforceUniqueValues
            DefaultValue        = $col.defaultValue
            Choices             = if ($null -ne $col.choices) { ($col.choices -join "|") } else { "" }
            Notes               = $col.notes
        }
    }

    $fileName = "$($list.name).csv"
    $filePath = Join-Path $outputDir $fileName
    $rows | Export-Csv -NoTypeInformation -LiteralPath $filePath -Encoding UTF8
    Write-Host "Exported: $filePath"
}

Write-Host "Schema CSV export complete." -ForegroundColor Green
