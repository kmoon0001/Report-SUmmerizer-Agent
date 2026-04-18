param(
    [string]$ProcessedRoot = 'D:\my agents copilot studio\SNF Dashboard\data\processed',
    [string]$OutputRoot = 'D:\my agents copilot studio\SNF Dashboard\data\exports\futuristic-dashboard'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $OutputRoot)) {
    New-Item -ItemType Directory -Path $OutputRoot -Force | Out-Null
}

# Load the same data as the standard dashboard
$summaryJsonPath = Join-Path $ProcessedRoot 'command_center_operational_summary.json'
if (-not (Test-Path $summaryJsonPath)) { throw "Operational summary not found" }
$summary = Get-Content -LiteralPath $summaryJsonPath -Raw | ConvertFrom-Json

$censusPath = Join-Path $ProcessedRoot 'pcc_resident_list_current.active-only.csv'
$unitSnapshotPath = Join-Path $ProcessedRoot 'command_center_executive_unit_snapshot.csv'
$handoffQueuePath = Join-Path $ProcessedRoot 'command_center_automated_handoff_queue.csv'

$censusRows = Import-Csv -LiteralPath $censusPath
$unitRows = Import-Csv -LiteralPath $unitSnapshotPath
$handoffRows = if (Test-Path $handoffQueuePath) { Import-Csv -LiteralPath $handoffQueuePath } else { @() }

function Escape-Html { param([string]$Value) return [System.Net.WebUtility]::HtmlEncode($Value) }

# Generate Section HTML
$unitHtml = foreach ($u in $unitRows) {
    $percent = [math]::Min(100, [math]::Max(10, (([int]$u.PriorityHighestScore) * 10)))
    @"
    <div class="glass-card unit-card" data-priority="$($u.PriorityHighestScore)">
        <div class="card-glow"></div>
        <div class="unit-id">UNIT $($u.UnitCode)</div>
        <div class="metrics-row">
            <div class="metric"><span class="label">RESIDENTS</span><span class="value">$($u.CurrentResidentCount)</span></div>
            <div class="metric"><span class="label">MINS</span><span class="value">$($u.TherapyMinutes)</span></div>
        </div>
        <div class="progress-box">
          <div class="progress-bar" style="width: $($percent)%;"></div>
        </div>
        <div class="status-msg">PRESSURE INDEX: $($u.PriorityHighestScore)/10</div>
    </div>
"@
}

$handoffHtml = foreach ($h in ($handoffRows | Select-Object -First 5)) {
    $severityClass = if ($h.Severity -eq 'High') { 'sev-high' } else { 'sev-med' }
    @"
    <div class="alert-item $($severityClass)">
        <div class="alert-marker"></div>
        <div class="alert-content">
            <div class="alert-top">
                <span class="alert-id">$($h.HandoffTicketId)</span>
                <span class="alert-severity">$($h.Severity)</span>
            </div>
            <div class="alert-body">$($h.ResidentName) - $($h.TriggerReason)</div>
            <div class="alert-footer">DEST: $($h.HandoffChannel) | SLA: $($h.SlaTarget)</div>
        </div>
    </div>
"@
}

$htmlTemplate = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SNF COMMAND CENTER | SYSTEM v2.0</title>
    <style>
        :root {
            --neon-blue: #00f2ff;
            --neon-magenta: #ff00ea;
            --neon-green: #39ff14;
            --cyber-bg: #050a10;
            --glass-bg: rgba(16, 28, 45, 0.7);
            --glass-border: rgba(0, 242, 255, 0.2);
            --text-primary: #e0faff;
            --text-secondary: #88a9b3;
            --header-font: 'Exo 2', 'Orbitron', sans-serif;
        }

        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;600;900&family=Orbitron:wght@400;700&display=swap');

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--cyber-bg);
            color: var(--text-primary);
            font-family: 'Exo 2', sans-serif;
            height: 100vh;
            overflow: hidden;
            background-image: 
                radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.05), transparent 70%),
                linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 100%, 100% 2px, 3px 100%;
        }

        /* Minority Report Scanner Scan-line */
        body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(to bottom, transparent, var(--neon-blue), transparent);
            opacity: 0.1;
            z-index: 1000;
            animation: scanline 8s linear infinite;
        }

        @keyframes scanline {
            0% { top: -10%; }
            100% { top: 110%; }
        }

        .dashboard-container {
            display: grid;
            grid-template-columns: 350px 1fr 400px;
            grid-template-rows: 80px 1fr 100px;
            height: 100vh;
            gap: 15px;
            padding: 20px;
        }

        /* HEADER */
        header {
            grid-column: 1 / 4;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--neon-blue);
            background: rgba(0, 242, 255, 0.05);
            padding: 0 20px;
            clip-path: polygon(0 0, 100% 0, 98% 100%, 2% 100%);
        }

        .logo {
            font-family: 'Orbitron', sans-serif;
            font-size: 24px;
            font-weight: 900;
            color: var(--neon-blue);
            text-shadow: 0 0 10px var(--neon-blue);
            letter-spacing: 5px;
        }

        .system-time {
            font-family: 'Orbitron', sans-serif;
            font-size: 18px;
            color: var(--text-secondary);
        }

        /* LEFT COLUMN - RESIDENTS */
        .sidebar-left {
            grid-column: 1;
            grid-row: 2;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        /* MAIN CONTENT - UNITS */
        main {
            grid-column: 2;
            grid-row: 2;
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 15px;
            padding: 10px;
            overflow-y: auto;
        }

        /* RIGHT COLUMN - ALERTS */
        .sidebar-right {
            grid-column: 3;
            grid-row: 2;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        /* FOOTER */
        footer {
            grid-column: 1 / 4;
            grid-row: 3;
            display: flex;
            gap: 20px;
            align-items: center;
            border-top: 1px solid var(--glass-border);
            padding: 10px;
        }

        /* GLASS CARD STYLES */
        .glass-card {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 5px;
            padding: 15px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .glass-card:hover {
            border-color: var(--neon-blue);
            box-shadow: 0 0 15px var(--glass-border);
            transform: translateY(-2px);
        }

        .card-glow {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at center, rgba(0, 242, 255, 0.05), transparent 70%);
            pointer-events: none;
        }

        /* UNIT CARD SPECIFICS */
        .unit-id {
            font-family: 'Orbitron', sans-serif;
            font-weight: 700;
            color: var(--neon-blue);
            margin-bottom: 10px;
            font-size: 14px;
        }

        .metrics-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
        }

        .metric {
            display: flex;
            flex-direction: column;
        }

        .label {
            font-size: 10px;
            color: var(--text-secondary);
            text-transform: uppercase;
        }

        .value {
            font-size: 24px;
            font-weight: 900;
            color: #fff;
        }

        .progress-box {
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            margin-bottom: 5px;
        }

        .progress-bar {
            height: 100%;
            background: var(--neon-blue);
            box-shadow: 0 0 10px var(--neon-blue);
        }

        .status-msg {
            font-size: 10px;
            color: var(--neon-blue);
            opacity: 0.8;
        }

        /* ALERT ITEMS */
        .alert-item {
            background: rgba(255, 0, 0, 0.05);
            border: 1px solid rgba(255, 0, 0, 0.2);
            padding: 10px;
            display: flex;
            gap: 10px;
            animation: pulse 2s infinite ease-in-out;
        }

        .sev-high { border-color: var(--neon-magenta); background: rgba(255, 0, 234, 0.05); }
        .sev-high .alert-marker { background: var(--neon-magenta); }
        
        .alert-marker {
            width: 4px;
            background: var(--neon-blue);
        }

        .alert-content { flex: 1; }
        .alert-top { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 5px; }
        .alert-id { color: var(--text-secondary); }
        .alert-severity { font-weight: 700; color: var(--neon-magenta); }
        .alert-body { font-size: 13px; margin-bottom: 5px; }
        .alert-footer { font-size: 9px; color: var(--text-secondary); }

        @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }

        /* MATRIX EFFECTS (SVG Overlay) */
        .matrix-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.1;
        }

        /* KPI PILLS */
        .kpi-pill {
            background: rgba(16, 28, 45, 0.9);
            border: 1px solid var(--glass-border);
            padding: 10px 20px;
            border-radius: 5px;
            text-align: center;
        }

        .kpi-pill .k-val { font-size: 20px; font-weight: 900; color: var(--neon-blue); display: block; }
        .kpi-pill .k-lab { font-size: 10px; color: var(--text-secondary); text-transform: uppercase; }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--neon-blue); }

    </style>
</head>
<body>
    <div class="dashboard-container">
        <header>
            <div class="logo">SNF COMMAND CENTER</div>
            <div class="status-indicators">
                <span class="pill">ENV: PRODUCTION</span>
                <span class="pill">READY</span>
            </div>
            <div class="system-time" id="clock">00:00:00</div>
        </header>

        <aside class="sidebar-left">
            <h2 class="label" style="padding: 10px;">CORE INTEL</h2>
             <div class="glass-card">
                <div class="label">RESIDENTS</div>
                <div class="value">$($summary.metrics.currentResidents)</div>
                <div class="bar-block"><div class="progress-bar" style="width: 85%;"></div></div>
            </div>
            <div class="glass-card">
                <div class="label">DOCS OUTSTANDING</div>
                <div class="value" style="color: var(--neon-magenta)">$($summary.metrics.outstandingDocumentationItems)</div>
                <div class="bar-block"><div class="progress-bar" style="width: 40%; background: var(--neon-magenta)"></div></div>
            </div>
            <div class="glass-card">
                <div class="label">THERAPY MINS</div>
                <div class="value" style="color: var(--neon-green)">$($summary.metrics.totalTherapyMinutes)</div>
                <div class="bar-block"><div class="progress-bar" style="width: 65%; background: var(--neon-green)"></div></div>
            </div>
        </aside>

        <main>
            $($unitHtml -join [Environment]::NewLine)
        </main>

        <aside class="sidebar-right">
            <h2 class="label" style="padding: 10px;">LIVE HANDOFF FEED</h2>
            $($handoffHtml -join [Environment]::NewLine)
        </aside>

        <footer>
            <div class="kpi-pill"><span class="k-val">$($summary.metrics.currentResidents)</span><span class="k-lab">CENSUS</span></div>
            <div class="kpi-pill"><span class="k-val">$($summary.metrics.outstandingDocumentationItems)</span><span class="k-lab">DOC QUEUE</span></div>
            <div class="kpi-pill"><span class="k-val">$($summary.metrics.totalTherapyMinutes)</span><span class="k-lab">THERAPY</span></div>
            <div class="kpi-pill"><span class="k-val">$($handoffRows.Count)</span><span class="k-lab">TICKETS</span></div>
            <div style="flex: 1"></div>
            <div class="label" style="color: var(--neon-blue)">AI AGENT: ANTIGRAVITY STATUS: NOMINAL</div>
        </footer>
    </div>

    <script>
        function updateClock() {
            const now = new Date();
            document.getElementById('clock').innerText = now.toTimeString().split(' ')[0];
        }
        setInterval(updateClock, 1000);
        updateClock();
    </script>
</body>
</html>
"@

$htmlTemplate | Set-Content -LiteralPath (Join-Path $OutputRoot 'index.html') -Encoding UTF8
Write-Host "Futuristic Dashboard generated at: $(Join-Path $OutputRoot 'index.html')"
