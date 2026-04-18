param(
    [Parameter(Mandatory = $true)]
    [string]$InputPath,
    [Parameter(Mandatory = $true)]
    [string]$OutputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $InputPath)) {
    throw "Input PDF not found: $InputPath"
}

$pythonPath = 'D:\my agents copilot studio\SNF Dashboard\tmp\pdf-env\Scripts\python.exe'
$venvRoot = 'D:\my agents copilot studio\SNF Dashboard\tmp\pdf-env'

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
    throw 'uv is required to extract Net Health PDF exports. Install uv and retry.'
}

if (-not (Test-Path -LiteralPath $pythonPath)) {
    & uv venv $venvRoot | Out-Null
}

$importCheck = @'
import importlib.util
print(bool(importlib.util.find_spec("pypdf")))
'@
$hasPyPdf = @($importCheck | & $pythonPath -)[-1]
if ($hasPyPdf -ne 'True') {
    & uv pip install --python $pythonPath pypdf | Out-Null
}

$script = @'
import csv
import re
import sys
from pathlib import Path
from pypdf import PdfReader

input_path = Path(sys.argv[1])
output_path = Path(sys.argv[2])

reader = PdfReader(str(input_path))

date_of_service = ""
rows = []
current_patient = None
buffer = ""

footer_patterns = (
    "CONFIDENTIAL",
    "This document contains Protected Health Information",
    "Net Health",
    "Page ",
    "Daily Treatment Summary",
    "Site Of Service:",
    "Treatment Received Service Code Discipline Minutes Physician Wing Response To Treatment",
)

tail_re = re.compile(r"^(?P<treatment>.+?)\s+-\s+-\s+(?P<minutes>\d+)\s+(?P<physician>.+?)\s+(?P<wing>(?:Hall\s+[A-Z]|[A-Z]))\s*$")

def flush_buffer():
    global buffer
    if not current_patient or not buffer.strip():
        buffer = ""
        return
    merged = re.sub(r"\s+", " ", buffer).strip()
    match = tail_re.match(merged)
    if match:
        rows.append({
            "Patient": current_patient,
            "Date Of Service": date_of_service,
            "Treatment Received": match.group("treatment").strip(" ,"),
            "Service Code": "",
            "Discipline": "",
            "Minutes": match.group("minutes"),
            "Physician": match.group("physician").strip(),
            "Wing": match.group("wing").strip(),
            "Response To Treatment": "",
        })
    buffer = ""

for page in reader.pages:
    text = page.extract_text() or ""
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("Date Of Service:"):
            date_of_service = line.split(":", 1)[1].strip()
            continue
        if any(line.startswith(prefix) for prefix in footer_patterns):
            continue
        if line.startswith("Patient:"):
            flush_buffer()
            current_patient = line.split(":", 1)[1].strip()
            continue
        if current_patient is None:
            continue
        if line.startswith("- - ") and buffer:
            buffer = f"{buffer} {line}"
            flush_buffer()
            continue
        buffer = f"{buffer} {line}".strip()
        if re.search(r"\s+-\s+-\s+\d+\s+", buffer):
            flush_buffer()

flush_buffer()

if not rows:
    raise SystemExit("No treatment rows were parsed from the PDF export.")

output_path.parent.mkdir(parents=True, exist_ok=True)
with output_path.open("w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(
        f,
        fieldnames=[
            "Patient",
            "Date Of Service",
            "Treatment Received",
            "Service Code",
            "Discipline",
            "Minutes",
            "Physician",
            "Wing",
            "Response To Treatment",
        ],
    )
    writer.writeheader()
    writer.writerows(rows)

print(f"rows={len(rows)}")
'@

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$scriptPath = 'D:\my agents copilot studio\SNF Dashboard\tmp\extract-nethealth-therapy-pdf.py'
$script | Set-Content -LiteralPath $scriptPath -Encoding UTF8

& $pythonPath $scriptPath $InputPath $OutputPath

Write-Host "Converted Net Health therapy PDF export to CSV: $OutputPath"

