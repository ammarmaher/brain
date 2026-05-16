# *** voice-hook.ps1 ***
# *** Fire-and-forget voice alert for Claude Code hook events. ***
# *** Reads stdin JSON (Claude Code hook payload) for error detection. ***
# *** Spawns play-alert-context.ps1 detached so the hook returns immediately. ***
# *** Usage: voice-hook.ps1 -Category {taskReceived|waitingForInput|finished|blocked} [-OnlyOnError] ***

[CmdletBinding()]
param(
    [Parameter(Mandatory)] [ValidateSet('taskReceived', 'waitingForInput', 'processing', 'finished', 'blocked', 'testing', 'deepAnalysis', 'deployment')] [string]$Category,
    [string]$Mindset = 'claude',
    [switch]$OnlyOnError
)

$ErrorActionPreference = 'Continue'

# *** If gating on error, parse stdin JSON and bail when there's no error signal. ***
if ($OnlyOnError) {
    $stdin = ''
    try {
        if (-not [Console]::IsInputRedirected) { exit 0 }
        $stdin = [Console]::In.ReadToEnd()
    } catch { exit 0 }

    if ([string]::IsNullOrWhiteSpace($stdin)) { exit 0 }
    try {
        $payload = $stdin | ConvertFrom-Json -ErrorAction Stop
    } catch { exit 0 }

    $hasError = $false
    if ($payload.tool_response) {
        if ($payload.tool_response.is_error -eq $true) { $hasError = $true }
        if ($payload.tool_response.error)              { $hasError = $true }
        if ($payload.tool_response.success -eq $false) { $hasError = $true }
    }
    if ($payload.error) { $hasError = $true }
    if (-not $hasError) { exit 0 }
}

$here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }

# *** Resolve current notification mode (voice | silent | mute). Defaults to 'voice' if config missing/malformed. ***
$mode = 'voice'
$modePath = Join-Path $here 'mode.json'
if (Test-Path -LiteralPath $modePath) {
    try {
        $cfg = Get-Content -LiteralPath $modePath -Raw | ConvertFrom-Json
        if ($cfg.mode -in @('voice', 'silent', 'mute')) { $mode = $cfg.mode }
    } catch { }
}

# *** mute: do nothing. ***
if ($mode -eq 'mute') { exit 0 }

# *** silent: emit a category-specific beep pattern via a detached PS process, then exit. ***
if ($mode -eq 'silent') {
    # *** finished = 3 beeps; waitingForInput / blocked = 1 beep (different pitches); other categories silent. ***
    $beepCmd = $null
    switch ($Category) {
        'finished'        { $beepCmd = "[console]::beep(660,180); Start-Sleep -Milliseconds 80; [console]::beep(660,180); Start-Sleep -Milliseconds 80; [console]::beep(880,220)" }
        'waitingForInput' { $beepCmd = "[console]::beep(880,250)" }
        'blocked'         { $beepCmd = "[console]::beep(440,350)" }
    }
    if ($beepCmd) {
        try {
            Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile', '-WindowStyle', 'Hidden', '-Command', $beepCmd) -WindowStyle Hidden | Out-Null
        } catch { }
    }
    exit 0
}

# *** voice (default): spawn play-alert-context.ps1 detached so the hook returns immediately. ***
$picker = Join-Path $here 'play-alert-context.ps1'
if (-not (Test-Path -LiteralPath $picker)) { exit 0 }

$psArgs = '-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "{0}" -Mindset {1} -Category {2}' -f $picker, $Mindset, $Category
try {
    Start-Process -FilePath 'powershell.exe' -ArgumentList $psArgs -WindowStyle Hidden | Out-Null
} catch { }

exit 0
