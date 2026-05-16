# *** play-alert-context.ps1 ***
# *** State-aware alert picker. Filters phrases by what is actually true right now. ***
# *** Never plays a phrase claiming a state ($Tested, $Reviewed, etc.) that is currently false. ***
# *** Paths derived from $PSScriptRoot so the script is portable across Brain migrations. ***

param(
    [Parameter(Mandatory)] [ValidateSet('chatgpt', 'claude', 'gemini')] [string]$Mindset,
    [Parameter(Mandatory)] [ValidateSet('taskReceived', 'deepAnalysis', 'processing', 'deployment', 'testing', 'finished', 'blocked', 'waitingForInput')] [string]$Category,
    [bool]$Tested,
    [bool]$Reviewed,
    [bool]$Deployed,
    [bool]$Validated,
    [bool]$TestsAuthored,
    [bool]$Approved,
    [string]$AlertsRoot,
    [string]$ClaimsJson
)
$ErrorActionPreference = 'Continue'

$here = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $AlertsRoot) { $AlertsRoot = Join-Path $here 'sound\voice-samples\alerts' }
if (-not $ClaimsJson) { $ClaimsJson = Join-Path $here 'assets\voice-alerts-claims.json' }

# *** State flag map: claim string -> boolean truth ***
$state = @{
    'tested'         = [bool]$Tested
    'reviewed'       = [bool]$Reviewed
    'deployed'       = [bool]$Deployed
    'validated'      = [bool]$Validated
    'tests_authored' = [bool]$TestsAuthored
    'approved'       = [bool]$Approved
}

if (-not (Test-Path -LiteralPath $ClaimsJson)) {
    Write-Warning "claims sidecar missing: $ClaimsJson"
    exit 0
}

$dir = Join-Path $AlertsRoot "$Mindset\$Category"
if (-not (Test-Path -LiteralPath $dir)) {
    Write-Warning "alerts directory not found: $dir"
    exit 0
}

# *** Load claims sidecar ***
$claims = Get-Content -LiteralPath $ClaimsJson -Raw | ConvertFrom-Json
$catNode = $claims.$Mindset.$Category
if (-not $catNode) {
    Write-Warning "no claims node for $Mindset/$Category"
    exit 0
}

# *** Build eligible pool: every claim must be currently true ***
$eligible = @()
$claimFree = @()
foreach ($idx in @('01', '02', '03', '04', '05', '06', '07', '08', '09', '10')) {
    $entry = $catNode.$idx
    if (-not $entry) { continue }
    $arr = @($entry.claims)
    $allTrue = $true
    foreach ($c in $arr) {
        if (-not $state.ContainsKey($c) -or -not $state[$c]) { $allTrue = $false; break }
    }
    if ($allTrue) { $eligible += $idx }
    if ($arr.Count -eq 0) { $claimFree += $idx }
}

if ($eligible.Count -eq 0) {
    if ($claimFree.Count -eq 0) {
        Write-Warning "[$Mindset/$Category] no eligible phrases for current state and no claim-free fallback"
        exit 0
    }
    $eligible = $claimFree
}

# *** Pick one and play ***
$pickIdx = $eligible | Get-Random
$mp3 = Join-Path $dir "$pickIdx.mp3"
if (-not (Test-Path -LiteralPath $mp3)) {
    Write-Warning "selected mp3 missing: $mp3"
    exit 0
}

Write-Host ("[{0}/{1}] -> {2}.mp3 (eligible={3}/10)" -f $Mindset, $Category, $pickIdx, $eligible.Count)

try {
    Add-Type -AssemblyName presentationCore -ErrorAction Stop
    $p = New-Object System.Windows.Media.MediaPlayer
    $p.Volume = 1.0
    $p.Open([System.Uri]::new($mp3))
    Start-Sleep -Milliseconds 350
    $p.Play()
    # *** Wait for natural duration; fall back to 3.5s if metadata not yet loaded ***
    $dur = 3.5
    for ($i = 0; $i -lt 20; $i++) {
        if ($p.NaturalDuration.HasTimeSpan) {
            $dur = $p.NaturalDuration.TimeSpan.TotalSeconds + 0.5
            break
        }
        Start-Sleep -Milliseconds 100
    }
    Start-Sleep -Seconds $dur
    $p.Stop()
    $p.Close()
} catch {
    Write-Warning "playback failed: $($_.Exception.Message)"
    exit 0
}
