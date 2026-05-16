# *** Falcon Overnight Brain — Morning Report Synthesizer ***
# *** Reads all overnight artifacts and produces ONE MORNING_REPORT.md ***
# *** Run after the 4 agents + 2 audits finish ***

[CmdletBinding()]
param(
  [string] $Root = 'C:\Falcon\Brain Outputs\reports\night-shift\2026-05-16-overnight-deep-dive'
)

$ErrorActionPreference = 'Continue'
$now = (Get-Date)
$outFile = Join-Path $Root 'MORNING_REPORT.md'

# Gather counts from each artifact folder
function Count-Files {
  param([string]$Path, [string]$Filter = '*.md')
  if (-not (Test-Path $Path)) { return 0 }
  (Get-ChildItem $Path -Filter $Filter -File | Measure-Object).Count
}

$perRuleCount = Count-Files (Join-Path $Root 'per-rule')
$perFileCount = Count-Files (Join-Path $Root 'per-file')
$patternCount = Count-Files (Join-Path $Root 'patterns') - 1  # exclude PATTERNS_INDEX.md
if ($patternCount -lt 0) { $patternCount = 0 }
$perAppCount  = Count-Files (Join-Path $Root 'per-app')

# Pull totals from audit JSONL (the bigger of the two)
$jsonl1 = 'C:\Falcon\Brain Outputs\reports\night-shift\night-shift-2026-05-16-overnight\audit\violations.jsonl'
$jsonl2 = 'C:\Falcon\Brain Outputs\reports\code-audit\overnight-frontend-deep-dive\violations.jsonl'

$violations = @()
foreach ($f in @($jsonl1, $jsonl2)) {
  if (Test-Path $f) {
    $violations += (Get-Content $f | Where-Object { $_ } | ForEach-Object { try { $_ | ConvertFrom-Json } catch { } })
  }
}
$real = $violations | Where-Object { $_.severity -ne 'fyi' -and $_.ruleId -notlike '(scaffold)' }
$realCount = ($real | Measure-Object).Count
$mustCount = ($real | Where-Object { $_.severity -eq 'must' } | Measure-Object).Count

# Top rules
$topRules = $real | Group-Object ruleId | Sort-Object Count -Descending | Select-Object -First 10
# Top files
$topFiles = $real | Group-Object filePath | Sort-Object Count -Descending | Select-Object -First 10
# Per repo
$perRepo = $real | Group-Object targetRepo | Sort-Object Count -Descending

# Build the report
$md = @"
---
type: morning-report
runId: 2026-05-16-overnight-deep-dive
generatedAt: $($now.ToUniversalTime().ToString('o'))
artifacts:
  perRuleFixPlans: $perRuleCount
  perFileFixPlans: $perFileCount
  refactorPatterns: $patternCount
  appScorecards: $perAppCount
  totalViolations: $realCount
  mustSeverity: $mustCount
---

# 🌅 Falcon Overnight Brain — Morning Report

> Generated $($now.ToString('yyyy-MM-dd HH:mm')). Welcome back.

## TL;DR — what last night produced

| Artifact | Count | Folder |
|---|---|---|
| Per-rule fix plans | **$perRuleCount** | ``per-rule/`` |
| Per-file fix plans (top offenders) | **$perFileCount** | ``per-file/`` |
| Refactor pattern atlas | **$patternCount** | ``patterns/`` |
| App + lib scorecards | **$perAppCount** | ``per-app/`` |
| Real violations detected | **$realCount** | ``audit/violations.jsonl`` |
| ↳ Must-severity (act on first) | **$mustCount** | ``audit/high-severity.md`` |

## The 10 highest-violation rules (across all audited repos)

| Rank | Rule | Count | Fix plan |
|---|---|---|---|
"@

$rank = 1
foreach ($g in $topRules) {
  $sample = $g.Group[0]
  $planPath = "per-rule/$($sample.ruleId.ToLower())-fix-plan.md"
  $md += "`n| $rank | ``$($sample.ruleId)`` $($sample.ruleName) | $($g.Count) | [→]($planPath) |"
  $rank++
}

$md += @"


## The 10 worst-offender files

| Rank | File | Violations | Fix plan |
|---|---|---|---|
"@

$rank = 1
foreach ($g in $topFiles) {
  $md += "`n| $rank | ``$($g.Name)`` | $($g.Count) | per-file/$('{0:D2}' -f $rank)-*.md |"
  $rank++
}

$md += @"


## By repo

| Repo | Violations |
|---|---|
"@

foreach ($g in $perRepo) {
  $shortName = Split-Path $g.Name -Leaf
  $md += "`n| ``$shortName`` | $($g.Count) |"
}

$md += @"


## What every artifact contains

### ``per-rule/`` — 22 plans (R-FE-* + R-NOOR-*)

For each frontend rule, a fix plan with:
- Rule restatement · violation count · severity
- Why this matters (architectural cost)
- Step-by-step fix instructions
- Rollback hint
- Verification command
- Risk flags + related rules

### ``per-file/`` — top 30 worst offenders

For each top-30 file:
- Per-rule violation breakdown
- Ordered fix plan
- Refactor opportunities
- Verification + risk + related plans

### ``patterns/`` — refactor cluster atlas

For each repeating anti-pattern (≥5 occurrences):
- Pattern description
- Top file paths exhibiting it
- Canonical replacement code
- Detection regex (so future audits catch new instances)
- Migration steps + estimated total effort

### ``per-app/`` — per-app scorecards

For each Nx app + top libs:
- Health score 0-100
- Rule-by-rule + folder-by-folder breakdown
- Top 10 violating files in THIS app
- Rules with zero violations (the good news)
- Prioritized morning todo list

## How to use this report tomorrow

1. **Open** ``patterns/PATTERNS_INDEX.md`` — pick the 2-3 highest-leverage refactors
2. **Cross-reference** the per-rule and per-file plans for context
3. **Dispatch** to ``ammar-web-platform-ui`` agent: one pattern at a time
4. **Re-run** the audit after each batch to measure drift
5. **Promote** any new learning back to the rulebook (Session 3.x)

## What did NOT run last night

- AST detectors (FE/BE) — scaffolded only; need TS Compiler API + Roslyn build wiring (Session 3.1)
- Brain API semantic-judge — dry-run only; live calls deferred (Session 3.2)
- Auto-apply patches — boundary doctrine forbids until explicit approval (always)

## Verification

This report was generated by ``synthesize-morning-report.ps1`` from artifacts in:
- ``$Root``

Re-run anytime with:
``powershell -ExecutionPolicy Bypass -File "$Root\synthesize-morning-report.ps1"``

---

🌙 *Generated by Falcon Overnight Brain — Session 2.x + 3.0*
"@

$md | Set-Content $outFile -Encoding UTF8
Write-Host "✅ Morning report written to: $outFile"
Write-Host "   Real violations: $realCount (must: $mustCount)"
Write-Host "   Artifacts: rules=$perRuleCount files=$perFileCount patterns=$patternCount apps=$perAppCount"
