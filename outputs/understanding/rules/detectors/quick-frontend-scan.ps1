# *** Quick Frontend Scan — narrow-scoped fast detector ***
# *** Scans ONLY apps/ + libs/ (skips node_modules, .angular, .nx, dist) ***
# *** Used by overnight agents when full audit is too slow ***

[CmdletBinding()]
param(
  [string] $TargetRepo  = 'C:\Falcon\Falcon\falcon-web-platform-ui',
  [string] $RulesFolder = 'C:\Falcon\Brain Outputs\understanding\rules',
  [string] $OutputFile  = 'C:\Falcon\Brain Outputs\reports\code-audit\quick-frontend\violations.jsonl',
  [string] $RunId       = 'quick-frontend'
)

$ErrorActionPreference = 'Continue'
$nowIso = (Get-Date).ToUniversalTime().ToString('o')

. (Join-Path $PSScriptRoot '_detector-helpers.ps1')

$outDir = Split-Path -Path $OutputFile -Parent
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
if (Test-Path $OutputFile) { Remove-Item $OutputFile -Force }
New-Item -ItemType File -Force -Path $OutputFile | Out-Null

# Load only frontend rules with detector.type == regex
$ruleFiles = Get-ChildItem -Path $RulesFolder -Filter 'R-*.md' -Recurse |
  Where-Object { $_.FullName -match '\\(frontend|frontend-admin-console)\\' }

$rules = @()
foreach ($rf in $ruleFiles) {
  $fm = Get-RuleFrontmatter -FilePath $rf.FullName
  if ($null -eq $fm) { continue }
  if ($fm.detectorType -ne 'regex') { continue }
  $rules += $fm
}
Write-Host "Loaded $($rules.Count) frontend regex rules"

# Collect candidate files (narrowed scope)
$scanRoots = @(
  (Join-Path $TargetRepo 'apps'),
  (Join-Path $TargetRepo 'libs')
)
$files = @()
foreach ($r in $scanRoots) {
  if (-not (Test-Path $r)) { continue }
  $files += Get-ChildItem $r -Recurse -File -Include '*.html','*.ts','*.css','*.scss','*.json' -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch '\\(node_modules|\.angular|\.nx|dist|\.git|\.vitepress)\\' }
}
Write-Host "Scanning $($files.Count) candidate files"

$emitted = 0
$ruleHits = @{}
foreach ($file in $files) {
  $rel = (($file.FullName).Substring($TargetRepo.Length).TrimStart('\','/')) -replace '\\','/'
  $lines = $null
  try { $lines = Get-Content $file.FullName -ErrorAction Stop } catch { continue }
  foreach ($rule in $rules) {
    if ($rule.scopePaths.Count -gt 0 -and -not (Test-PathMatches -RelPath $rel -Globs $rule.scopePaths)) { continue }
    if (Test-PathMatches -RelPath $rel -Globs $rule.scopeExemptPaths) { continue }
    for ($i = 0; $i -lt $lines.Count; $i++) {
      $line = $lines[$i]
      foreach ($pattern in $rule.patterns) {
        try {
          if ($line -match $pattern) {
            $exempted = $false
            if ($rule.exemptPatterns) {
              foreach ($exp in $rule.exemptPatterns) {
                if ($line -match $exp) { $exempted = $true; break }
              }
            }
            if ($exempted) { continue }
            $violation = [ordered]@{
              ruleId           = $rule.ruleId
              ruleName         = $rule.name
              ruleCategory     = $rule.category
              severity         = $rule.severity
              detectorType     = 'regex'
              targetRepo       = $TargetRepo
              filePath         = $rel
              lineNumber       = $i + 1
              lineContent      = $line.Trim()
              matchedPattern   = $pattern
              detectedAt       = $nowIso
              runId            = $RunId
            }
            $violation | ConvertTo-Json -Compress | Add-Content -Path $OutputFile
            $emitted++
            if (-not $ruleHits.ContainsKey($rule.ruleId)) { $ruleHits[$rule.ruleId] = 0 }
            $ruleHits[$rule.ruleId]++
          }
        } catch { }
      }
    }
  }
}

Write-Host ""
Write-Host "=== Quick frontend scan complete ==="
Write-Host "Files scanned : $($files.Count)"
Write-Host "Violations    : $emitted"
Write-Host "Output        : $OutputFile"
Write-Host ""
Write-Host "Violations by rule:"
$ruleHits.GetEnumerator() | Sort-Object Value -Descending | ForEach-Object {
  Write-Host "  $($_.Key): $($_.Value)"
}
