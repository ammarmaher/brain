# *** Falcon Rulebook — Regex Detector Engine ***
# *** Reads R-*.md frontmatter where detector.type=regex, scans target repos, emits violations to JSONL ***

[CmdletBinding()]
param(
  [Parameter(Mandatory)] [string]   $RulesFolder,
  [Parameter(Mandatory)] [string[]] $TargetRepos,
  [Parameter(Mandatory)] [string]   $OutputFile,
  [string] $RunId = (Get-Date -Format 'yyyyMMddHHmmss'),
  [string[]] $OnlyRules = @(),   # restrict to specific ruleIds
  [switch] $VerboseDetector
)

$ErrorActionPreference = 'Stop'
$nowIso = (Get-Date).ToUniversalTime().ToString('o')

# ----------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------

function Get-RuleFrontmatter {
  param([string] $FilePath)
  $raw = Get-Content $FilePath -Raw
  if ($raw -notmatch '(?s)^---\r?\n(.+?)\r?\n---') { return $null }
  $fm = $matches[1]

  $result = @{}

  # Scalars
  foreach ($key in @('ruleId', 'name', 'category', 'severity')) {
    if ($fm -match "(?m)^${key}:\s*(.+)$") {
      $result[$key] = $matches[1].Trim().Trim("'", '"')
    }
  }

  # detector.type
  if ($fm -match '(?m)^detector:\s*\r?\n(?:[ \t]+.*\r?\n)+') {
    $detBlock = $matches[0]
    if ($detBlock -match '(?m)^[ \t]+type:\s*(.+)$') {
      $result['detectorType'] = $matches[1].Trim()
    }
    # detector.patterns: list under indented "patterns:" key
    if ($detBlock -match "(?ms)^[ \t]+patterns:\s*\r?\n((?:[ \t]+-\s*['""].*['""]\r?\n)+)") {
      $patternsBlock = $matches[1]
      $patterns = @()
      foreach ($line in $patternsBlock -split "`n") {
        if ($line -match "^[ \t]+-\s*['""](.*)['""]\s*$") {
          $patterns += $matches[1]
        }
      }
      $result['patterns'] = $patterns
    }
    # detector.exemptPatterns
    if ($detBlock -match "(?ms)^[ \t]+exemptPatterns:\s*\r?\n((?:[ \t]+-\s*['""].*['""]\r?\n)+)") {
      $exBlock = $matches[1]
      $exPatterns = @()
      foreach ($line in $exBlock -split "`n") {
        if ($line -match "^[ \t]+-\s*['""](.*)['""]\s*$") {
          $exPatterns += $matches[1]
        }
      }
      $result['exemptPatterns'] = $exPatterns
    }
  }

  # scope.paths
  if ($fm -match '(?ms)^scope:\s*\r?\n((?:[ \t]+.*\r?\n)+)') {
    $scopeBlock = $matches[1]
    if ($scopeBlock -match "(?ms)^[ \t]+paths:\s*\r?\n((?:[ \t]+-\s*['""].*['""]\r?\n)+)") {
      $pathsBlock = $matches[1]
      $paths = @()
      foreach ($line in $pathsBlock -split "`n") {
        if ($line -match "^[ \t]+-\s*['""](.*)['""]\s*$") {
          $paths += $matches[1]
        }
      }
      $result['scopePaths'] = $paths
    }
    if ($scopeBlock -match "(?ms)^[ \t]+exemptPaths:\s*\r?\n((?:[ \t]+-\s*['""].*['""]\r?\n)+)") {
      $epBlock = $matches[1]
      $eps = @()
      foreach ($line in $epBlock -split "`n") {
        if ($line -match "^[ \t]+-\s*['""](.*)['""]\s*$") {
          $eps += $matches[1]
        }
      }
      $result['scopeExemptPaths'] = $eps
    }
  }

  # autoFix.patchHint (used as suggestedFix in the violation)
  if ($fm -match "(?ms)^autoFix:\s*\r?\n((?:[ \t]+.*\r?\n)+)") {
    $afBlock = $matches[1]
    if ($afBlock -match "(?m)^[ \t]+patchHint:\s*['""]?(.*?)['""]?\s*$") {
      $result['patchHint'] = $matches[1].Trim()
    }
  }

  return $result
}

function Convert-GlobToRegex {
  param([string] $Glob)
  # Convert a path glob (e.g. apps/**/*.html) into a regex
  $rx = [regex]::Escape($Glob)
  $rx = $rx -replace '\\\*\\\*', '.*'        # **  -> .*
  $rx = $rx -replace '\\\*',     '[^/\\\\]*' # *   -> [^/\\]*
  $rx = $rx -replace '\\\?',     '.'         # ?   -> .
  return '^' + $rx + '$'
}

function Test-PathMatches {
  param([string] $RelPath, [string[]] $Globs)
  if (-not $Globs -or $Globs.Count -eq 0) { return $false }
  # Normalize separators to forward-slash for matching
  $norm = $RelPath -replace '\\', '/'
  foreach ($g in $Globs) {
    $rx = Convert-GlobToRegex $g
    if ($norm -match $rx) { return $true }
  }
  return $false
}

function Load-ExemptionRegistry {
  param([string] $ExemptionsFile)
  $registry = @{}
  if (-not (Test-Path $ExemptionsFile)) { return $registry }
  $lines = Get-Content $ExemptionsFile
  $currentRule = $null
  foreach ($line in $lines) {
    if ($line -match '^### (R-[A-Z]+-\d+)') {
      $currentRule = $matches[1]
      if (-not $registry.ContainsKey($currentRule)) {
        $registry[$currentRule] = @()
      }
      continue
    }
    # Table row: | path-glob | reason | owner | expires |
    if ($currentRule -and $line -match '^\|\s*`([^`]+)`\s*\|') {
      $registry[$currentRule] += $matches[1]
    }
  }
  return $registry
}

# ----------------------------------------------------------------
# Main
# ----------------------------------------------------------------

Write-Host "=== Falcon Rulebook — Regex Detector Engine ==="
Write-Host "Run ID    : $RunId"
Write-Host "Rules     : $RulesFolder"
Write-Host "Targets   : $($TargetRepos -join ', ')"
Write-Host "Output    : $OutputFile"

# Load rules
$ruleFiles = Get-ChildItem -Path $RulesFolder -Filter 'R-*.md' -Recurse
Write-Host "Loaded $($ruleFiles.Count) rule files"

$regexRules = @()
foreach ($rf in $ruleFiles) {
  $fm = Get-RuleFrontmatter -FilePath $rf.FullName
  if ($null -eq $fm) { continue }
  if ($fm.detectorType -ne 'regex') { continue }
  if ($OnlyRules.Count -gt 0 -and $OnlyRules -notcontains $fm.ruleId) { continue }
  $regexRules += $fm
}
Write-Host "Selected $($regexRules.Count) regex rules"

# Load exemption registry
$exemptions = Load-ExemptionRegistry -ExemptionsFile (Join-Path $RulesFolder 'exemptions/EXEMPTIONS.md')
Write-Host "Loaded exemptions for $($exemptions.Keys.Count) rules"

# Open output stream
$outDir = Split-Path -Path $OutputFile -Parent
if ($outDir -and -not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }
if (Test-Path $OutputFile) { Remove-Item $OutputFile -Force }
New-Item -ItemType File -Force -Path $OutputFile | Out-Null

$violationCount = 0
$filesScanned   = 0

foreach ($rule in $regexRules) {
  $ruleId = $rule.ruleId
  if ($VerboseDetector) { Write-Host "[$ruleId] $($rule.name)" }

  # Resolve scope across all target repos
  foreach ($repo in $TargetRepos) {
    if (-not (Test-Path $repo)) {
      Write-Warning "  Target repo missing: $repo"
      continue
    }

    # Collect candidate files using each scope glob
    $candidates = New-Object System.Collections.ArrayList
    foreach ($glob in $rule.scopePaths) {
      try {
        $hits = Get-ChildItem -Path $repo -Recurse -File -Include ($glob -replace '.*[/\\]', '') -ErrorAction SilentlyContinue |
                Where-Object { (Resolve-Path $_.FullName -Relative).TrimStart('.\').Replace('\','/') -match (Convert-GlobToRegex ($glob -replace '^[/\\]+', '')) }
        foreach ($h in $hits) { [void]$candidates.Add($h) }
      } catch {
        # Fallback: enumerate everything, filter by glob regex
      }
    }
    # Fallback enumeration if include-based collection produced nothing — slower but robust
    if ($candidates.Count -eq 0) {
      $allFiles = Get-ChildItem -Path $repo -Recurse -File -ErrorAction SilentlyContinue
      foreach ($f in $allFiles) {
        $rel = ($f.FullName.Substring($repo.Length).TrimStart('\','/')) -replace '\\', '/'
        if (Test-PathMatches -RelPath $rel -Globs $rule.scopePaths) {
          [void]$candidates.Add($f)
        }
      }
    }

    foreach ($file in $candidates) {
      $rel = ($file.FullName.Substring($repo.Length).TrimStart('\','/')) -replace '\\', '/'

      # Apply scope.exemptPaths
      if (Test-PathMatches -RelPath $rel -Globs $rule.scopeExemptPaths) { continue }

      # Apply exemption registry
      $registryHit = $false
      if ($exemptions.ContainsKey($ruleId)) {
        if (Test-PathMatches -RelPath $rel -Globs $exemptions[$ruleId]) { $registryHit = $true }
      }
      if ($registryHit) { continue }

      $filesScanned++
      $lines = $null
      try { $lines = Get-Content -Path $file.FullName -ErrorAction Stop } catch { continue }

      for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        foreach ($pattern in $rule.patterns) {
          try {
            if ($line -match $pattern) {
              # Check exemptPatterns on the matching segment
              $exempted = $false
              if ($rule.exemptPatterns) {
                foreach ($exp in $rule.exemptPatterns) {
                  if ($line -match $exp) { $exempted = $true; break }
                }
              }
              if ($exempted) { continue }

              $violation = [ordered]@{
                ruleId           = $ruleId
                ruleName         = $rule.name
                ruleCategory     = $rule.category
                severity         = $rule.severity
                detectorType     = 'regex'
                targetRepo       = $repo
                filePath         = $rel
                lineNumber       = $i + 1
                lineContent      = $line.Trim()
                matchedPattern   = $pattern
                exemptByRule     = $false
                exemptByRegistry = $false
                suggestedFix     = $rule.patchHint
                detectedAt       = $nowIso
                runId            = $RunId
              }
              $violation | ConvertTo-Json -Compress | Add-Content -Path $OutputFile
              $violationCount++
            }
          } catch {
            # Bad regex in rule frontmatter — log and continue
            Write-Warning "[$ruleId] regex error on pattern '$pattern': $_"
          }
        }
      }
    }
  }
}

Write-Host ""
Write-Host "=== Run complete ==="
Write-Host "Rules executed : $($regexRules.Count)"
Write-Host "Files scanned  : $filesScanned"
Write-Host "Violations     : $violationCount"
Write-Host "Output         : $OutputFile"
