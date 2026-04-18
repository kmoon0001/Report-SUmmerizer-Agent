param(
    [string]$PowerBiRoot = 'D:\my agents copilot studio\SNF Dashboard\integrations\powerbi',
    [string]$PackageRoot = 'D:\my agents copilot studio\SNF Dashboard\integrations\powerbi\source-package\current',
    [string]$ProcessedRoot = 'D:\my agents copilot studio\SNF Dashboard\data\processed'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$measuresPath = Join-Path $PowerBiRoot 'executive-command-center-measures.csv'
$relationshipsPath = Join-Path $PowerBiRoot 'executive-command-center-relationships.csv'
$reportSpecPath = Join-Path $PowerBiRoot '..\..\docs\executive-command-center-report-spec.md'
$summaryJsonPath = Join-Path $ProcessedRoot 'command_center_operational_summary.json'
$authoringRoot = Join-Path $PackageRoot 'authoring-kit'

foreach ($requiredPath in @($measuresPath, $relationshipsPath, $summaryJsonPath)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
        throw "Required authoring-kit input not found: $requiredPath"
    }
}

if (-not (Test-Path -LiteralPath $authoringRoot)) {
    New-Item -ItemType Directory -Path $authoringRoot -Force | Out-Null
}

Get-ChildItem -LiteralPath $authoringRoot -File -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue

$measures = @(Import-Csv -LiteralPath $measuresPath)
$relationships = @(Import-Csv -LiteralPath $relationshipsPath)
$summary = Get-Content -LiteralPath $summaryJsonPath -Raw | ConvertFrom-Json

$theme = [pscustomobject]@{
    name = 'SNF Executive Command Center'
    background = '#f3efe7'
    foreground = '#1d2830'
    tableAccent = '#0a6b61'
    dataColors = @(
        '#163a49',
        '#0a6b61',
        '#c88b2a',
        '#ba5f57',
        '#5a7184',
        '#6f8f6a',
        '#cdb57d',
        '#8d5b4c'
    )
    visualStyles = @{
        '*' = @{
            '*' = @{
                title = @(@{
                    show = $true
                    fontColor = @{ solid = @{ color = '#1d2830' } }
                    alignment = 'left'
                })
            }
        }
    }
}
$theme | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $authoringRoot 'executive-theme.json') -Encoding UTF8

$measureScript = @(
    '// Executive Command Center measures'
    '// Generated from executive-command-center-measures.csv'
    ''
)
foreach ($measure in $measures) {
    $measureScript += @(
        "// $($measure.DisplayFolder) | $($measure.Definition)"
        "$($measure.MeasureName) = $($measure.DaxExpression)"
        ''
    )
}
$measureScript -join [Environment]::NewLine | Set-Content -LiteralPath (Join-Path $authoringRoot 'executive-measures.dax') -Encoding UTF8

$layout = [pscustomobject]@{
    generatedAt = (Get-Date).ToString('s')
    report = 'SNF Executive Command Center'
    sections = @(
        [pscustomobject]@{
            name = 'Overview'
            visuals = @(
                'Current resident census card',
                'Residents with documentation items card',
                'Outstanding documentation items card',
                'Overdue documentation items card',
                'Residents with therapy card',
                'Total therapy minutes card'
            )
        },
        [pscustomobject]@{
            name = 'Unit Operations'
            visuals = @(
                'Unit operations matrix',
                'Therapy workload by unit',
                'Documentation pressure by unit'
            )
        },
        [pscustomobject]@{
            name = 'Resident Follow-Up'
            visuals = @(
                'Resident priority table',
                'Optional resident detail drillthrough'
            )
        }
    )
    currentMetrics = $summary.metrics
}
$layout | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $authoringRoot 'executive-page-layout.json') -Encoding UTF8

$goldTheme = @'
{
  "name": "SNF Gold Standard Command Center",
  "background": "#f6f8fb",
  "foreground": "#0f172a",
  "tableAccent": "#22c55e",
  "dataColors": [
    "#22c55e",
    "#3b82f6",
    "#14b8a6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#0f172a",
    "#94a3b8"
  ],
  "visualStyles": {
    "*": {
      "*": {
        "title": [
          {
            "show": true,
            "alignment": "left",
            "fontColor": {
              "solid": {
                "color": "#0f172a"
              }
            }
          }
        ],
        "background": [
          {
            "show": true,
            "color": {
              "solid": {
                "color": "#ffffff"
              }
            },
            "transparency": 0
          }
        ],
        "border": [
          {
            "show": true,
            "color": {
              "solid": {
                "color": "#e2e8f0"
              }
            },
            "radius": 10
          }
        ]
      }
    }
  }
}
'@
$goldTheme | Set-Content -LiteralPath (Join-Path $authoringRoot 'snf-gold-standard-theme.json') -Encoding UTF8

$goldLayout = @'
{
  "generatedAt": "2026-04-07T18:45:00",
  "report": "SNF Gold Standard Command Center",
  "canvas": {
    "width": 1366,
    "height": 768
  },
  "sections": [
    {
      "name": "01 Command Center",
      "visuals": [
        "KPI strip with six compact cards",
        "Department barometer strip",
        "30-day incidents trend",
        "High-risk events by department",
        "Top-risk residents table"
      ]
    },
    {
      "name": "02 Resident 360",
      "visuals": [
        "Resident identity card",
        "Clinical/risk model panel",
        "Vitals and interventions rail",
        "Timeline",
        "Task queue"
      ]
    },
    {
      "name": "03 Operations",
      "visuals": [
        "Shift readiness KPIs",
        "Incidents by shift",
        "Non-compliance by discipline",
        "Work-order aging heatmap",
        "Action queue table"
      ]
    },
    {
      "name": "04 Executive",
      "visuals": [
        "Executive KPI strip",
        "Quality and occupancy trends",
        "Regional facility heatmap",
        "Narrative risk cards"
      ]
    }
  ]
}
'@
$goldLayout | Set-Content -LiteralPath (Join-Path $authoringRoot 'snf-gold-standard-page-layout.json') -Encoding UTF8

$goldSpec = @'
# SNF Gold Standard Visual Spec

## Design Target

- dark icon-first left rail
- light canvas with white rounded cards
- compact KPI strips and risk color coding
- profile-first clinical detail views

## Required Pages

1. 01 Command Center
2. 02 Resident 360
3. 03 Operations
4. 04 Executive

## Gold Rules

- no default Power BI palette
- each page answers one decision question
- no overcrowded legends or long titles
- action tables include owner and due fields
'@
$goldSpec | Set-Content -LiteralPath (Join-Path $authoringRoot 'snf-gold-standard-visual-spec.md') -Encoding UTF8

$goldPrompts = @'
# SNF Gold Standard Copilot Prompts

## Prompt: Command Center
Create page 01 Command Center with a KPI strip, department barometers, incidents trend, department stacked bar, and top-risk resident grid. Use rounded white cards on a light background.

## Prompt: Resident 360
Create page 02 Resident 360 with resident identity, central clinical profile, right-side interventions, and a bottom timeline plus task queue.

## Prompt: Operations
Create page 03 Operations with shift KPIs, incidents by shift, non-compliance by discipline, work-order heatmap, and an action queue.

## Prompt: Executive
Create page 04 Executive with top KPIs, 24-month trends, facility heatmap, and two narrative risk cards.
'@
$goldPrompts | Set-Content -LiteralPath (Join-Path $authoringRoot 'snf-gold-standard-copilot-prompts.md') -Encoding UTF8

$goldChecklist = @'
# SNF Gold Standard Polish Checklist

## Layout

- [ ] left rail pattern is consistent
- [ ] KPI card dimensions are consistent
- [ ] visuals align to a clean grid

## Quality

- [ ] titles are concise and decision-oriented
- [ ] risk states use green/amber/red consistently
- [ ] each table has an action column

## Role Fit

- [ ] staff page is action-first
- [ ] manager page is intervention-first
- [ ] admin page is all-department risk posture
- [ ] executive page is strategic summary
'@
$goldChecklist | Set-Content -LiteralPath (Join-Path $authoringRoot 'snf-gold-standard-polish-checklist.md') -Encoding UTF8

Copy-Item -LiteralPath $relationshipsPath -Destination (Join-Path $authoringRoot 'executive-command-center-relationships.csv') -Force
Copy-Item -LiteralPath $measuresPath -Destination (Join-Path $authoringRoot 'executive-command-center-measures.csv') -Force
if (Test-Path -LiteralPath $reportSpecPath) {
    Copy-Item -LiteralPath $reportSpecPath -Destination (Join-Path $authoringRoot 'executive-command-center-report-spec.md') -Force
}

$readme = @"
# Power BI Executive Authoring Kit

This folder accelerates the Power BI Desktop or PBIP build from the packaged SNF executive source tables.

Included:

- `executive-theme.json`
- `executive-measures.dax`
- `executive-command-center-measures.csv`
- `executive-command-center-relationships.csv`
- `executive-page-layout.json`
- `executive-command-center-report-spec.md`
- `snf-gold-standard-theme.json`
- `snf-gold-standard-page-layout.json`
- `snf-gold-standard-visual-spec.md`
- `snf-gold-standard-copilot-prompts.md`
- `snf-gold-standard-polish-checklist.md`

Recommended use:

1. Import the model tables from `..\model-tables`.
2. Apply relationships from `executive-command-center-relationships.csv`.
3. Create measures from `executive-measures.dax`.
4. Apply `executive-theme.json`.
5. Build the overview, unit operations, and resident follow-up pages using `executive-page-layout.json`.

Gold standard UX path:

1. Apply `snf-gold-standard-theme.json`.
2. Build the four core pages from `snf-gold-standard-page-layout.json`.
3. Use prompts from `snf-gold-standard-copilot-prompts.md`.
4. Validate with `snf-gold-standard-visual-spec.md` and `snf-gold-standard-polish-checklist.md`.
"@
$readme | Set-Content -LiteralPath (Join-Path $authoringRoot 'README.md') -Encoding UTF8

$manifest = [pscustomobject]@{
    GeneratedAt = (Get-Date).ToString('s')
    AuthoringRoot = $authoringRoot
    MeasureCount = $measures.Count
    RelationshipCount = $relationships.Count
    Files = @(
        'README.md',
        'executive-theme.json',
        'executive-measures.dax',
        'executive-command-center-measures.csv',
        'executive-command-center-relationships.csv',
        'executive-page-layout.json',
        'executive-command-center-report-spec.md',
        'snf-gold-standard-theme.json',
        'snf-gold-standard-page-layout.json',
        'snf-gold-standard-visual-spec.md',
        'snf-gold-standard-copilot-prompts.md',
        'snf-gold-standard-polish-checklist.md'
    )
}
$manifest | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $authoringRoot 'authoring-kit-manifest.json') -Encoding UTF8

Write-Host "Power BI executive authoring kit written to: $authoringRoot"
Write-Host "Measures: $($measures.Count)"
Write-Host "Relationships: $($relationships.Count)"

