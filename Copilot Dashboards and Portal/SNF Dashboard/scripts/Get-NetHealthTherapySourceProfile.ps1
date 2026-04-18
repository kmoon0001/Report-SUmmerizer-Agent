param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Input file not found: $InputPath"
}

$fileStream = [System.IO.File]::OpenRead($InputPath)
try {
    $buffer = New-Object byte[] 8
    $bytesRead = $fileStream.Read($buffer, 0, $buffer.Length)
}
finally {
    $fileStream.Dispose()
}

$headerText = [System.Text.Encoding]::ASCII.GetString($buffer, 0, $bytesRead)
$sourceFormat = if ($headerText.StartsWith('%PDF-')) { 'PDF' } else { 'DelimitedText' }
$recommendedPath = if ($sourceFormat -eq 'PDF') { 'PdfFallback' } else { 'NativeCsv' }

[pscustomobject]@{
    InputPath                = $InputPath
    SourceFormat             = $sourceFormat
    RecommendedProcessingPath= $recommendedPath
    FileSizeBytes            = (Get-Item -LiteralPath $InputPath).Length
    LastWriteTime            = (Get-Item -LiteralPath $InputPath).LastWriteTime.ToString('s')
}
