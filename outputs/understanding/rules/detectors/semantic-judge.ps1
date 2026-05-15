# *** Falcon Rulebook — Semantic-LLM Detector Engine ***
# *** Wraps tri-mindset Brain (ChatGPT + Gemini + Claude) for nuanced rules ***
# *** Reads rule frontmatter where detector.type=semantic-llm ***
#
# Status: SCAFFOLD shipped Session 2. Session 3 wires real Brain API calls.
# Today: emits one FYI row per (rule × file in scope) noting that the rule was
#        identified as semantic-LLM and queued for review. This proves the
#        engine integrates with the orchestrator without spending API tokens
#        until the verdict prompts are designed.

[CmdletBinding()]
param(
  [Parameter(Mandatory)] [string]   $RulesFolder,
  [Parameter(Mandatory)] [string[]] $TargetRepos,
  [Parameter(Mandatory)] [string]   $OutputFile,
  [string] $RunId = (Get-Date -Format 'yyyyMMddHHmmss'),
  [string[]] $OnlyRules = @(),
  [int]    $MaxFilesPerRule = 30,
  [int]    $MaxFilesTotal   = 300,
  [switch] $DryRun,                     # default behavior in Session 2
  [switch] $UseBrain                    # Session 3+: actually call Brain mindsets
)

$ErrorActionPreference = 'Stop'
$nowIso = (Get-Date).ToUniversalTime().ToString('o')

. (Join-Path $PSScriptRoot '_detector-helpers.ps1')

Write-Host "=== Falcon Rulebook — Semantic-LLM Judge ==="
Write-Host "Run ID    : $RunId"
Write-Host "Mode      : $(if ($UseBrain) {'live Brain calls'} else {'dry-run (no API spend)'})"
Write-Host "Rules     : $RulesFolder"
Write-Host "Targets   : $($TargetRepos -join ', ')"
Write-Host "Output    : $OutputFile"

$ruleFiles = Get-ChildItem $RulesFolder -Filter 'R-*.md' -Recurse
$semanticRules = @()
foreach ($rf in $ruleFiles) {
  $fm = Get-RuleFrontmatter -FilePath $rf.FullName
  if ($null -eq $fm) { continue }
  if ($fm.detectorType -ne 'semantic-llm') { continue }
  if ($OnlyRules.Count -gt 0 -and $OnlyRules -notcontains $fm.ruleId) { continue }
  $semanticRules += $fm
}
Write-Host "Selected $($semanticRules.Count) semantic-LLM rules"

$outDir = Split-Path -Path $OutputFile -Parent
if ($outDir -and -not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
if (Test-Path $OutputFile) { Remove-Item $OutputFile -Force }
New-Item -ItemType File -Force -Path $OutputFile | Out-Null

$totalFilesQueued = 0
$totalEmitted     = 0

# ----------------------------------------------------------------
# Brain API wiring (Session 3+)
# ----------------------------------------------------------------
# When -UseBrain is set, each candidate (rule × file) is dispatched to the
# Brain Skill at C:\Falcon\Brain\ with a verdict prompt of the form:
#
#   You are auditing Falcon code against rule {ruleId}: {ruleName}.
#   Rule body:
#   ---
#   {Why it exists section}
#   {Detector strategy section}
#   {Examples section ✅/❌}
#   ---
#   File path: {filePath}
#   File content (truncated to 8 KB):
#   ---
#   {fileContent}
#   ---
#   Answer ONLY in JSON:
#     {"verdict":"VIOLATION"|"CLEAN"|"UNCLEAR","reason":"...","snippet":"...","lineNumber":N|null}
#
# Each mindset returns a verdict. The orchestrator takes consensus:
#   - 3/3 VIOLATION → emit with severity from rule
#   - 2/3 VIOLATION → emit with FYI severity + "needs human review"
#   - <2 VIOLATION  → don't emit
#
# Costs: at ~500 tokens per (rule × file), 30 files × 8 rules × 3 mindsets ≈ 360 calls.
# Capped by -MaxFilesPerRule and -MaxFilesTotal to keep nightly budget bounded.

function Invoke-BrainVerdict {
  param(
    [string] $RuleId, [string] $RuleName, [string] $RuleBody,
    [string] $FilePath, [string] $FileContent
  )
  # TODO Session 3: real wiring
  # Suggested entry: C:\Falcon\Brain\skills\tri-mindset\verdict.ps1
  return @{
    verdict = 'UNCLEAR'
    reason  = 'Session 2 scaffold — Brain not wired yet'
    snippet = ''
    lineNumber = $null
  }
}

# ----------------------------------------------------------------
# Main loop
# ----------------------------------------------------------------

foreach ($rule in $semanticRules) {
  $ruleId = $rule.ruleId
  Write-Host "[$ruleId] $($rule.name)  (max $MaxFilesPerRule files)"

  $perRuleCount = 0

  foreach ($repo in $TargetRepos) {
    if (-not (Test-Path $repo)) { continue }

    # Collect candidates by scope
    $allFiles = Get-ChildItem $repo -Recurse -File -ErrorAction SilentlyContinue
    foreach ($file in $allFiles) {
      if ($perRuleCount -ge $MaxFilesPerRule) { break }
      if ($totalFilesQueued -ge $MaxFilesTotal) { break }

      $rel = (($file.FullName).Substring($repo.Length).TrimStart('\','/')) -replace '\\','/'
      if ($rule.scopePaths.Count -gt 0 -and -not (Test-PathMatches -RelPath $rel -Globs $rule.scopePaths)) { continue }
      if (Test-PathMatches -RelPath $rel -Globs $rule.scopeExemptPaths) { continue }

      $perRuleCount++
      $totalFilesQueued++

      if ($UseBrain) {
        $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
        if ($content.Length -gt 8000) { $content = $content.Substring(0, 8000) }
        $verdict = Invoke-BrainVerdict -RuleId $ruleId -RuleName $rule.name -RuleBody '' -FilePath $rel -FileContent $content
        if ($verdict.verdict -in @('VIOLATION', 'UNCLEAR')) {
          $sev = if ($verdict.verdict -eq 'VIOLATION') { $rule.severity } else { 'fyi' }
          $violation = [ordered]@{
            ruleId           = $ruleId
            ruleName         = $rule.name
            ruleCategory     = $rule.category
            severity         = $sev
            detectorType     = 'semantic-llm'
            targetRepo       = $repo
            filePath         = $rel
            lineNumber       = $verdict.lineNumber
            lineContent      = $verdict.snippet
            matchedPattern   = 'semantic-llm verdict: ' + $verdict.verdict
            exemptByRule     = $false
            exemptByRegistry = $false
            suggestedFix     = $verdict.reason
            detectedAt       = $nowIso
            runId            = $RunId
          }
          $violation | ConvertTo-Json -Compress | Add-Content -Path $OutputFile
          $totalEmitted++
        }
      } else {
        # Dry-run: emit one FYI row per file noting it would be queued
        $violation = [ordered]@{
          ruleId           = $ruleId
          ruleName         = $rule.name
          ruleCategory     = $rule.category
          severity         = 'fyi'
          detectorType     = 'semantic-llm'
          targetRepo       = $repo
          filePath         = $rel
          lineNumber       = 0
          lineContent      = '(would-be queued to tri-mindset Brain in -UseBrain mode)'
          matchedPattern   = 'scope match only'
          exemptByRule     = $false
          exemptByRegistry = $false
          suggestedFix     = $rule.patchHint
          detectedAt       = $nowIso
          runId            = $RunId
        }
        $violation | ConvertTo-Json -Compress | Add-Content -Path $OutputFile
        $totalEmitted++
      }
    }
    if ($totalFilesQueued -ge $MaxFilesTotal) { break }
  }
  if ($totalFilesQueued -ge $MaxFilesTotal) {
    Write-Host "  Reached MaxFilesTotal ($MaxFilesTotal); stopping further rule scans this run"
    break
  }
}

Write-Host ""
Write-Host "=== Semantic-LLM run complete ==="
Write-Host "Rules processed   : $($semanticRules.Count)"
Write-Host "Files queued      : $totalFilesQueued"
Write-Host "Rows emitted      : $totalEmitted"
Write-Host "Output            : $OutputFile"
