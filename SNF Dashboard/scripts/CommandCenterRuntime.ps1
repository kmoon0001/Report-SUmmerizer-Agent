Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function ConvertTo-CommandCenterHashtable {
    param($InputObject)

    if ($null -eq $InputObject) { return $null }
    if ($InputObject -is [hashtable]) { return $InputObject }
    if ($InputObject -is [ValueType]) { return $InputObject }

    if ($InputObject -is [System.Collections.IDictionary]) {
        $map = @{}
        foreach ($key in $InputObject.Keys) {
            $map[[string]$key] = ConvertTo-CommandCenterHashtable -InputObject $InputObject[$key]
        }
        return $map
    }

    if ($InputObject -is [psobject]) {
        $props = @($InputObject.PSObject.Properties | Where-Object { $_.MemberType -eq 'NoteProperty' -or $_.MemberType -eq 'Property' })
        if ($props.Count -gt 0) {
            $map = @{}
            foreach ($prop in $props) {
                $map[$prop.Name] = ConvertTo-CommandCenterHashtable -InputObject $prop.Value
            }
            return $map
        }
    }

    if ($InputObject -is [System.Collections.IEnumerable] -and -not ($InputObject -is [string])) {
        $items = @()
        foreach ($item in $InputObject) {
            $items += ,(ConvertTo-CommandCenterHashtable -InputObject $item)
        }
        return $items
    }

    return $InputObject
}

function New-CommandCenterRunLog {
    return ,(New-Object System.Collections.ArrayList)
}

function Add-CommandCenterRunEvent {
    param(
        [System.Collections.ArrayList]$RunLog,
        [string]$Step,
        [string]$Status,
        [string]$Message,
        [string]$ArtifactPath = ''
    )

    $RunLog.Add([pscustomobject]@{
        Timestamp    = (Get-Date).ToString('s')
        Step         = $Step
        Status       = $Status
        Message      = $Message
        ArtifactPath = $ArtifactPath
    }) | Out-Null
}

function Invoke-CommandCenterStep {
    param(
        [System.Collections.ArrayList]$RunLog,
        [string]$Step,
        [scriptblock]$Action,
        [switch]$Optional
    )

    try {
        & $Action
        Add-CommandCenterRunEvent -RunLog $RunLog -Step $Step -Status 'PASS' -Message 'Completed.'
        return $true
    }
    catch {
        $message = $_.Exception.Message
        if ($Optional) {
            Add-CommandCenterRunEvent -RunLog $RunLog -Step $Step -Status 'WARN' -Message $message
            return $false
        }

        Add-CommandCenterRunEvent -RunLog $RunLog -Step $Step -Status 'FAIL' -Message $message
        throw
    }
}

function Remove-CommandCenterArtifacts {
    param(
        [string[]]$Paths,
        [System.Collections.ArrayList]$RunLog,
        [string]$Step = 'Cleanup'
    )

    foreach ($path in $Paths) {
        if (Test-Path -LiteralPath $path) {
            Remove-Item -LiteralPath $path -Force
            Add-CommandCenterRunEvent -RunLog $RunLog -Step $Step -Status 'INFO' -Message 'Removed stale artifact.' -ArtifactPath $path
        }
    }
}

function Save-CommandCenterRunLog {
    param(
        [System.Collections.ArrayList]$RunLog,
        [string]$OutputPath
    )

    $outputDirectory = Split-Path -Parent $OutputPath
    if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
        New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
    }

    $payload = [pscustomobject]@{
        GeneratedAt = (Get-Date).ToString('s')
        EventCount  = $RunLog.Count
        Events      = @($RunLog)
    }

    $payload | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $OutputPath -Encoding UTF8
}

function Enter-CommandCenterRunLock {
    param(
        [string]$LockPath,
        [int]$StaleLockMinutes = 240
    )

    $lockDirectory = Split-Path -Parent $LockPath
    if ($lockDirectory -and -not (Test-Path -LiteralPath $lockDirectory)) {
        New-Item -ItemType Directory -Path $lockDirectory -Force | Out-Null
    }

    for ($attempt = 1; $attempt -le 2; $attempt++) {
        try {
            $stream = [System.IO.File]::Open($LockPath, [System.IO.FileMode]::CreateNew, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
            $payload = [pscustomobject]@{
                CreatedAt = (Get-Date).ToString('s')
                ProcessId = $PID
                Machine   = $env:COMPUTERNAME
                User      = $env:USERNAME
            } | ConvertTo-Json -Depth 3
            $writer = New-Object System.IO.StreamWriter($stream)
            $writer.Write($payload)
            $writer.Flush()
            $writer.Dispose()
            $stream.Dispose()
            return
        }
        catch {
            if (-not (Test-Path -LiteralPath $LockPath)) {
                throw
            }

            $ageMinutes = [int]([TimeSpan]((Get-Date) - (Get-Item -LiteralPath $LockPath).LastWriteTime)).TotalMinutes
            if ($ageMinutes -ge $StaleLockMinutes -and $attempt -eq 1) {
                Remove-Item -LiteralPath $LockPath -Force
                continue
            }

            throw "Run lock exists: $LockPath (age ${ageMinutes}m). Another run is active or lock is not stale."
        }
    }
}

function Exit-CommandCenterRunLock {
    param([string]$LockPath)
    if (Test-Path -LiteralPath $LockPath) {
        Remove-Item -LiteralPath $LockPath -Force
    }
}

function Initialize-CommandCenterCheckpoint {
    param([string]$CheckpointPath)

    $checkpointDirectory = Split-Path -Parent $CheckpointPath
    if ($checkpointDirectory -and -not (Test-Path -LiteralPath $checkpointDirectory)) {
        New-Item -ItemType Directory -Path $checkpointDirectory -Force | Out-Null
    }

    if (Test-Path -LiteralPath $CheckpointPath) {
        try {
            $loaded = Get-Content -LiteralPath $CheckpointPath -Raw | ConvertFrom-Json
            return (ConvertTo-CommandCenterHashtable -InputObject $loaded)
        }
        catch {
            $corruptPath = '{0}.corrupt.{1}' -f $CheckpointPath, (Get-Date -Format 'yyyyMMddHHmmss')
            Move-Item -LiteralPath $CheckpointPath -Destination $corruptPath -Force
            return @{
                CreatedAt      = (Get-Date).ToString('s')
                LastUpdatedAt  = (Get-Date).ToString('s')
                CompletedSteps = @{}
                RecoveredFrom  = $corruptPath
            }
        }
    }

    return @{
        CreatedAt      = (Get-Date).ToString('s')
        LastUpdatedAt  = (Get-Date).ToString('s')
        CompletedSteps = @{}
    }
}

function Save-CommandCenterCheckpoint {
    param(
        [hashtable]$Checkpoint,
        [string]$CheckpointPath
    )

    $Checkpoint['LastUpdatedAt'] = (Get-Date).ToString('s')
    $Checkpoint | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $CheckpointPath -Encoding UTF8
}

function Test-CommandCenterCheckpointStepCompleted {
    param(
        [hashtable]$Checkpoint,
        [string]$Step
    )

    if (-not $Checkpoint.ContainsKey('CompletedSteps')) { return $false }
    $steps = $Checkpoint['CompletedSteps']
    if ($null -eq $steps) { return $false }
    if (-not ($steps -is [hashtable])) { return $false }
    return ($steps.ContainsKey($Step) -and [bool]$steps[$Step])
}

function Set-CommandCenterCheckpointStep {
    param(
        [hashtable]$Checkpoint,
        [string]$Step,
        [bool]$Completed = $true
    )

    if (-not $Checkpoint.ContainsKey('CompletedSteps') -or -not ($Checkpoint['CompletedSteps'] -is [hashtable])) {
        $Checkpoint['CompletedSteps'] = @{}
    }

    $Checkpoint['CompletedSteps'][$Step] = $Completed
}

function Remove-CommandCenterCheckpointCorruptBackups {
    param(
        [string]$CheckpointPath,
        [int]$KeepLatest = 5,
        [int]$KeepDays = 14,
        [System.Collections.ArrayList]$RunLog = $null
    )

    if ($KeepLatest -lt 0) { $KeepLatest = 0 }
    if ($KeepDays -lt 0) { $KeepDays = 0 }

    $directory = Split-Path -Parent $CheckpointPath
    if (-not $directory -or -not (Test-Path -LiteralPath $directory)) { return 0 }

    $baseName = [System.IO.Path]::GetFileName($CheckpointPath)
    $pattern = "$baseName.corrupt.*"
    $files = @(
        Get-ChildItem -LiteralPath $directory -Filter $pattern -File -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending
    )

    if ($files.Count -eq 0) { return 0 }

    $now = Get-Date
    $toRemove = New-Object System.Collections.Generic.List[System.IO.FileInfo]
    for ($i = 0; $i -lt $files.Count; $i++) {
        $file = $files[$i]
        $ageDays = [int]([TimeSpan]($now - $file.LastWriteTime)).TotalDays
        $mustKeepByCount = $i -lt $KeepLatest
        $mustKeepByAge = $ageDays -le $KeepDays
        if (-not $mustKeepByCount -and -not $mustKeepByAge) {
            $toRemove.Add($file) | Out-Null
        }
    }

    foreach ($file in $toRemove) {
        Remove-Item -LiteralPath $file.FullName -Force
        if ($null -ne $RunLog) {
            Add-CommandCenterRunEvent -RunLog $RunLog -Step 'Checkpoint Cleanup' -Status 'INFO' -Message 'Removed old checkpoint corrupt backup.' -ArtifactPath $file.FullName
        }
    }

    return $toRemove.Count
}
