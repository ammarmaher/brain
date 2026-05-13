# *** render-mindset.ps1 ***
# *** Renders ONE mindset's 80 voice-alerts. Designed to run in parallel — 3 instances total. ***
# *** Usage: scripts\render-mindset.ps1 -Mindset chatgpt -Voice bm_v0george -Speed 0.85 [-Quiet] ***

param(
    [Parameter(Mandatory)] [string]$Mindset,
    [Parameter(Mandatory)] [string]$Voice,
    [Parameter(Mandatory)] [double]$Speed,
    [switch]$Quiet,
    [string]$AlertsJson = 'C:\falcon\Brain\assets\voice-alerts.json',
    [string]$OutRoot = 'C:\falcon\Brain\settings\sound\voice-samples\alerts',
    [string]$KokoroBase = 'http://localhost:8880/v1',
    [double]$Vol = 8.0
)
$ErrorActionPreference = 'Stop'

$here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$picker = Join-Path $here 'play-alert-context.ps1'

$alerts = Get-Content $AlertsJson -Raw | ConvertFrom-Json
$mindsetSection = $alerts.$Mindset
if (-not $mindsetSection) { throw "mindset $Mindset not found in $AlertsJson" }

$count = 0
foreach ($category in $mindsetSection.PSObject.Properties.Name) {
    $phrases = $mindsetSection.$category
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
        try {
            Invoke-RestMethod -Uri "$KokoroBase/audio/speech" -Method Post -ContentType 'application/json' -Body $body -OutFile $outPath -TimeoutSec 60
            $count++
        }
        catch {
            Write-Host "[$Mindset] FAIL $category/$idx : $_"
        }
    }
}
Write-Host "[$Mindset] rendered $count files"

# *** End alert: artifacts deployed but NOT tested in this script ***
if (-not $Quiet) {
    try { & $picker -Mindset claude -Category deployment -Tested:$false | Out-Null } catch { }
}
