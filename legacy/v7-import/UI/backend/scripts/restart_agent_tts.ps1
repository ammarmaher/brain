# *** Restart agent-tts node daemon: stop existing instances + relaunch hidden ***
# *** Output: one JSON line on stdout: {"stopped":[<pid>...],"started":<pid>,"logPath":"...","errPath":"..."} ***

$ErrorActionPreference = "Stop"

$stopped = @()

# *** Find existing agent-tts processes by command line ***
try {
    $procs = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
        Where-Object { $_.CommandLine -and ($_.CommandLine -like '*agent-tts*') -and ($_.CommandLine -notlike '*restart_agent_tts*') }
    foreach ($p in $procs) {
        try {
            Stop-Process -Id $p.ProcessId -Force -ErrorAction Stop
            $stopped += $p.ProcessId
        } catch {
            # *** swallow individual stop failures; daemon may have already exited ***
        }
    }
} catch {
    # *** WMI unavailable: continue with start anyway ***
}

# *** Locate agent-tts.cmd in user's npm global ***
$cmdPath = Join-Path $env:APPDATA "npm\agent-tts.cmd"
if (-not (Test-Path $cmdPath)) {
    $alt = (Get-Command agent-tts -ErrorAction SilentlyContinue).Source
    if ($alt) { $cmdPath = $alt }
}

$logPath = Join-Path $env:TEMP "agent-tts.log"
$errPath = Join-Path $env:TEMP "agent-tts.err.log"

$started = $null
if (Test-Path $cmdPath) {
    try {
        $proc = Start-Process -FilePath $cmdPath `
            -RedirectStandardOutput $logPath `
            -RedirectStandardError $errPath `
            -WindowStyle Hidden `
            -PassThru
        $started = $proc.Id
    } catch {
        # *** Start-Process failed; emit started=null ***
    }
}

$result = @{
    stopped  = $stopped
    started  = $started
    logPath  = $logPath
    errPath  = $errPath
}
$result | ConvertTo-Json -Compress
exit 0
