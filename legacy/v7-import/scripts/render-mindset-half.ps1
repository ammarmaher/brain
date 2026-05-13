# *** render-mindset-half.ps1 ***
# *** Renders HALF of one mindset's alerts (4 of 8 categories). 6 instances run in parallel. ***
# *** Includes retry on transient connection errors. ***
# *** Usage: scripts\render-mindset-half.ps1 -Mindset chatgpt -Half A -Voice bm_v0george -Speed 0.85 -Vol 8.0 [-Quiet] ***

param(
    [Parameter(Mandatory)] [string]$Mindset,
    [Parameter(Mandatory)] [ValidateSet('A', 'B')] [string]$Half,
    [Parameter(Mandatory)] [string]$Voice,
    [Parameter(Mandatory)] [double]$Speed,
    [switch]$Quiet,
    [double]$Vol = 8.0,
    [string]$AlertsJson = 'C:\falcon\Brain\assets\voice-alerts.json',
    [string]$OutRoot = 'C:\falcon\Brain\settings\sound\voice-samples\alerts',
    [string]$KokoroBase = 'http://localhost:8880/v1',
    [int]$MaxRetries = 3
)
$ErrorActionPreference = 'Stop'

$here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$picker = Join-Path $here 'play-alert-context.ps1'

$alerts = Get-Content $AlertsJson -Raw | ConvertFrom-Json
$mindsetSection = $alerts.$Mindset
if (-not $mindsetSection) { throw "mindset $Mindset not found in $AlertsJson" }

$halfA = @('taskReceived', 'deepAnalysis', 'processing', 'deployment')
$halfB = @('testing', 'finished', 'blocked', 'waitingForInput')
$cats = if ($Half -eq 'A') { $halfA } else { $halfB }

$ok = 0; $fail = 0
foreach ($category in $cats) {
    $phrases = $mindsetSection.$category
    if (-not $phrases) { continue }
    $catDir = Join-Path $OutRoot "$Mindset\$category"
    if (-not (Test-Path $catDir)) { New-Item -ItemType Directory -Path $catDir -Force | Out-Null }
    for ($i = 0; $i -lt $phrases.Count; $i++) {
        $idx = '{0:D2}' -f ($i + 1)
        $outPath = Join-Path $catDir "$idx.mp3"
        $body = @{
            input             = $phrases[$i]
            voice             = $Voice
            response_format   = 'mp3'
            speed             = $Speed
            volume_multiplier = $Vol
        } | ConvertTo-Json -Compress
        $tries = 0
        while ($true) {
            try {
                Invoke-RestMethod -Uri "$KokoroBase/audio/speech" -Method Post -ContentType 'application/json' -Body $body -OutFile $outPath -TimeoutSec 90
                $ok++
                break
            }
            catch {
                $tries++
                if ($tries -ge $MaxRetries) {
                    Write-Host "[$Mindset/$Half] FAIL $category/$idx after $tries tries"
                    $fail++
                    break
                }
                Start-Sleep -Milliseconds (500 * $tries)
            }
        }
    }
}
Write-Host "[$Mindset/$Half] ok=$ok fail=$fail"

# *** End alert: artifacts deployed but NOT tested in this script ***
if (-not $Quiet) {
    try { & $picker -Mindset claude -Category deployment -Tested:$false | Out-Null } catch { }
}
