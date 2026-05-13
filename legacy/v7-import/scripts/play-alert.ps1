# *** play-alert.ps1 ***
# *** Picks a random voice-alert mp3 for the given mindset/category and plays it. ***
# *** Usage: scripts\play-alert.ps1 -Mindset chatgpt -Category finished ***
# *** Categories: taskReceived deepAnalysis processing deployment testing finished blocked waitingForInput ***

param(
    [Parameter(Mandatory)] [ValidateSet('chatgpt', 'claude', 'gemini')] [string]$Mindset,
    [Parameter(Mandatory)] [ValidateSet('taskReceived', 'deepAnalysis', 'processing', 'deployment', 'testing', 'finished', 'blocked', 'waitingForInput')] [string]$Category,
    [string]$AlertsRoot = 'C:\falcon\Brain\settings\sound\voice-samples\alerts',
    [double]$WaitSec = 3.5
)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName presentationCore

$dir = Join-Path $AlertsRoot "$Mindset\$Category"
if (-not (Test-Path $dir)) { throw "alerts directory not found: $dir (run render-alerts.ps1 first)" }

$files = Get-ChildItem -Path $dir -Filter '*.mp3'
if ($files.Count -eq 0) { throw "no mp3s in $dir" }

$pick = $files | Get-Random
Write-Host ("[{0}/{1}] -> {2}" -f $Mindset, $Category, $pick.Name)

$p = New-Object System.Windows.Media.MediaPlayer
$p.Volume = 1.0
$p.Open([System.Uri]::new($pick.FullName))
Start-Sleep -Milliseconds 350
$p.Play()
Start-Sleep -Seconds $WaitSec
$p.Stop()
$p.Close()
