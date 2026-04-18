Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
. (Join-Path $projectRoot 'scripts\CommandCenterRuntime.ps1')

Describe 'CommandCenterRuntime hardening behaviors' {
    It 'acquires and releases a run lock' {
        $tmp = Join-Path $env:TEMP ('snf-lock-test-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tmp -Force | Out-Null
        $lockPath = Join-Path $tmp 'run.lock'

        Enter-CommandCenterRunLock -LockPath $lockPath
        Test-Path -LiteralPath $lockPath | Should Be $true

        Exit-CommandCenterRunLock -LockPath $lockPath
        Test-Path -LiteralPath $lockPath | Should Be $false

        Remove-Item -LiteralPath $tmp -Recurse -Force
    }

    It 'persists and reloads checkpoint step completion' {
        $tmp = Join-Path $env:TEMP ('snf-checkpoint-test-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tmp -Force | Out-Null
        $checkpointPath = Join-Path $tmp 'checkpoint.json'

        $checkpoint = Initialize-CommandCenterCheckpoint -CheckpointPath $checkpointPath
        Set-CommandCenterCheckpointStep -Checkpoint $checkpoint -Step 'Example Step' -Completed $true
        Save-CommandCenterCheckpoint -Checkpoint $checkpoint -CheckpointPath $checkpointPath

        $loaded = Initialize-CommandCenterCheckpoint -CheckpointPath $checkpointPath
        Test-CommandCenterCheckpointStepCompleted -Checkpoint $loaded -Step 'Example Step' | Should Be $true

        Remove-Item -LiteralPath $tmp -Recurse -Force
    }

    It 'cleans only old corrupt checkpoint backups' {
        $tmp = Join-Path $env:TEMP ('snf-cleanup-test-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $tmp -Force | Out-Null
        $checkpointPath = Join-Path $tmp 'command_center_cross_source.checkpoint.json'

        1..4 | ForEach-Object {
            $path = Join-Path $tmp ("command_center_cross_source.checkpoint.json.corrupt.20260101010{0}" -f $_)
            Set-Content -LiteralPath $path -Value '{}' -Encoding UTF8
            (Get-Item -LiteralPath $path).LastWriteTime = (Get-Date).AddDays(-30 - $_)
        }

        $removed = Remove-CommandCenterCheckpointCorruptBackups -CheckpointPath $checkpointPath -KeepLatest 2 -KeepDays 7
        $remaining = @(Get-ChildItem -LiteralPath $tmp -Filter 'command_center_cross_source.checkpoint.json.corrupt.*' -File)

        $removed | Should Be 2
        $remaining.Count | Should Be 2

        Remove-Item -LiteralPath $tmp -Recurse -Force
    }
}
