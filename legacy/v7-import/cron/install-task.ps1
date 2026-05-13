# *** install-task.ps1 ***
# *** Phase E: registers the FalconBrainNightlyGapScan Windows Scheduled Task. ***
# *** Two triggers: AtLogOn + Daily 02:00. Runs as the current interactive user. ***
# *** PowerShell 5.1 compatible. No admin privileges required. Safe to re-run. ***

[CmdletBinding()]
param(
    [switch] $Force
)

$ErrorActionPreference = 'Stop'

# *** Constants — keep in sync with uninstall-task.ps1 and README.md. ***
$TaskName    = 'FalconBrainNightlyGapScan'
$ScriptPath  = 'C:\falcon\Brain\scripts\nightly-gap-scan.ps1'
$Description = 'Nightly business-gap-detection sweep. Writes run records to C:\falcon\Brain\suggestions\YYYY-MM-DD.md.'

# *** Sanity check: target script must exist before we register the task. ***
if (-not (Test-Path -LiteralPath $ScriptPath)) {
    throw ("Cannot register task: {0} not found." -f $ScriptPath)
}

# *** Confirm before touching the Task Scheduler. -Force skips the prompt. ***
if (-not $Force) {
    Write-Host ''
    Write-Host '======================================================================'
    Write-Host ' Falcon Brain — Nightly Gap Scan Installer'
    Write-Host '======================================================================'
    Write-Host (' Task name:   {0}' -f $TaskName)
    Write-Host  ' Triggers:    At logon  +  Daily at 02:00'
    Write-Host (' Action:      powershell.exe -ExecutionPolicy Bypass -File {0}' -f $ScriptPath)
    Write-Host  ' Run as:      current user (interactive, no admin)'
    Write-Host '======================================================================'
    Write-Host ''
    $answer = Read-Host 'Register this scheduled task? (yes/no)'
    if ($answer -notmatch '^(?i:y(es)?)$') {
        Write-Host '[install-task] Cancelled by user.'
        return
    }
}

# *** Build the action: PowerShell 5.1 + ExecutionPolicy Bypass for the wrapper. ***
$argString = ('-ExecutionPolicy Bypass -NoProfile -File "{0}"' -f $ScriptPath)
$action    = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $argString

# *** Two triggers per the Phase E contract: at logon + daily 02:00. ***
$logonTrigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$dailyTrigger = New-ScheduledTaskTrigger -Daily -At '02:00'

# *** Settings: allow start if missed, no admin, run only when interactive user is signed in. ***
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 30)

# *** Principal: run as the invoking user, only when logged on, lowest privilege. ***
$principal = New-ScheduledTaskPrincipal `
    -UserId $env:USERNAME `
    -LogonType Interactive `
    -RunLevel Limited

# *** If the task already exists, replace it cleanly. ***
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($null -ne $existing) {
    Write-Host ('[install-task] Existing task found; unregistering before re-registering.')
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

Register-ScheduledTask `
    -TaskName    $TaskName `
    -Description $Description `
    -Action      $action `
    -Trigger     @($logonTrigger, $dailyTrigger) `
    -Settings    $settings `
    -Principal   $principal | Out-Null

Write-Host ''
Write-Host ('[install-task] Registered scheduled task: {0}' -f $TaskName)
Write-Host  '[install-task] Triggers: AtLogOn + Daily 02:00'
Write-Host  '[install-task] To run manually right now:'
Write-Host ('    Start-ScheduledTask -TaskName {0}' -f $TaskName)
Write-Host  '[install-task] To remove:  C:\falcon\Brain\cron\uninstall-task.ps1'
Write-Host ''
