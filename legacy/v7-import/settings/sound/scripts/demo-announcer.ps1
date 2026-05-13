# *** demo-announcer.ps1 ***
# *** Plays the running/complete demo for every skill in settings.json ***
# *** After each skill, plays the global completion handshake: "I am finishing, boss." ***

$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot -Parent
$settingsPath = Join-Path $root 'settings.json'
$cacheDir = Join-Path $root 'voice-samples\announcer'
$globalCacheDir = Join-Path $root 'voice-samples\global'
if (-not (Test-Path $cacheDir)) { New-Item -ItemType Directory -Path $cacheDir -Force | Out-Null }
if (-not (Test-Path $globalCacheDir)) { New-Item -ItemType Directory -Path $globalCacheDir -Force | Out-Null }

$s = Get-Content $settingsPath -Raw | ConvertFrom-Json
$baseUrl = $s.global.kokoroBaseUrl

Add-Type -AssemblyName presentationCore

function Synth($text, $voice, $vol, $speed, $outPath) {
    $body = @{
        input = $text
        voice = $voice
        response_format = 'mp3'
        speed = $speed
        volume_multiplier = $vol
    } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "$baseUrl/audio/speech" -Method Post -ContentType 'application/json' -Body $body -OutFile $outPath
}

function Play($file, $waitSec = 2.5, $vol = 1.0) {
    $p = New-Object System.Windows.Media.MediaPlayer
    $p.Volume = $vol
    $p.Open([System.Uri]::new($file))
    Start-Sleep -Milliseconds 350
    $p.Play()
    Start-Sleep -Seconds $waitSec
    $p.Stop()
    $p.Close()
}

# *** Pre-render the global STARTING phrase once (cached) ***
$startingMp3 = Join-Path $globalCacheDir 'starting-boss.mp3'
if (-not (Test-Path $startingMp3)) {
    Write-Host "[setup] caching global starting phrase..."
    Synth $s.global.starting.phrase $s.global.starting.voice $s.global.volumeMultiplier $s.global.speed $startingMp3
}

# *** Pre-render the global COMPLETION phrase once (cached) ***
$globalMp3 = Join-Path $globalCacheDir 'finishing-boss.mp3'
if (-not (Test-Path $globalMp3)) {
    Write-Host "[setup] caching global completion phrase..."
    Synth $s.global.completion.phrase $s.global.completion.voice $s.global.volumeMultiplier $s.global.speed $globalMp3
}

$i = 0
$total = ($s.skills.PSObject.Properties | Measure-Object).Count
foreach ($skillName in $s.skills.PSObject.Properties.Name) {
    $i++
    $skill = $s.skills.$skillName
    $voice = $skill.voice
    $vol = if ($skill.volumeMultiplier) { $skill.volumeMultiplier } else { $s.global.volumeMultiplier }
    $speed = if ($skill.speed) { $skill.speed } else { $s.global.speed }

    Write-Host ("[{0}/{1}] {2} - voice={3} vol={4}x speed={5}" -f $i, $total, $skillName, $voice, $vol, $speed)

    $runMp3 = Join-Path $cacheDir "$skillName-running.mp3"
    $cmpMp3 = Join-Path $cacheDir "$skillName-complete.mp3"
    Synth $skill.phrases.running $voice $vol $speed $runMp3
    Synth $skill.phrases.complete $voice $vol $speed $cmpMp3

    # *** Global STARTING handshake — bm_george, always before per-skill activation ***
    Play $startingMp3 2.0 $s.global.playerVolume
    foreach ($note in $s.global.starting.beep) {
        [console]::beep($note[0], $note[1])
    }
    Start-Sleep -Milliseconds 400

    # *** Per-skill running phrase ***
    Play $runMp3 2.5 $s.global.playerVolume
    Start-Sleep -Milliseconds 500
    Play $cmpMp3 2.5 $s.global.playerVolume

    # *** Per-skill beep signature ***
    $gap = if ($skill.beepGapMs) { $skill.beepGapMs } else { 0 }
    foreach ($note in $skill.beep) {
        [console]::beep($note[0], $note[1])
        if ($gap -gt 0) { Start-Sleep -Milliseconds $gap }
    }
    Start-Sleep -Milliseconds 400

    # *** Global COMPLETION handshake — bm_george, always after per-skill beep ***
    Play $globalMp3 2.5 $s.global.playerVolume
    foreach ($note in $s.global.completion.beep) {
        [console]::beep($note[0], $note[1])
    }
    Start-Sleep -Milliseconds 1200
}

# *** Mindset demos — Brain skill exposes ChatGPT/Claude/Gemini voices ***
if ($s.PSObject.Properties.Name -contains 'mindsets') {
    $mTotal = ($s.mindsets.PSObject.Properties | Where-Object { -not $_.Name.StartsWith('_') } | Measure-Object).Count
    $j = 0
    foreach ($mindsetName in $s.mindsets.PSObject.Properties.Name) {
        if ($mindsetName.StartsWith('_')) { continue }
        $j++
        $mindset = $s.mindsets.$mindsetName
        $voice = $mindset.voice
        $vol = if ($mindset.volumeMultiplier) { $mindset.volumeMultiplier } else { $s.global.volumeMultiplier }
        $speed = if ($mindset.speed) { $mindset.speed } else { $s.global.speed }

        Write-Host ("[mindset {0}/{1}] {2} - voice={3} vol={4}x speed={5}" -f $j, $mTotal, $mindsetName, $voice, $vol, $speed)

        $safeId = $mindsetName.ToLower()
        $runMp3 = Join-Path $cacheDir "$safeId-running.mp3"
        $cmpMp3 = Join-Path $cacheDir "$safeId-complete.mp3"
        Synth $mindset.phrases.running $voice $vol $speed $runMp3
        Synth $mindset.phrases.complete $voice $vol $speed $cmpMp3

        Play $startingMp3 2.0 $s.global.playerVolume
        foreach ($note in $s.global.starting.beep) { [console]::beep($note[0], $note[1]) }
        Start-Sleep -Milliseconds 400

        Play $runMp3 2.5 $s.global.playerVolume
        Start-Sleep -Milliseconds 500
        Play $cmpMp3 2.5 $s.global.playerVolume

        foreach ($note in $mindset.beep) { [console]::beep($note[0], $note[1]) }
        Start-Sleep -Milliseconds 400

        Play $globalMp3 2.5 $s.global.playerVolume
        foreach ($note in $s.global.completion.beep) { [console]::beep($note[0], $note[1]) }
        Start-Sleep -Milliseconds 1200
    }
}

Write-Host "`nAll skills + mindsets demoed."
