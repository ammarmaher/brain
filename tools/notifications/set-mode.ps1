# *** set-mode.ps1 ***
# *** Switch the Falcon Brain notification mode. ***
# *** Usage: powershell -File set-mode.ps1 -Mode {voice|silent|mute} ***
# *** Or:    powershell -File set-mode.ps1   (with no args: print current mode) ***

[CmdletBinding()]
param(
    [ValidateSet('voice', 'silent', 'mute')] [string]$Mode
)

$ErrorActionPreference = 'Stop'
$here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$cfgPath = Join-Path $here 'mode.json'

if (-not (Test-Path -LiteralPath $cfgPath)) {
    @{ mode = 'voice' } | ConvertTo-Json | Out-File -LiteralPath $cfgPath -Encoding utf8
}

$cfg = Get-Content -LiteralPath $cfgPath -Raw | ConvertFrom-Json

if (-not $Mode) {
    Write-Host ("Current notification mode: {0}" -f $cfg.mode)
    Write-Host "Usage: set-mode.ps1 -Mode {voice|silent|mute}"
    exit 0
}

$cfg.mode = $Mode
$cfg | ConvertTo-Json -Depth 4 | Out-File -LiteralPath $cfgPath -Encoding utf8

Write-Host ("Notification mode set to: {0}" -f $Mode)
switch ($Mode) {
    'voice'  { Write-Host "  - Full Brain MP3 voice alerts on all lifecycle events." }
    'silent' { Write-Host "  - Beeps only: 3 beeps on finished, 1 beep on waiting-for-input/blocked." }
    'mute'   { Write-Host "  - No sound. Hooks run but emit nothing." }
}
