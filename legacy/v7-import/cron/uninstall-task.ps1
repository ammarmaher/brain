# *** uninstall-task.ps1 ***
# *** Phase E: removes the FalconBrainNightlyGapScan Windows Scheduled Task. ***
# *** PowerShell 5.1 compatible. Safe to re-run (no-op if task is absent). ***

[CmdletBinding()]
param(
    [switch] $Force
)

$ErrorActionPreference = 'Stop'

# *** Constant — must match install-task.ps1. ***
$TaskName = 'FalconBrainNightlyGapScan'

$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($null -eq $existing) {
    Write-Host ('[uninstall-task] No task named {0} is registered. Nothing to do.' -f $TaskName)
    return
}

# *** Confirm before removing. -Force skips the prompt. ***
if (-not $Force) {
    Write-Host ''
    Write-Host '======================================================================'
    Write-Host ' Falcon Brain — Nightly Gap Scan Uninstaller'
    Write-Host '======================================================================'
    Write-Host (' Task name:  {0}' -f $TaskName)
    Write-Host  ' Action:     unregister from Windows Task Scheduler'
    Write-Host '======================================================================'
    Write-Host ''
    $answer = Read-Host 'Remove this scheduled task? (yes/no)'
    if ($answer -notmatch '^(?i:y(es)?)$') {
        Write-Host '[uninstall-task] Cancelled by user.'
        return
    }
}

Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
Write-Host ('[uninstall-task] Removed scheduled task: {0}' -f $TaskName)
