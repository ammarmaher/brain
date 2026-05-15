# *** Falcon Rulebook — Audit Orchestrator ***
# *** Runs every detector engine in sequence, merges JSONL streams, writes the morning briefing reports ***

[CmdletBinding()]
param(
  [Parameter(Mandatory)] [string]   $RulesFolder,
  [Parameter(Mandatory)] [string[]] $TargetRepos,
  [Parameter(Mandatory)] [string]   $OutputFolder,
  [string] $RunId = ('audit-' + (Get-Date -Format 'yyyyMMddHHmmss')),
  [string[]] $OnlyRules = @(),
  [switch] $SkipRegex,
  [switch] $SkipStructural,
  [switch] $SkipAst,
  [switch] $SkipSemantic
)

$ErrorActionPreference = 'Stop'
$start = Get-Date
$nowIso = $start.ToUniversalTime().ToString('o')

if (-not (Test-Path $OutputFolder)) { New-Item -ItemType Directory -Force -Path $OutputFolder | Out-Null }

$violationsAll = Join-Path $OutputFolder 'violations.jsonl'
if (Test-Path $violationsAll) { Remove-Item $violationsAll -Force }
New-Item -ItemType File -Force -Path $violationsAll | Out-Null

$engineLog = Join-Path $OutputFolder 'engine-runtimes.md'
"# Engine runtimes — $RunId`n" | Set-Content $engineLog

Write-Host ""
Write-Host "================================================================"
Write-Host "  Falcon Rulebook — Audit Orchestrator"
Write-Host "  Run ID  : $RunId"
Write-Host "  Targets : $($TargetRepos.Count) repos"
Write-Host "  Output  : $OutputFolder"
Write-Host "================================================================"
Write-Host ""

function Invoke-Engine {
  param([string]$Name, [scriptblock]$Run)
  $t0 = Get-Date
  Write-Host "▶ $Name"
  try {
    & $Run
    $ok = $true
    $err = $null
  } catch {
    $ok = $false
    $err = $_.Exception.Message
    Write-Warning "  $Name failed: $err"
  }
  $t1 = Get-Date
  $dur = ($t1 - $t0).TotalSeconds
  "| $Name | $($t1.ToString('HH:mm:ss')) | $([math]::Round($dur,1))s | $(if ($ok) {'OK'} else {'FAIL'}) | $err |" | Add-Content $engineLog
}

"`n| Engine | Finished | Duration | Status | Error |`n|---|---|---|---|---|`n" | Add-Content $engineLog

# ----------------------------------------------------------------
# Run engines
# ----------------------------------------------------------------

if (-not $SkipRegex) {
  $out = Join-Path $OutputFolder 'violations-regex.jsonl'
  Invoke-Engine 'regex-runner' {
    & (Join-Path $PSScriptRoot 'regex-runner.ps1') `
        -RulesFolder $RulesFolder -TargetRepos $TargetRepos -OutputFile $out -RunId $RunId -OnlyRules $OnlyRules
  }
  if (Test-Path $out) { Get-Content $out | Add-Content $violationsAll }
}

if (-not $SkipStructural) {
  $out = Join-Path $OutputFolder 'violations-structural.jsonl'
  Invoke-Engine 'structural-walker' {
    & (Join-Path $PSScriptRoot 'structural-walker.ps1') `
        -RulesFolder $RulesFolder -TargetRepos $TargetRepos -OutputFile $out -RunId $RunId -OnlyRules $OnlyRules
  }
  if (Test-Path $out) { Get-Content $out | Add-Content $violationsAll }
}

if (-not $SkipAst) {
  # AST runners shipped as scaffolds in Session 2; they emit a single FYI row noting they're not yet executed.
  $out = Join-Path $OutputFolder 'violations-ast.jsonl'
  Invoke-Engine 'ast-runner (scaffold)' {
    @{
      ruleId = '(scaffold)'
      ruleName = 'AST runners scaffolded but not yet wired'
      detectorType = 'ast'
      filePath = '(scaffold)'
      lineNumber = 0
      lineContent = 'Session 3 will execute ast-runner-fe.ts and ast-runner-be.cs'
      matchedPattern = ''
      severity = 'fyi'
      runId = $RunId
      detectedAt = $nowIso
    } | ConvertTo-Json -Compress | Set-Content $out
  }
  if (Test-Path $out) { Get-Content $out | Add-Content $violationsAll }
}

if (-not $SkipSemantic) {
  $out = Join-Path $OutputFolder 'violations-semantic.jsonl'
  Invoke-Engine 'semantic-judge (scaffold)' {
    @{
      ruleId = '(scaffold)'
      ruleName = 'Semantic judge scaffolded but not yet wired'
      detectorType = 'semantic-llm'
      filePath = '(scaffold)'
      lineNumber = 0
      lineContent = 'Session 3 will wire tri-mindset Brain calls'
      matchedPattern = ''
      severity = 'fyi'
      runId = $RunId
      detectedAt = $nowIso
    } | ConvertTo-Json -Compress | Set-Content $out
  }
  if (Test-Path $out) { Get-Content $out | Add-Content $violationsAll }
}

# ----------------------------------------------------------------
# Aggregate report
# ----------------------------------------------------------------

Write-Host ""
Write-Host "▶ Aggregating reports"

$violations = @()
if (Test-Path $violationsAll) {
  $violations = Get-Content $violationsAll | Where-Object { $_ } | ForEach-Object { $_ | ConvertFrom-Json }
}

$totalCount     = $violations.Count
$realViolations = $violations | Where-Object { $_.severity -ne 'fyi' -and $_.ruleId -notlike '(scaffold)' }
$mustCount      = ($realViolations | Where-Object { $_.severity -eq 'must' }).Count
$shouldCount    = ($realViolations | Where-Object { $_.severity -eq 'should' }).Count
$niceCount      = ($realViolations | Where-Object { $_.severity -eq 'nice' }).Count

# AUDIT_SUMMARY.md
$summary = @"
---
runId: $RunId
generatedAt: $nowIso
targets: $($TargetRepos -join ', ')
---

# Code Audit Summary — $RunId

> Run started $($start.ToString('yyyy-MM-dd HH:mm:ss')) · scanned $($TargetRepos.Count) repos.

## Totals

| Severity | Count |
|---|---|
| 🔴 must | $mustCount |
| 🟠 should | $shouldCount |
| 🟢 nice | $niceCount |
| **Total real violations** | **$($realViolations.Count)** |

## By rule (top 10)

| Rule | Name | Severity | Count |
|---|---|---|---|
"@

$byRule = $realViolations | Group-Object ruleId | Sort-Object Count -Descending | Select-Object -First 10
foreach ($g in $byRule) {
  $sample = $g.Group[0]
  $summary += "`n| ``$($sample.ruleId)`` | $($sample.ruleName) | $($sample.severity) | $($g.Count) |"
}

$summary += "`n`n## By repo`n`n| Repo | Violations |`n|---|---|`n"
$byRepo = $realViolations | Group-Object targetRepo | Sort-Object Count -Descending
foreach ($g in $byRepo) {
  $summary += "| ``$($g.Name)`` | $($g.Count) |`n"
}

$summary += "`n## High severity (first 20)`n`n| Rule | File | Line | Snippet |`n|---|---|---|---|`n"
$highSev = $realViolations | Where-Object { $_.severity -eq 'must' } | Select-Object -First 20
foreach ($v in $highSev) {
  $snippet = ($v.lineContent -replace '\|', '\|').Substring(0, [Math]::Min(80, $v.lineContent.Length))
  $summary += "| ``$($v.ruleId)`` | ``$($v.filePath)`` | $($v.lineNumber) | ``$snippet`` |`n"
}

$summary += "`n## Outputs`n- ``violations.jsonl`` — every violation as JSONL`n- ``violations-regex.jsonl`` · ``violations-structural.jsonl`` · ``violations-ast.jsonl`` · ``violations-semantic.jsonl`` — per-engine streams`n- ``engine-runtimes.md`` — performance + failure reasons`n"

$summary | Set-Content (Join-Path $OutputFolder 'AUDIT_SUMMARY.md')

# violations-by-rule.md
$byRuleMd = "# Violations by rule — $RunId`n`n"
foreach ($g in ($realViolations | Group-Object ruleId | Sort-Object Count -Descending)) {
  $byRuleMd += "## ``$($g.Name)`` — $($g.Group[0].ruleName) ($($g.Count) violations)`n`n"
  $byRuleMd += "| # | File | Line | Snippet |`n|---|---|---|---|`n"
  $idx = 1
  foreach ($v in ($g.Group | Sort-Object filePath, lineNumber)) {
    $snippet = ($v.lineContent -replace '\|','\|').Substring(0, [Math]::Min(80, $v.lineContent.Length))
    $byRuleMd += "| $idx | ``$($v.filePath)`` | $($v.lineNumber) | ``$snippet`` |`n"
    $idx++
  }
  $byRuleMd += "`n"
}
$byRuleMd | Set-Content (Join-Path $OutputFolder 'violations-by-rule.md')

# violations-by-file.md
$byFileMd = "# Violations by file — $RunId`n`n"
foreach ($g in ($realViolations | Group-Object filePath | Sort-Object Count -Descending)) {
  $byFileMd += "## ``$($g.Name)`` ($($g.Count) violations)`n`n"
  $byFileMd += "| Rule | Line | Severity | Snippet |`n|---|---|---|---|`n"
  foreach ($v in ($g.Group | Sort-Object lineNumber)) {
    $snippet = ($v.lineContent -replace '\|','\|').Substring(0, [Math]::Min(80, $v.lineContent.Length))
    $byFileMd += "| ``$($v.ruleId)`` | $($v.lineNumber) | $($v.severity) | ``$snippet`` |`n"
  }
  $byFileMd += "`n"
}
$byFileMd | Set-Content (Join-Path $OutputFolder 'violations-by-file.md')

# high-severity.md
$highMd = "# High-severity violations — $RunId`n`nAll ``severity: must`` rows below need attention before next ship.`n`n"
$highMd += "| Rule | File | Line | Snippet | Suggested fix |`n|---|---|---|---|---|`n"
foreach ($v in ($realViolations | Where-Object { $_.severity -eq 'must' } | Sort-Object ruleId, filePath)) {
  $snippet = ($v.lineContent -replace '\|','\|').Substring(0, [Math]::Min(60, $v.lineContent.Length))
  $fix = if ($v.suggestedFix) { $v.suggestedFix } else { '_see rule note_' }
  $highMd += "| ``$($v.ruleId)`` | ``$($v.filePath)`` | $($v.lineNumber) | ``$snippet`` | $fix |`n"
}
$highMd | Set-Content (Join-Path $OutputFolder 'high-severity.md')

# Append totals to engine log
"`n## Totals`n- Total emitted: $totalCount`n- Real violations: $($realViolations.Count)`n- must: $mustCount · should: $shouldCount · nice: $niceCount" | Add-Content $engineLog

$end = Get-Date
$total = ($end - $start).TotalSeconds
Write-Host ""
Write-Host "================================================================"
Write-Host "  ✅ Audit complete — $($realViolations.Count) violations across $($TargetRepos.Count) repos"
Write-Host "  ⏱ Total time: $([math]::Round($total,1))s"
Write-Host "  📁 Output: $OutputFolder"
Write-Host "================================================================"
