# *** flip-job-status.ps1 ***
# *** Flips 'Status: DEFERRED' to 'Status: DONE (YYYY-MM-DD)' for completed night-mode jobs ***
# *** Idempotent — re-running on already-DONE files is a no-op. ***

param(
    [string]$Date = '2026-05-01',
    [string[]]$Jobs = @(
        'full-pipeline-redesign',
        'prompt-1-brain-structure',
        'prompt-2-session-health-daemon',
        'prompt-3-brain-integration',
        'analysis-output-structure',
        'test-cases-for-all-prds'
    ),
    [string]$JobsRoot = 'C:\falcon\Brain\jobs'
)
$ErrorActionPreference = 'Stop'
$flipped = 0
foreach ($j in $Jobs) {
    $f = Join-Path $JobsRoot "$j.md"
    if (-not (Test-Path $f)) { Write-Host "  SKIP missing: $f"; continue }
    $c = [System.IO.File]::ReadAllText($f)
    $orig = $c
    $c = $c.Replace("## Status`n`nDEFERRED.", "## Status`n`nDONE ($Date).")
    $c = $c.Replace("## Status`n`nDEFERRED", "## Status`n`nDONE ($Date)")
    if ($c -ne $orig) {
        [System.IO.File]::WriteAllText($f, $c, [System.Text.UTF8Encoding]::new($false))
        $flipped++
        Write-Host "  + $j"
    } else {
        Write-Host "  - $j (already done or no DEFERRED marker)"
    }
}
Write-Host ""
Write-Host "Flipped $flipped of $($Jobs.Count) job specs to DONE ($Date)."
