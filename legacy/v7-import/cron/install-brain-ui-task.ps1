# *** install-brain-ui-task.ps1 ***
# *** Registers FalconBrainUI scheduled task: starts the Brain UI backend at logon. ***
# *** Trigger: AtLogOn for the current user. Runs interactively (no admin). ***
# *** PowerShell 5.1 compatible. Safe to re-run (replaces existing registration). ***

[CmdletBinding()]
param(
    [switch] $Force
)

$ErrorActionPreference = 'Stop'

$TaskName    = 'FalconBrainUI'
$LauncherPs1 = 'C:\falcon\Brain\UI\backend\run.ps1'
$Description = 'Auto-start Brain UI backend (uvicorn on $env:BRAIN_UI_PORT, default 8000) at user logon.'

if (-not (Test-Path -LiteralPath $LauncherPs1)) {
    throw ("Cannot register task: {0} not found." -f $LauncherPs1)
}

if (-not $Force) {
    Write-Host ''
    Write-Host '======================================================================'
    Write-Host ' Falcon Brain UI — Auto-start Installer'
    Write-Host '======================================================================'
    Write-Host (' Task name:   {0}' -f $TaskName)
    Write-Host  ' Trigger:     At logon'
    Write-Host (' Action:      powershell.exe -ExecutionPolicy Bypass -File {0}' -f $LauncherPs1)
    Write-Host  ' Run as:      current user (interactive, no admin)'
    Write-Host  ' Window:      hidden'
    Write-Host '======================================================================'
    Write-Host ''
    $answer = Read-Host 'Register this scheduled task? (yes/no)'
    if ($answer -notmatch '^(?i:y(es)?)$') {
        Write-Host '[install-brain-ui-task] Cancelled by user.'
        return
    }
}

# *** Action: launch run.ps1 hidden so no console window pops up at every logon. ***
$argString = ('-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "{0}"' -f $LauncherPs1)
$action    = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument $argString

$logonTrigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

# *** Settings: start when available, never auto-stop, no execution time limit (long-running uvicorn). ***
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit ([TimeSpan]::Zero) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 5)

$principal = New-ScheduledTaskPrincipal `
    -UserId $env:USERNAME `
    -LogonType Interactive `
    -RunLevel Limited

$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($null -ne $existing) {
    Write-Host ('[install-brain-ui-task] Existing task found; unregistering before re-registering.')
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

Register-ScheduledTask `
    -TaskName    $TaskName `
    -Description $Description `
    -Action      $action `
    -Trigger     $logonTrigger `
    -Settings    $settings `
    -Principal   $principal | Out-Null

Write-Host ''
Write-Host ('[install-brain-ui-task] Registered scheduled task: {0}' -f $TaskName)
Write-Host  '[install-brain-ui-task] Trigger: At logon'
Write-Host  '[install-brain-ui-task] To start manually right now:'
Write-Host ('    Start-ScheduledTask -TaskName {0}' -f $TaskName)
Write-Host  '[install-brain-ui-task] To remove:'
Write-Host ('    Unregister-ScheduledTask -TaskName {0} -Confirm:$false' -f $TaskName)
Write-Host ''
