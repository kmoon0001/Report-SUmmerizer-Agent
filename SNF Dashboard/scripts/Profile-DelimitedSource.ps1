param(
    [Parameter(Mandatory = $true)]
    [string]$Path,
    [int]$SampleRows = 25
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $Path)) {
    throw "File not found: $Path"
}

$extension = [System.IO.Path]::GetExtension($Path).ToLowerInvariant()
if ($extension -ne '.csv' -and $extension -ne '.txt') {
    throw "Only .csv and .txt delimited files are supported by this profiler. Export CSV from PCC first."
}

$content = Import-Csv -LiteralPath $Path
$rows = @($content)
$rowCount = $rows.Count

if ($rowCount -eq 0) {
    Write-Output "No rows found in $Path"
    exit 0
}

$columns = $rows[0].PSObject.Properties.Name

$summary = [ordered]@{
    FilePath = $Path
    RowCount = $rowCount
    ColumnCount = $columns.Count
    Columns = @()
}

$sample = $rows | Select-Object -First $SampleRows

foreach ($column in $columns) {
    $values = @($sample | ForEach-Object { $_.$column } | Where-Object { $_ -ne $null -and $_ -ne '' })
    $uniquePreview = @($values | Select-Object -Unique | Select-Object -First 10)

    $summary.Columns += [ordered]@{
        Name = $column
        NonBlankSampleCount = $values.Count
        UniquePreview = $uniquePreview
    }
}

$summary | ConvertTo-Json -Depth 6
