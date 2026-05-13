# *** render-all-sequential.ps1 ***
# *** Renders all 12 envelope mp3s + 240 alerts ONE BY ONE (sequential). ***
# *** Retries on Kokoro errors with backoff. Idempotent — skips files that already exist if -SkipExisting is set. ***
# *** Usage: scripts\render-all-sequential.ps1 [-SkipExisting] [-Quiet] ***

param(
    [switch]$SkipExisting,
    [switch]$Quiet,
    [string]$AlertsJson = 'C:\falcon\Brain\assets\voice-alerts.json',
    [string]$AnnouncerOut = 'C:\falcon\Brain\settings\sound\voice-samples\announcer',
    [string]$AlertsOut = 'C:\falcon\Brain\settings\sound\voice-samples\alerts',
    [string]$KokoroBase = 'http://localhost:8880/v1',
    [int]$MaxRetries = 6,
    [int]$BaseBackoffMs = 1000
)
$ErrorActionPreference = 'Stop'

$here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$picker = Join-Path $here 'play-alert-context.ps1'

# *** Start alert: rendering work in progress ***
if (-not $Quiet) {
    try { & $picker -Mindset claude -Category processing | Out-Null } catch { }
}

$mindsetVoice = @{
    'chatgpt' = @{ voice = 'bm_v0george'; speed = 0.85; vol = 8.0 }
    'claude'  = @{ voice = 'bm_v0lewis';  speed = 0.9;  vol = 8.0 }
    'gemini'  = @{ voice = 'bm_v0george'; speed = 0.78; vol = 4.0 }
}
$brainVoice = @{ voice = 'bm_v0george'; speed = 0.88; vol = 8.0 }

function Synth-Retry($text, $voice, $vol, $speed, $outPath) {
    $body = @{
        input             = $text
        voice             = $voice
        response_format   = 'mp3'
        speed             = $speed
        volume_multiplier = $vol
    } | ConvertTo-Json -Compress
    for ($t = 1; $t -le $MaxRetries; $t++) {
        try {
            Invoke-RestMethod -Uri "$KokoroBase/audio/speech" -Method Post -ContentType 'application/json' -Body $body -OutFile $outPath -TimeoutSec 90
            return $true
        }
        catch {
            if ($t -ge $MaxRetries) {
                Write-Host "  FAIL $outPath after $t tries: $_"
                return $false
            }
            Start-Sleep -Milliseconds ($BaseBackoffMs * $t)
        }
    }
}

if (-not (Test-Path $AnnouncerOut)) { New-Item -ItemType Directory -Path $AnnouncerOut -Force | Out-Null }
if (-not (Test-Path $AlertsOut)) { New-Item -ItemType Directory -Path $AlertsOut -Force | Out-Null }

$envelopeJobs = @(
    @{ name = 'brain-running';     text = 'Brain online, comrade.';   v = $brainVoice }
    @{ name = 'brain-working';     text = 'Brain working.';            v = $brainVoice }
    @{ name = 'brain-complete';    text = 'Brain complete.';           v = $brainVoice }
    @{ name = 'chatgpt-running';   text = 'ChatGPT engaged, comrade.'; v = $mindsetVoice.chatgpt }
    @{ name = 'chatgpt-working';   text = 'ChatGPT analysing.';        v = $mindsetVoice.chatgpt }
    @{ name = 'chatgpt-complete';  text = 'ChatGPT complete.';         v = $mindsetVoice.chatgpt }
    @{ name = 'claude-running';    text = 'Claude engaged, comrade.';  v = $mindsetVoice.claude }
    @{ name = 'claude-working';    text = 'Claude implementing.';      v = $mindsetVoice.claude }
    @{ name = 'claude-complete';   text = 'Claude complete.';          v = $mindsetVoice.claude }
    @{ name = 'gemini-running';    text = 'Gemini engaged, comrade.';  v = $mindsetVoice.gemini }
    @{ name = 'gemini-working';    text = 'Gemini reviewing.';         v = $mindsetVoice.gemini }
    @{ name = 'gemini-complete';   text = 'Gemini complete.';          v = $mindsetVoice.gemini }
)
Write-Host "=== Phase 1: 12 envelope mp3s ==="
foreach ($j in $envelopeJobs) {
    $out = Join-Path $AnnouncerOut "$($j.name).mp3"
    if ($SkipExisting -and (Test-Path $out)) { Write-Host "  skip $($j.name)"; continue }
    if (Synth-Retry $j.text $j.v.voice $j.v.vol $j.v.speed $out) { Write-Host "  + $($j.name).mp3" }
}

Write-Host "`n=== Phase 2: 240 alerts (sequential) ==="
$alerts = Get-Content $AlertsJson -Raw | ConvertFrom-Json
$total = 0
foreach ($mindsetName in @('chatgpt', 'claude', 'gemini')) {
    $vp = $mindsetVoice[$mindsetName]
    $section = $alerts.$mindsetName
    Write-Host "--- $mindsetName ($($vp.voice) speed=$($vp.speed) vol=$($vp.vol)) ---"
    foreach ($category in $section.PSObject.Properties.Name) {
        $phrases = $section.$category
        $catDir = Join-Path $AlertsOut "$mindsetName\$category"
        if (-not (Test-Path $catDir)) { New-Item -ItemType Directory -Path $catDir -Force | Out-Null }
        for ($i = 0; $i -lt $phrases.Count; $i++) {
            $idx = '{0:D2}' -f ($i + 1)
            $out = Join-Path $catDir "$idx.mp3"
            if ($SkipExisting -and (Test-Path $out) -and (Get-Item $out).Length -gt 1000) { $total++; continue }
            if (Synth-Retry $phrases[$i] $vp.voice $vp.vol $vp.speed $out) { $total++ }
        }
        Write-Host "  $category done"
    }
}
Write-Host "`nDONE: rendered $total alert files"

# *** End alert: artifacts deployed but NOT tested in this script ***
if (-not $Quiet) {
    try { & $picker -Mindset claude -Category deployment -Tested:$false | Out-Null } catch { }
}
