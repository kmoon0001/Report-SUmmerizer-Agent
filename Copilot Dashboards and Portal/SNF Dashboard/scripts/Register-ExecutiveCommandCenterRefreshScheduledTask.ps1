param(
    [string]$TaskName = 'SNF Executive Command Center Refresh',
    [string]$TaskFolder = '\SNF AI Dashboard\',
    [string]$RunAt = '06:00',
    [string]$ProjectRoot = 'D:\my agents copilot studio\SNF Dashboard',
    [string]$ScriptPath = 'D:\my agents copilot studio\SNF Dashboard\scripts\Invoke-ExecutiveCommandCenterRefresh.ps1'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
    throw "Project root not found: $ProjectRoot"
}
if (-not (Test-Path -LiteralPath $ScriptPath)) {
    throw "Refresh script not found: $ScriptPath"
}

try {
    $triggerTime = [datetime]::ParseExact($RunAt, 'HH:mm', [System.Globalization.CultureInfo]::InvariantCulture)
}
catch {
    throw "RunAt must be HH:mm (24-hour), for example 06:00 or 18:30. Value: $RunAt"
}

$action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument ("-NoProfile -ExecutionPolicy Bypass -File `"{0}`"" -f $ScriptPath) -WorkingDirectory $ProjectRoot
$trigger = New-ScheduledTaskTrigger -Daily -At $triggerTime
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Hours 6)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

$task = New-ScheduledTask -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description 'Runs the SNF executive refresh pipeline daily and produces run logs, bundle outputs, and QA report artifacts.'

Register-ScheduledTask -TaskName $TaskName -TaskPath $TaskFolder -InputObject $task -Force | Out-Null

Write-Host "Scheduled task registered: $TaskFolder$TaskName"
Write-Host "Schedule: Daily at $RunAt"
Write-Host "Command: powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$ScriptPath`""

