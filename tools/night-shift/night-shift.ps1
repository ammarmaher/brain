# *** Falcon Night Shift — Autonomous overnight orchestrator ***
# *** Read-only on Falcon repos; writes only to Brain Outputs/reports/night-shift/ ***
# *** Honors NIGHT_SHIFT_BOUNDARIES.md ***
#
# What this run does (tonight, minimum-viable):
#   1. HEALTH CHECK - verify boundaries, output dirs, detector engines parse
#   2. GIT FETCH   - read-only fetch on all Falcon repos
#   3. CODE AUDIT  - run regex + structural detectors against all repos
#   4. BRIEFING    - write morning-briefing-YYYY-MM-DD.md
#
# What this run NEVER does:
#   - commit / push on any Falcon source repo
#   - edit any file under apps/ libs/ src/
#   - call Brain APIs (kept idle until Session 3.x)
#   - run AST detectors (scaffold only)
#
# Launch:
#   powershell -ExecutionPolicy Bypass -File ".\night-shift.ps1"
#
# Output:
#   C:\Falcon\Brain Outputs\reports\night-shift\<run-id>\
#     pre-flight.json
#     git-fetch-results.json
#     audit\AUDIT_SUMMARY.md (+ violations.jsonl + per-rule + per-file + high-severity)
#     run-summary.json
#     morning-briefing-YYYY-MM-DD.md   <-- this is what you read in the morning

[CmdletBinding()]
param(
  [string]   $RunId        = ('night-shift-' + (Get-Date -Format 'yyyy-MM-dd-HHmm')),
  [string]   $BrainSkPath  = 'C:\Falcon\Brain SK',
  [string]   $RulesFolder  = 'C:\Falcon\Brain Outputs\understanding\rules',
  [string]   $FalconRoot   = 'C:\Falcon\Falcon',
  [string]   $OutputRoot   = 'C:\Falcon\Brain Outputs\reports\night-shift',
  [string]   $BoundariesFile = 'C:\Falcon\Brain\NIGHT_SHIFT_BOUNDARIES.md',
  [switch]   $SkipFetch,
  [switch]   $SkipAudit,
  [switch]   $DryRun
)

$ErrorActionPreference = 'Continue'   # Don't halt the whole night on one error
$start = Get-Date
$nowIso = $start.ToUniversalTime().ToString('o')

$OutputFolder = Join-Path $OutputRoot $RunId
if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Force -Path $OutputFolder | Out-Null }

# --------------------------------------------------------------
# Banner
# --------------------------------------------------------------
$banner = @"

==================================================================
  FALCON NIGHT SHIFT
  Run ID    : $RunId
  Started   : $($start.ToString('yyyy-MM-dd HH:mm:ss'))
  Output    : $OutputFolder
  Dry run   : $DryRun
==================================================================

"@
Write-Host $banner
$banner | Out-File (Join-Path $OutputFolder 'banner.txt') -Encoding UTF8

# --------------------------------------------------------------
# STEP 1 - Health check
# --------------------------------------------------------------
Write-Host '[1/4] HEALTH CHECK'
$health = [ordered]@{
  boundariesPresent       = (Test-Path $BoundariesFile)
  rulesFolderPresent      = (Test-Path $RulesFolder)
  brainSkPresent          = (Test-Path $BrainSkPath)
  falconRootPresent       = (Test-Path $FalconRoot)
  detectorsFolderPresent  = (Test-Path (Join-Path $RulesFolder 'detectors'))
  brainSkWorkingTreeDirty = $null
  detectedRepos           = @()
  startedAt               = $nowIso
}

if (Test-Path (Join-Path $BrainSkPath '.git')) {
  Push-Location $BrainSkPath
  try {
    $status = git status --porcelain
    $health.brainSkWorkingTreeDirty = ([bool]$status)
    $health.brainSkDirtyFiles = ($status | Measure-Object).Count
  } finally { Pop-Location }
}

if ($health.falconRootPresent) {
  $health.detectedRepos = Get-ChildItem $FalconRoot -Directory |
    Where-Object { $_.Name -like 'falcon-*' -and (Test-Path (Join-Path $_.FullName '.git')) } |
    Select-Object -ExpandProperty FullName
}

$health | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $OutputFolder 'pre-flight.json') -Encoding UTF8

$mustBeTrue = @('boundariesPresent','rulesFolderPresent','brainSkPresent','falconRootPresent','detectorsFolderPresent')
$abort = $false
foreach ($k in $mustBeTrue) {
  if (-not $health[$k]) {
    Write-Warning "  Health check FAIL: $k"
    $abort = $true
  }
}
if ($abort) {
  Write-Warning '  Aborting night shift due to failed health checks.'
  "# Night Shift Aborted - $RunId`n`nPre-flight failed. See pre-flight.json." |
    Set-Content (Join-Path $OutputFolder 'night-shift-aborted.md') -Encoding UTF8
  return
}

Write-Host "  Boundaries present : OK"
Write-Host "  Rules folder       : OK"
Write-Host "  Detectors folder   : OK"
Write-Host "  Falcon repos found : $($health.detectedRepos.Count)"
Write-Host "  Brain SK dirty     : $($health.brainSkWorkingTreeDirty) ($($health.brainSkDirtyFiles) files)"
Write-Host ''

# --------------------------------------------------------------
# STEP 2 - Git fetch (read-only)
# --------------------------------------------------------------
$fetchResults = @()
if (-not $SkipFetch) {
  Write-Host '[2/4] GIT FETCH (read-only)'
  foreach ($repo in $health.detectedRepos) {
    $name = Split-Path $repo -Leaf
    Push-Location $repo
    try {
      $t0 = Get-Date
      $output = if ($DryRun) { '(dry-run: skipped)' } else { (git fetch --all --quiet 2>&1) -join "`n" }
      $t1 = Get-Date
      $aheadBehind = $null
      try {
        $branch = (git rev-parse --abbrev-ref HEAD).Trim()
        $tracking = (git rev-parse --abbrev-ref "@{u}" 2>$null).Trim()
        if ($tracking) {
          $ab = (git rev-list --left-right --count "$tracking...HEAD" 2>$null).Trim() -split '\s+'
          if ($ab.Count -eq 2) {
            $aheadBehind = @{ behind = [int]$ab[0]; ahead = [int]$ab[1]; branch = $branch; tracking = $tracking }
          }
        }
      } catch { }
      $fetchResults += [PSCustomObject]@{
        repo        = $name
        durationSec = [math]::Round(($t1 - $t0).TotalSeconds, 1)
        output      = $output
        aheadBehind = $aheadBehind
      }
      $ab = if ($aheadBehind) { "branch=$($aheadBehind.branch) behind=$($aheadBehind.behind) ahead=$($aheadBehind.ahead)" } else { 'no tracking' }
      Write-Host "  $name : $ab"
    } finally { Pop-Location }
  }
  $fetchResults | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $OutputFolder 'git-fetch-results.json') -Encoding UTF8
  Write-Host ''
} else {
  Write-Host '[2/4] GIT FETCH (skipped)'
  Write-Host ''
}

# --------------------------------------------------------------
# STEP 3 - Code audit (regex + structural)
# --------------------------------------------------------------
$auditCounts = @{ totalViolations = 0; mustCount = 0; shouldCount = 0; reposScanned = 0 }
if (-not $SkipAudit) {
  Write-Host '[3/4] CODE AUDIT (regex + structural)'
  $auditOut = Join-Path $OutputFolder 'audit'
  if (-not (Test-Path $auditOut)) { New-Item -ItemType Directory -Force -Path $auditOut | Out-Null }
  $detector = Join-Path $RulesFolder 'detectors\audit-orchestrator.ps1'
  if (Test-Path $detector) {
    try {
      & $detector `
          -RulesFolder $RulesFolder `
          -TargetRepos $health.detectedRepos `
          -OutputFolder $auditOut `
          -RunId $RunId `
          -SkipAst `
          -SkipSemantic 2>&1 | ForEach-Object { Write-Host "  $_" }
    } catch {
      Write-Warning "  audit-orchestrator failed: $_"
    }
    $vfile = Join-Path $auditOut 'violations.jsonl'
    if (Test-Path $vfile) {
      $violations = Get-Content $vfile | Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json }
      $real = $violations | Where-Object { $_.severity -ne 'fyi' -and $_.ruleId -notlike '(scaffold)' }
      $auditCounts.totalViolations = $real.Count
      $auditCounts.mustCount       = ($real | Where-Object { $_.severity -eq 'must' }).Count
      $auditCounts.shouldCount     = ($real | Where-Object { $_.severity -eq 'should' }).Count
      $auditCounts.reposScanned    = $health.detectedRepos.Count
    }
  } else {
    Write-Warning "  audit-orchestrator.ps1 not found at $detector"
  }
  Write-Host ''
} else {
  Write-Host '[3/4] CODE AUDIT (skipped)'
  Write-Host ''
}

# --------------------------------------------------------------
# STEP 4 - Morning briefing
# --------------------------------------------------------------
Write-Host '[4/4] MORNING BRIEFING'
$end = Get-Date
$durationMin = [math]::Round(($end - $start).TotalMinutes, 1)
$briefingDate = $end.ToString('yyyy-MM-dd')
$briefingFile = Join-Path $OutputFolder "morning-briefing-$briefingDate.md"

# Pull top violations from audit if present
$topViolations = @()
$vfile = Join-Path $OutputFolder 'audit\violations.jsonl'
if (Test-Path $vfile) {
  $all = Get-Content $vfile | Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json }
  $topViolations = $all | Where-Object { $_.severity -eq 'must' -and $_.ruleId -notlike '(scaffold)' } |
                   Group-Object ruleId | Sort-Object Count -Descending | Select-Object -First 5
}

$briefing = @"
---
type: briefing
runId: $RunId
generatedAt: $($end.ToUniversalTime().ToString('o'))
duration: $durationMin min
---

# Morning Briefing - $briefingDate

> Night shift completed at $($end.ToString('HH:mm')) after $durationMin min.
> Read this first; everything else is in [$RunId]($OutputFolder).

## TL;DR

| Metric | Value |
|---|---|
| Falcon repos scanned | $($auditCounts.reposScanned) |
| Total real violations | **$($auditCounts.totalViolations)** |
| High severity (must) | $($auditCounts.mustCount) |
| Should | $($auditCounts.shouldCount) |
| Git fetch status | $(if ($fetchResults.Count) {"$($fetchResults.Count) repos fetched"} else {'skipped'}) |
| Brain SK dirty entering run | $($health.brainSkDirtyFiles) files |

## Repo sync (from git fetch)

| Repo | Branch | Behind | Ahead |
|---|---|---|---|
"@

foreach ($f in $fetchResults) {
  if ($f.aheadBehind) {
    $briefing += "`n| $($f.repo) | $($f.aheadBehind.branch) | $($f.aheadBehind.behind) | $($f.aheadBehind.ahead) |"
  } else {
    $briefing += "`n| $($f.repo) | (no tracking) | - | - |"
  }
}

$briefing += @"


## Top 5 rule violations

| Rank | Rule | Count | Severity | Example file |
|---|---|---|---|---|
"@

$rank = 1
foreach ($g in $topViolations) {
  $sample = $g.Group[0]
  $briefing += "`n| $rank | ``$($sample.ruleId)`` $($sample.ruleName) | $($g.Count) | $($sample.severity) | ``$($sample.filePath)`` |"
  $rank++
}
if ($topViolations.Count -eq 0) {
  $briefing += "`n| - | (no high-severity violations) | 0 | - | - |"
}

$briefing += @"


## Decisions queued for you

- (none yet - Session 3.x will start emitting decisions)

## Run artifacts

- [audit\AUDIT_SUMMARY.md]($OutputFolder\audit\AUDIT_SUMMARY.md)
- [audit\high-severity.md]($OutputFolder\audit\high-severity.md)
- [audit\violations-by-rule.md]($OutputFolder\audit\violations-by-rule.md)
- [audit\violations-by-file.md]($OutputFolder\audit\violations-by-file.md)
- [git-fetch-results.json]($OutputFolder\git-fetch-results.json)
- [pre-flight.json]($OutputFolder\pre-flight.json)
- [run-summary.json]($OutputFolder\run-summary.json)

## What night shift did NOT do (per boundary doctrine)

- No commits on any Falcon source repo
- No pushes anywhere
- No file edits under ``apps/`` ``libs/`` ``src/``
- No Brain API calls (semantic-judge is dry-run only tonight)
- AST detectors (FE/BE) are scaffolded only; not yet wired

## Next step when you wake up

1. Open ``audit\high-severity.md`` - scan top 10 lines
2. Skim ``audit\AUDIT_SUMMARY.md`` for false-positive patterns
3. If a rule is too noisy, add to ``exemptions\EXEMPTIONS.md`` or tighten the rule
4. Tell me ``Session 3`` to wire AST runners + semantic judge

---

*Generated by Falcon Night Shift v0.1 - Session 2.x*
"@

$briefing | Set-Content $briefingFile -Encoding UTF8
Write-Host "  Briefing written: $briefingFile"

# --------------------------------------------------------------
# Run summary
# --------------------------------------------------------------
$summary = [ordered]@{
  runId           = $RunId
  startedAt       = $nowIso
  finishedAt      = $end.ToUniversalTime().ToString('o')
  durationMin     = $durationMin
  reposScanned    = $auditCounts.reposScanned
  totalViolations = $auditCounts.totalViolations
  mustCount       = $auditCounts.mustCount
  shouldCount     = $auditCounts.shouldCount
  fetchCount      = $fetchResults.Count
  briefingFile    = $briefingFile
  dryRun          = [bool]$DryRun
}
$summary | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $OutputFolder 'run-summary.json') -Encoding UTF8

# Append to run index
$indexFile = Join-Path $OutputRoot 'INDEX.md'
if (-not (Test-Path $indexFile)) {
  "# Night Shift run log`n`n| Run ID | Started | Duration | Repos | Violations | Must | Should |`n|---|---|---|---|---|---|---|" | Set-Content $indexFile -Encoding UTF8
}
"| $RunId | $($start.ToString('yyyy-MM-dd HH:mm')) | $durationMin min | $($auditCounts.reposScanned) | $($auditCounts.totalViolations) | $($auditCounts.mustCount) | $($auditCounts.shouldCount) |" | Add-Content $indexFile -Encoding UTF8

# Final banner
Write-Host @"

==================================================================
  FALCON NIGHT SHIFT - COMPLETE
  Duration       : $durationMin min
  Repos scanned  : $($auditCounts.reposScanned)
  Violations     : $($auditCounts.totalViolations) (must=$($auditCounts.mustCount) should=$($auditCounts.shouldCount))
  Briefing       : $briefingFile
==================================================================

"@
