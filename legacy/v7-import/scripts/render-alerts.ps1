# *** render-alerts.ps1 ***
# *** Renders all 240 voice-alerts from C:\falcon\Brain\assets\voice-alerts.json ***
# *** Each mindset uses its own British male voice + slowed cadence (closest Kokoro approximation to Russian-accented English). ***
# *** After each mindset section finishes, plays a random alert from that mindset's "finished" category. ***

param(
    [string]$AlertsJson = 'C:\falcon\Brain\assets\voice-alerts.json',
    [string]$OutRoot = 'C:\falcon\Brain\settings\sound\voice-samples\alerts',
    [string]$KokoroBase = 'http://localhost:8880/v1'
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName presentationCore

# *** Per-mindset voice profiles — all British male, slowed for Russian-accent cadence, vol 8x ***
$mindsetVoice = @{
    'chatgpt' = @{ voice = 'bm_v0george'; speed = 0.85; vol = 8.0 }
    'claude'  = @{ voice = 'bm_v0lewis';  speed = 0.90; vol = 8.0 }
    'gemini'  = @{ voice = 'bm_daniel';   speed = 0.88; vol = 8.0 }
}

function Synth($text, $voice, $vol, $speed, $outPath) {
    $body = @{
        input             = $text
        voice             = $voice
        response_format   = 'mp3'
        speed             = $speed
        volume_multiplier = $vol
    } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$KokoroBase/audio/speech" -Method Post -ContentType 'application/json' -Body $body -OutFile $outPath
}

function Play($file, $waitSec = 3.0) {
    $p = New-Object System.Windows.Media.MediaPlayer
    $p.Volume = 1.0
    $p.Open([System.Uri]::new($file))
    Start-Sleep -Milliseconds 350
    $p.Play()
    Start-Sleep -Seconds $waitSec
    $p.Stop()
    $p.Close()
}

if (-not (Test-Path $AlertsJson)) { throw "voice-alerts.json not found at $AlertsJson" }
$alerts = Get-Content $AlertsJson -Raw | ConvertFrom-Json

$totalRendered = 0
foreach ($mindsetName in $alerts.PSObject.Properties.Name) {
    $vp = $mindsetVoice[$mindsetName.ToLower()]
    if (-not $vp) { Write-Host "[skip] no voice profile for $mindsetName"; continue }

    Write-Host "`n=== $mindsetName === voice=$($vp.voice) speed=$($vp.speed) vol=$($vp.vol)x"
    $mindsetSection = $alerts.$mindsetName

    foreach ($category in $mindsetSection.PSObject.Properties.Name) {
        $phrases = $mindsetSection.$category
        $catDir = Join-Path $OutRoot "$mindsetName\$category"
        if (-not (Test-Path $catDir)) { New-Item -ItemType Directory -Path $catDir -Force | Out-Null }

        for ($i = 0; $i -lt $phrases.Count; $i++) {
            $idx = '{0:D2}' -f ($i + 1)
            $outPath = Join-Path $catDir "$idx.mp3"
            Synth $phrases[$i] $vp.voice $vp.vol $vp.speed $outPath
            $totalRendered++
        }
        Write-Host ("  [{0}] {1} files -> {2}" -f $category, $phrases.Count, $catDir)
    }

    # *** Section finished — play random "finished" alert from this mindset ***
    $finishedDir = Join-Path $OutRoot "$mindsetName\finished"
    $finishedFiles = Get-ChildItem -Path $finishedDir -Filter '*.mp3'
    if ($finishedFiles.Count -gt 0) {
        $pick = $finishedFiles | Get-Random
        Write-Host ("  -> playing random finished: {0}" -f $pick.Name)
        Play $pick.FullName 3.5
    }
}

Write-Host "`n=== Rendered $totalRendered files to $OutRoot ==="

# *** Grand finale — random finished from a random mindset ***
$allMindsets = $alerts.PSObject.Properties.Name
$grandMindset = $allMindsets | Get-Random
$grandDir = Join-Path $OutRoot "$grandMindset\finished"
$grandPick = Get-ChildItem -Path $grandDir -Filter '*.mp3' | Get-Random
Write-Host ("Grand finale: {0} / {1}" -f $grandMindset, $grandPick.Name)
Play $grandPick.FullName 4.0
